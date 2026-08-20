import { NextRequest, NextResponse } from "next/server";
import { contactSearchService } from "@/services/contactSearchService";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "dummy-key-for-build",
});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { query, sessionId } = body;

    if (!query || typeof query !== "string") {
      return NextResponse.json({ results: [] }, { status: 400 });
    }

    let activeSessionId = sessionId;

    // If no sessionId, create a new chat session
    if (!activeSessionId) {
      const newSession = await prisma.aIChatSession.create({
        data: {
          userId,
          title: query.slice(0, 40) + (query.length > 40 ? "..." : ""),
        },
      });
      activeSessionId = newSession.id;
    }

    // Save the User's message first
    await prisma.aIChatMessage.create({
      data: {
        sessionId: activeSessionId,
        role: "user",
        content: query,
      },
    });

    // Fetch previous chat history
    const previousMessages = await prisma.aIChatMessage.findMany({
      where: { sessionId: activeSessionId },
      orderBy: { createdAt: "asc" },
    });

    // Construct OpenAI messages
    const systemPrompt = `You are an intelligent networking assistant for 1Reff.
Your job is to help users find, evaluate, and connect with professionals.
If the user is asking to find someone, ALWAYS use the search_contacts tool to query the database.
CRITICAL: When you use the search_contacts tool, DO NOT list the names, companies, or details of the contacts in your text response! The UI will render rich contact cards automatically below your message. Just provide a very brief 1-sentence intro like "Here are the professionals I found:" or "I found some matching contacts for you:".
If the user is asking a follow-up question to filter, pick, or suggest contacts from the ones you've already found, you MUST call the select_previous_contacts tool with the IDs of those contacts from the "DATA FROM PREVIOUS SEARCH". Do not just list them in text. Keep your text concise and friendly.`;

    const openAiMessages: any[] = [
      { role: "system", content: systemPrompt },
    ];

    for (const msg of previousMessages) {
      // First, push the actual message
      openAiMessages.push({
        role: msg.role,
        content: msg.content || "",
      });
      
      // Inject previous results into the LLM context as a system message so it knows what it found
      // Doing it this way prevents the LLM from mimicking it and echoing JSON to the user
      if (msg.role === "assistant" && msg.results) {
        try {
          const resultsData = typeof msg.results === "string" ? JSON.parse(msg.results) : msg.results;
          if (Array.isArray(resultsData)) {
            const cleanResults = resultsData.map((r: any) => ({
              id: r.id,
              name: r.contact_name || r.name,
              company: r.company,
              role: r.role,
              designation: r.designation,
              matchScore: r.matchScore,
              resultType: r.resultType
            }));
            openAiMessages.push({
              role: "system",
              content: `[DATA FROM PREVIOUS SEARCH]: ${JSON.stringify(cleanResults)}`
            });
          }
        } catch(e) {
          console.error("Failed to parse previous results:", e);
        }
      }
    }

    // Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", 
      messages: openAiMessages,
      tools: [
        {
          type: "function",
          function: {
            name: "search_contacts",
            description: "Search the database for contacts matching a query.",
            parameters: {
              type: "object",
              properties: {
                searchQuery: {
                  type: "string",
                  description: "The optimized search query to look up (e.g. 'Software Engineer at Google' or 'Designers in Bangalore')",
                },
              },
              required: ["searchQuery"],
            },
          },
        },
        {
          type: "function",
          function: {
            name: "select_previous_contacts",
            description: "Use this to select and display specific contacts from the DATA FROM PREVIOUS SEARCH when the user asks you to filter, suggest, or pick from them.",
            parameters: {
              type: "object",
              properties: {
                contactIds: {
                  type: "array",
                  items: { type: "string" },
                  description: "The IDs of the contacts you want to select and display.",
                },
              },
              required: ["contactIds"],
            },
          },
        },
      ],
      tool_choice: "auto",
    });

    const responseMessage = response.choices[0].message;
    let finalContent = responseMessage.content || "";
    let finalResults: any[] = [];

    // Handle tool call
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0] as any;
      
      if (toolCall.function.name === "search_contacts") {
        const args = JSON.parse(toolCall.function.arguments);
        finalResults = await contactSearchService.search(args.searchQuery || query, userId);
        
        // Pass tool result back to get a natural language summary
        openAiMessages.push(responseMessage);
        
        // Clean results for token limit
        const cleanResults = finalResults.map((r: any) => ({
            id: r.id,
            name: r.contact_name || r.name,
            company: r.company,
            role: r.role,
            designation: r.designation,
            matchScore: r.matchScore,
            resultType: r.resultType
        }));

        openAiMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(cleanResults),
        });

        const secondResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: openAiMessages,
        });

        finalContent = secondResponse.choices[0].message.content || finalContent;
      } 
      else if (toolCall.function.name === "select_previous_contacts") {
        const args = JSON.parse(toolCall.function.arguments);
        const contactIds = args.contactIds || [];
        
        // Find full contact objects from previous messages
        const fullContactsMap = new Map();
        for (const msg of previousMessages) {
          if (msg.results) {
            try {
              const parsed = typeof msg.results === "string" ? JSON.parse(msg.results) : msg.results;
              for (const c of parsed) {
                fullContactsMap.set(c.id, c);
              }
            } catch(e) {}
          }
        }
        
        finalResults = contactIds.map((id: string) => fullContactsMap.get(id)).filter(Boolean);
        finalResults.sort((a, b) => {
          const scoreA = typeof a.aiFitScore === 'number' ? a.aiFitScore : 0;
          const scoreB = typeof b.aiFitScore === 'number' ? b.aiFitScore : 0;
          return scoreB - scoreA;
        });
        
        openAiMessages.push(responseMessage);
        openAiMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: "Selected contacts successfully. Now provide a conversational response introducing them.",
        });

        const secondResponse = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: openAiMessages,
        });

        finalContent = secondResponse.choices[0].message.content || finalContent;
      }
    }

    // Save the Assistant's message
    await prisma.aIChatMessage.create({
      data: {
        sessionId: activeSessionId,
        role: "assistant",
        content: finalContent,
        // Only attach results if we actually ran a new search
        results: finalResults.length > 0 ? JSON.stringify(finalResults) : undefined,
      },
    });

    // Update the session's updatedAt timestamp
    await prisma.aIChatSession.update({
      where: { id: activeSessionId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ 
      results: finalResults, 
      message: finalContent,
      status: "success", 
      sessionId: activeSessionId 
    });
  } catch (error) {
    console.error("Error in conversational search:", error);
    return NextResponse.json(
      { error: "Failed to perform contact search", results: [] },
      { status: 500 }
    );
  }
}
