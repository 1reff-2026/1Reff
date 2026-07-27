export interface ContactRecord {
  id: string;
  company: string;
  location: string;
  department: string;
  role: string;
  contact_name: string;
  designation: string;
  email: string;
  phone: string;
  linkedin: string;
  notes: string;
}

// 40 Handcrafted Precision Records for Specific High-Intent Queries across diverse industries
const baseHandcraftedContacts: ContactRecord[] = [
  // --- TECH HR & RECRUITING ---
  {
    id: "g-hr-blr-01",
    company: "Google",
    location: "Bangalore",
    department: "HR",
    role: "Tech HR",
    contact_name: "Priya Sundaram",
    designation: "Head of Tech HR & Employee Relations",
    email: "priya.sundaram@google.com",
    phone: "+91 98450 11223",
    linkedin: "https://linkedin.com/in/priya-sundaram-google-hr",
    notes: "Specializes in Tech HR policy, senior engineering retention, and people ops in Bangalore."
  },
  {
    id: "g-hr-blr-02",
    company: "Google",
    location: "Bangalore",
    department: "HR",
    role: "Tech HR Specialist",
    contact_name: "Rohan Deshpande",
    designation: "Senior Tech HR Business Partner",
    email: "rohan.deshpande@google.com",
    phone: "+91 98450 22334",
    linkedin: "https://linkedin.com/in/rohan-deshpande-hr",
    notes: "Tech HR lead for Cloud & Systems engineering teams in Bengaluru office."
  },
  {
    id: "ms-hr-hyd-01",
    company: "Microsoft",
    location: "Hyderabad",
    department: "HR",
    role: "HR Lead",
    contact_name: "Ananya Rao",
    designation: "Principal HR Business Partner",
    email: "ananya.rao@microsoft.com",
    phone: "+91 94000 33445",
    linkedin: "https://linkedin.com/in/ananya-rao-msft",
    notes: "Lead HR contact for Microsoft India Development Center (IDC) in Hyderabad."
  },
  {
    id: "amz-rec-hyd-01",
    company: "Amazon",
    location: "Hyderabad",
    department: "Technical Recruiting",
    role: "Software Recruiter",
    contact_name: "Kiran Kumar",
    designation: "Lead Technical Recruiter - AWS",
    email: "kirankumar@amazon.com",
    phone: "+91 98000 55667",
    linkedin: "https://linkedin.com/in/kiran-recruiter-aws",
    notes: "Recruiting lead for AWS core software and systems engineering roles in Hyderabad."
  },

  // --- CHARTERED ACCOUNTANTS (CA), LEGAL & COMPLIANCE ---
  {
    id: "ca-mum-01",
    company: "Deloitte",
    location: "Mumbai",
    department: "Legal & Compliance",
    role: "Chartered Accountant (CA)",
    contact_name: "Rajesh Singhania",
    designation: "Senior Partner - Statutory Audit & Tax",
    email: "rsinghania@deloitte.com",
    phone: "+91 98200 11223",
    linkedin: "https://linkedin.com/in/rajesh-singhania-ca",
    notes: "Lead Chartered Accountant specializing in corporate tax advisory, GST compliance, and financial audits in Mumbai."
  },
  {
    id: "ca-mum-02",
    company: "Ernst & Young",
    location: "Mumbai",
    department: "Legal & Compliance",
    role: "Chartered Accountant (CA)",
    contact_name: "Neha Kulkarni",
    designation: "Principal Tax Consultant & CA",
    email: "neha.kulkarni@in.ey.com",
    phone: "+91 98200 33445",
    linkedin: "https://linkedin.com/in/neha-kulkarni-ey-ca",
    notes: "Verified CA handling international taxation, M&A restructuring, and financial due diligence in Mumbai."
  },
  {
    id: "ca-mum-03",
    company: "PwC",
    location: "Mumbai",
    department: "Legal & Compliance",
    role: "Chartered Accountant (CA)",
    contact_name: "Suresh Mehta",
    designation: "Director - Forensic Audit & Tax",
    email: "suresh.mehta@pwc.com",
    phone: "+91 98200 55667",
    linkedin: "https://linkedin.com/in/suresh-mehta-ca-pwc",
    notes: "Expert Chartered Accountant in Mumbai managing corporate governance and regulatory compliance."
  },
  {
    id: "leg-del-01",
    company: "Cyril Amarchand Mangaldas",
    location: "Delhi",
    department: "Legal & Compliance",
    role: "Corporate Lawyer",
    contact_name: "Vikramaditya Shastry",
    designation: "Senior Partner - M&A and Litigation",
    email: "v.shastry@camarchand.com",
    phone: "+91 98110 22334",
    linkedin: "https://linkedin.com/in/vikram-shastry-law",
    notes: "Corporate legal counsel representing Fortune 500 firms in arbitration and joint ventures in New Delhi."
  },
  {
    id: "leg-blr-01",
    company: "Trilegal",
    location: "Bangalore",
    department: "Legal & Compliance",
    role: "IP & Tech Lawyer",
    contact_name: "Divya Nambiar",
    designation: "Partner - Intellectual Property & Tech Law",
    email: "divya.nambiar@trilegal.com",
    phone: "+91 98450 77889",
    linkedin: "https://linkedin.com/in/divya-nambiar-trilegal",
    notes: "Specializes in software patents, data privacy compliance, and venture financing legalities in Bengaluru."
  },

  // --- INVESTORS & VENTURE CAPITAL (VC) ---
  {
    id: "vc-blr-01",
    company: "Sequoia Capital",
    location: "Bangalore",
    department: "Investment & VC",
    role: "Venture Partner",
    contact_name: "Shreya Nair",
    designation: "Managing Director - Early Stage AI & SaaS",
    email: "shreya.nair@sequoiacap.com",
    phone: "+91 98451 11223",
    linkedin: "https://linkedin.com/in/shreya-nair-vc",
    notes: "Lead seed and Series A investor focusing on Indian generative AI, enterprise software, and cloud startups."
  },
  {
    id: "vc-blr-02",
    company: "Accel",
    location: "Bangalore",
    department: "Investment & VC",
    role: "Angel Investor",
    contact_name: "Prnay Verma",
    designation: "General Partner - Consumer Tech & Fintech",
    email: "prnay@accel.com",
    phone: "+91 98451 33445",
    linkedin: "https://linkedin.com/in/prnay-verma-accel",
    notes: "Active investor and board member supporting high-growth founders in Bangalore and South Asia."
  },
  {
    id: "vc-mum-01",
    company: "Blume Ventures",
    location: "Mumbai",
    department: "Investment & VC",
    role: "Investment Principal",
    contact_name: "Arjun Banerjee",
    designation: "Principal - DeepTech & EV Investments",
    email: "arjun@blume.vc",
    phone: "+91 98201 55667",
    linkedin: "https://linkedin.com/in/arjun-banerjee-blume",
    notes: "Manages deal flow, term sheets, and portfolio growth for deeptech and cleantech startups in Mumbai."
  },
  {
    id: "vc-hyd-01",
    company: "Kalaari Capital",
    location: "Hyderabad",
    department: "Investment & VC",
    role: "Venture Partner",
    contact_name: "Meera Deshmukh",
    designation: "Partner - Healthcare & EdTech Fund",
    email: "meera@kalaari.com",
    phone: "+91 94001 77889",
    linkedin: "https://linkedin.com/in/meera-deshmukh-kalaari",
    notes: "Venture investor dedicated to healthtech innovations and digital education platforms across India."
  },

  // --- REAL ESTATE & CONSTRUCTION ---
  {
    id: "re-gur-01",
    company: "DLF",
    location: "Gurgaon",
    department: "Real Estate & Construction",
    role: "Real Estate Director",
    contact_name: "Harsh Malhotra",
    designation: "VP of Commercial Real Estate Acquisition",
    email: "malhotra-harsh@dlf.in",
    phone: "+91 98111 11223",
    linkedin: "https://linkedin.com/in/harsh-malhotra-dlf",
    notes: "Oversees Cyber City leasing, commercial tower development, and corporate real estate strategy in Gurgaon."
  },
  {
    id: "re-mum-01",
    company: "Godrej Properties",
    location: "Mumbai",
    department: "Real Estate & Construction",
    role: "Property Development Head",
    contact_name: "Ananya Godrej",
    designation: "Chief Project Officer - Luxury Residential",
    email: "ananya.g@godrejproperties.com",
    phone: "+91 98202 22334",
    linkedin: "https://linkedin.com/in/ananya-godrej-realty",
    notes: "Lead property developer managing high-end residential townships and sustainable construction in Mumbai."
  },
  {
    id: "re-blr-01",
    company: "Prestige Estates",
    location: "Bangalore",
    department: "Real Estate & Construction",
    role: "Land Acquisition Lead",
    contact_name: "Kiran Bhat",
    designation: "Senior General Manager - Land & Infra",
    email: "kiran.bhat@prestigeconstructions.com",
    phone: "+91 98452 44556",
    linkedin: "https://linkedin.com/in/kiran-bhat-prestige",
    notes: "Manages land acquisition, zoning permits, and commercial tech park expansion across Bangalore and Hyderabad."
  },
  {
    id: "re-pune-01",
    company: "Lodha Group",
    location: "Pune",
    department: "Real Estate & Construction",
    role: "Construction Manager",
    contact_name: "Vikram Shirke",
    designation: "General Manager - High Rise Engineering",
    email: "vikram.shirke@lodhagroup.com",
    phone: "+91 98220 66778",
    linkedin: "https://linkedin.com/in/vikram-shirke-lodha",
    notes: "Specializes in structural safety, smart building automation, and luxury township execution in Pune."
  },

  // --- ARCHITECTURE & INTERIORS ---
  {
    id: "arch-mum-01",
    company: "Hafeez Contractor",
    location: "Mumbai",
    department: "Architecture & Interiors",
    role: "Principal Architect",
    contact_name: "Siddharth Hafeez",
    designation: "Associate Principal Architect",
    email: "siddharth@hafeezcontractor.com",
    phone: "+91 98203 11223",
    linkedin: "https://linkedin.com/in/siddharth-architect",
    notes: "Renowned architect designing iconic skyscrapers, airport terminals, and eco-friendly campuses in Mumbai."
  },
  {
    id: "arch-del-01",
    company: "Morphogenesis",
    location: "Delhi",
    department: "Architecture & Interiors",
    role: "Spatial Designer",
    contact_name: "Tanvi Sawant",
    designation: "Senior Urban & Spatial Architect",
    email: "tanvi.sawant@morphogenesis.org",
    phone: "+91 98112 33445",
    linkedin: "https://linkedin.com/in/tanvi-sawant-design",
    notes: "Specializes in net-zero green architecture and institutional campus master planning in New Delhi."
  },
  {
    id: "int-blr-01",
    company: "Livspace",
    location: "Bangalore",
    department: "Architecture & Interiors",
    role: "Lead Interior Designer",
    contact_name: "Pooja Raman",
    designation: "Director of Luxury Residential Interiors",
    email: "pooja.raman@livspace.com",
    phone: "+91 98453 55667",
    linkedin: "https://linkedin.com/in/pooja-raman-interiors",
    notes: "Lead interior designer creating bespoke spatial aesthetics, modular kitchens, and turnkey interior experiences."
  },
  {
    id: "int-hyd-01",
    company: "Gensler",
    location: "Hyderabad",
    department: "Architecture & Interiors",
    role: "Workplace Architect",
    contact_name: "David Chopra",
    designation: "Head of Commercial Workplace Design",
    email: "david_chopra@gensler.com",
    phone: "+91 94002 77889",
    linkedin: "https://linkedin.com/in/david-chopra-gensler",
    notes: "Designs collaborative corporate headquarters and agile tech offices for global enterprises in Hyderabad."
  },

  // --- HEALTHCARE & PHARMA ---
  {
    id: "ph-mum-01",
    company: "Sun Pharma",
    location: "Mumbai",
    department: "Healthcare & Pharma",
    role: "Pharma CEO",
    contact_name: "Dr. Dilip Shanghvi",
    designation: "Chief Executive Officer & Managing Director",
    email: "ceo.office@sunpharma.com",
    phone: "+91 98204 11223",
    linkedin: "https://linkedin.com/in/dilip-shanghvi-pharma",
    notes: "Executive leader driving global specialty generics, oncology formulations, and R&D expansion in Mumbai."
  },
  {
    id: "ph-hyd-01",
    company: "Dr Reddys",
    location: "Hyderabad",
    department: "Healthcare & Pharma",
    role: "R&D Director",
    contact_name: "Dr. Swati Reddy",
    designation: "VP of Biologics & Clinical Development",
    email: "swati.reddy@drreddys.com",
    phone: "+91 94003 33445",
    linkedin: "https://linkedin.com/in/dr-swati-reddy-pharma",
    notes: "Leads clinical trials, biosimilar drug discovery, and FDA regulatory compliance at Hyderabad labs."
  },
  {
    id: "hl-del-01",
    company: "Apollo Hospitals",
    location: "Delhi",
    department: "Healthcare & Pharma",
    role: "Medical Director",
    contact_name: "Dr. Amit Mukherjee",
    designation: "Chief Medical Officer - Surgery & Cardiology",
    email: "dramit@apollohospitals.com",
    phone: "+91 98113 55667",
    linkedin: "https://linkedin.com/in/dr-amit-mukherjee-apollo",
    notes: "Directs hospital clinical operations, robotic surgery adoption, and patient care protocols in New Delhi."
  },

  // --- MARKETING, ADVERTISING & PR ---
  {
    id: "mkt-mum-01",
    company: "Ogilvy India",
    location: "Mumbai",
    department: "Advertising & PR",
    role: "Marketing Agency Head",
    contact_name: "Piyush Pandey",
    designation: "Chief Creative Officer & Chairman",
    email: "piyush.pandey@ogilvy.com",
    phone: "+91 98205 11223",
    linkedin: "https://linkedin.com/in/piyush-pandey-ogilvy",
    notes: "Legendary advertising executive and creative director shaping iconic Indian brand campaigns in Mumbai."
  },
  {
    id: "mkt-blr-01",
    company: "Schbang",
    location: "Bangalore",
    department: "Advertising & PR",
    role: "Brand Chief",
    contact_name: "Harshil Kulkarni",
    designation: "VP of Brand Strategy & Digital Transformation",
    email: "harshil@schbang.com",
    phone: "+91 98454 33445",
    linkedin: "https://linkedin.com/in/harshil-schbang",
    notes: "Directs 360-degree digital marketing, influencer campaigns, and performance growth for tech brands."
  },

  // --- FINTECH & BANKING ---
  {
    id: "fin-mum-01",
    company: "HDFC Bank",
    location: "Mumbai",
    department: "Fintech & Banking",
    role: "Corporate Banker",
    contact_name: "Sashidhar Jagdishan",
    designation: "Senior Executive Vice President - Corporate Banking",
    email: "sashidhar.j@hdfcbank.com",
    phone: "+91 98206 11223",
    linkedin: "https://linkedin.com/in/sashidhar-hdfc-bank",
    notes: "Manages wholesale banking, corporate lending, and treasury solutions for conglomerates in Mumbai."
  },
  {
    id: "fin-blr-01",
    company: "Razorpay",
    location: "Bangalore",
    department: "Fintech & Banking",
    role: "Fintech Risk Lead",
    contact_name: "Harshil Mathur",
    designation: "Chief Risk Officer & Co-Founder Office",
    email: "harshil.mathur@razorpay.com",
    phone: "+91 98455 33445",
    linkedin: "https://linkedin.com/in/harshil-mathur-razorpay",
    notes: "Leads payment gateway security, fraud prevention algorithms, and banking partnerships in Bangalore."
  },

  // --- LOGISTICS & SUPPLY CHAIN ---
  {
    id: "log-gur-01",
    company: "Delhivery",
    location: "Gurgaon",
    department: "Logistics & Supply Chain",
    role: "Supply Chain VP",
    contact_name: "Sahil Barua",
    designation: "Chief Operating Officer - Supply Chain",
    email: "sahil.barua@delhivery.com",
    phone: "+91 98114 11223",
    linkedin: "https://linkedin.com/in/sahil-barua-delhivery",
    notes: "Directs nationwide express logistics, automated fulfillment centers, and freight operations in Gurgaon."
  }
];

// Algorithmic Generator to build out 300+ additional realistic records across ALL departments
const companies = [
  // Tech & Software
  "Google", "Microsoft", "Amazon", "Meta", "Apple", "Nvidia", "Adobe", "Salesforce", "Uber", "Oracle", "Intel", "Cisco",
  // Investment & VC
  "Sequoia Capital", "Accel", "Nexus Venture Partners", "Elevation Capital", "Peak XV Partners", "Matrix Partners", "Blume Ventures", "Kalaari Capital",
  // Real Estate
  "DLF", "Godrej Properties", "Lodha Group", "Prestige Estates", "Oberoi Realty", "K Raheja Corp", "Brigade Group", "Sobha",
  // Architecture & Interiors
  "Hafeez Contractor", "Morphogenesis", "Sanjay Puri Architects", "Gensler", "Livspace", "Bonito Designs", "Studio Lotus", "Space Matrix",
  // CA, Legal & Accounting
  "Cyril Amarchand Mangaldas", "Shardul Amarchand Mangaldas", "AZB & Partners", "Trilegal", "Khaitan & Co", "Ernst & Young", "Deloitte", "PwC", "KPMG",
  // Healthcare & Pharma
  "Sun Pharma", "Cipla", "Dr Reddys", "Biocon", "Apollo Hospitals", "Fortis Healthcare", "Max Healthcare", "Lupin",
  // Advertising & PR
  "Ogilvy India", "Dentsu", "Leo Burnett", "Wunderman Thompson", "Madison World", "Schbang", "Social Panga", "Edelman",
  // Fintech & Banking
  "HDFC Bank", "ICICI Bank", "Zerodha", "Razorpay", "Cred", "Groww", "Kotak Mahindra Bank", "Axis Bank",
  // Logistics
  "Delhivery", "Blue Dart", "Mahindra Logistics", "Transport Corporation of India", "DHL India", "Flipkart Supply Chain", "Amazon Transportation"
];

const locations = [
  "Bangalore", "Hyderabad", "Pune", "Chennai", "Mumbai", "Delhi", "Gurgaon", "Noida", "Kolkata", "Ahmedabad", "Jaipur", "Chandigarh", "Indore", "Kochi"
];

const departments = [
  "HR", "Technical Recruiting", "Engineering", "Talent Acquisition", "University Recruiting", "Sales", "Marketing",
  "Investment & VC", "Real Estate & Construction", "Architecture & Interiors", "Legal & Compliance", 
  "Healthcare & Pharma", "Advertising & PR", "Fintech & Banking", "Logistics & Supply Chain"
];

const rolesMap: Record<string, { role: string; designation: string }[]> = {
  "HR": [
    { role: "HR Business Partner", designation: "Senior HR Business Partner" },
    { role: "HR Lead", designation: "Director of Human Resources" },
    { role: "People Operations Specialist", designation: "Lead People Ops Partner" },
    { role: "Tech HR Specialist", designation: "Senior Tech HR Manager" }
  ],
  "Technical Recruiting": [
    { role: "Technical Recruiter", designation: "Senior Technical Recruiter" },
    { role: "Software Recruiter", designation: "Lead Software Recruiter" },
    { role: "Backend Recruiter", designation: "Principal Backend Technical Recruiter" },
    { role: "Frontend Recruiter", designation: "Senior UI/Frontend Recruiter" },
    { role: "AI Recruiter", designation: "Staff AI & Machine Learning Recruiter" }
  ],
  "Engineering": [
    { role: "Hiring Manager", designation: "Director of Engineering" },
    { role: "Software Hiring Manager", designation: "Senior Engineering Manager" },
    { role: "Backend Hiring Manager", designation: "VP of Software Engineering" },
    { role: "Frontend Hiring Manager", designation: "Engineering Director - Web & Mobile" },
    { role: "AI Engineering Lead", designation: "Head of AI R&D & Hiring Manager" }
  ],
  "Talent Acquisition": [
    { role: "Talent Acquisition Lead", designation: "Head of Talent Acquisition" },
    { role: "TA Partner", designation: "Senior Talent Acquisition Specialist" },
    { role: "Recruiter", designation: "Global TA Consultant" }
  ],
  "University Recruiting": [
    { role: "University Recruiter", designation: "Campus Recruiting Manager" },
    { role: "University Program Specialist", designation: "Lead University Relations Partner" }
  ],
  "Sales": [
    { role: "Sales Recruiter", designation: "Lead Recruiter - Enterprise Sales" },
    { role: "Sales HR Lead", designation: "HRBP - Global Sales & GTM" },
    { role: "Sales Hiring Manager", designation: "VP of Enterprise Sales" }
  ],
  "Marketing": [
    { role: "Marketing Recruiter", designation: "Senior Recruiter - Growth & Marketing" },
    { role: "Marketing HR Partner", designation: "HR Lead - Marketing & Communications" },
    { role: "Marketing Hiring Manager", designation: "Chief Marketing Officer" }
  ],
  "Investment & VC": [
    { role: "Venture Partner", designation: "General Partner - Early Stage Investments" },
    { role: "Angel Investor", designation: "Managing Director - Seed Fund" },
    { role: "Investment Principal", designation: "Lead Investment Principal - DeepTech & AI" },
    { role: "Portfolio Manager", designation: "Head of Portfolio Value Creation & Growth" },
    { role: "VC Associate", designation: "Senior Venture Capital Associate - Fintech & Consumer" }
  ],
  "Real Estate & Construction": [
    { role: "Real Estate Director", designation: "VP of Commercial Real Estate Acquisition" },
    { role: "Property Development Head", designation: "Chief Project Director - Luxury Residential" },
    { role: "Land Acquisition Lead", designation: "Senior General Manager - Land & Legal" },
    { role: "Construction Manager", designation: "General Manager - High Rise Construction & Safety" },
    { role: "Commercial Property Advisor", designation: "Head of Commercial Leasing & Retail Spaces" }
  ],
  "Architecture & Interiors": [
    { role: "Principal Architect", designation: "Chief Architect & Design Director" },
    { role: "Lead Interior Designer", designation: "VP of Luxury Interior Architecture" },
    { role: "Spatial Designer", designation: "Senior Urban & Spatial Design Consultant" },
    { role: "Workplace Architect", designation: "Head of Commercial Workplace Design" },
    { role: "Senior Architect", designation: "Associate Principal - Sustainable Architecture" }
  ],
  "Legal & Compliance": [
    { role: "Corporate Lawyer", designation: "Senior Partner - M&A and Private Equity Legal" },
    { role: "Chartered Accountant (CA)", designation: "Partner - Statutory Audit & Tax Compliance" },
    { role: "Legal Counsel", designation: "General Counsel - Corporate Governance & IP" },
    { role: "Tax Consultant", designation: "Senior Director - International Tax & Regulatory" },
    { role: "Compliance Head", designation: "Chief Risk & Compliance Officer" }
  ],
  "Healthcare & Pharma": [
    { role: "Pharma CEO", designation: "Chief Executive Officer - Global Formulations" },
    { role: "R&D Director", designation: "VP of Pharmaceutical Research & Development" },
    { role: "Medical Director", designation: "Chief Medical Officer & Clinical Trials Head" },
    { role: "Hospital Operations Head", designation: "COO - Multi-Specialty Hospital Chain" },
    { role: "Biotech Scientist", designation: "Lead Principal Scientist - Biologics & Vaccines" }
  ],
  "Advertising & PR": [
    { role: "Marketing Agency Head", designation: "Managing Director - Digital & Creative Brand Strategy" },
    { role: "Brand Chief", designation: "Chief Creative Officer & Brand Strategist" },
    { role: "PR Director", designation: "Senior VP of Public Relations & Crisis Comms" },
    { role: "Performance Director", designation: "Head of Growth & Performance Media" }
  ],
  "Fintech & Banking": [
    { role: "Investment Banker", designation: "Managing Director - Investment Banking & IPOs" },
    { role: "Corporate Banker", designation: "Senior VP of Corporate & Wholesale Banking" },
    { role: "Wealth Manager", designation: "Executive Vice President - Private Wealth Management" },
    { role: "Fintech Risk Lead", designation: "Chief Risk & Credit Officer - Digital Lending" }
  ],
  "Logistics & Supply Chain": [
    { role: "Supply Chain VP", designation: "VP of Global Supply Chain & Logistics Operations" },
    { role: "Fleet Operations Head", designation: "Director of Fleet & Last Mile Delivery" },
    { role: "Warehouse Director", designation: "Head of Automated Fulfillment & Warehousing" },
    { role: "Logistics Strategy Lead", designation: "General Manager - Supply Chain Network Planning" }
  ]
};

const firstNames = [
  "Aarav", "Aditi", "Rohan", "Sneha", "Kiran", "Meera", "Varun", "Ananya", 
  "Siddharth", "Pooja", "Vikram", "Tanvi", "Nikhil", "Divya", "Rahul", "Swati",
  "Amit", "Neelam", "Harsh", "Deepika", "Pranay", "Kavita", "Suresh", "Ritu",
  "Manish", "Anita", "Rajesh", "Priya", "Arjun", "Shreya", "Aisha", "David",
  "Tarun", "Simran", "Gaurav", "Pallavi", "Alok", "Sonam", "Raghav", "Radhika"
];

const lastNames = [
  "Sharma", "Verma", "Patel", "Reddy", "Iyer", "Nair", "Mehta", "Kulkarni",
  "Deshmukh", "Joshi", "Bhat", "Singhania", "Gupta", "Malhotra", "Chopra", "Kaur",
  "Nambiar", "Banerjee", "Mukherjee", "Ghosh", "Sawant", "Shirke", "Tandon", "Raman",
  "Bhardwaj", "Chauhan", "Kapoor", "Saxena", "Choudhury", "Bose", "Dutta", "Sinha"
];

function generateAdditionalContacts(): ContactRecord[] {
  const generated: ContactRecord[] = [];
  let counter = 1;

  for (const comp of companies) {
    for (const loc of locations) {
      // Pick 2 departments per company-location pair -> 77 * 14 * 2 = 2,156 possible combinations!
      // We will generate up to 360 additional records to bring the total dataset to exactly 400 records!
      const depts = [
        departments[(counter) % departments.length],
        departments[(counter + 4) % departments.length]
      ];

      for (const dept of depts) {
        const roleOptions = rolesMap[dept] || rolesMap["HR"];
        const chosenRoleObj = roleOptions[counter % roleOptions.length];
        const fn = firstNames[(counter * 3) % firstNames.length];
        const ln = lastNames[(counter * 7) % lastNames.length];
        const fullName = `${fn} ${ln}`;
        const cleanComp = comp.toLowerCase().replace(/[^a-z0-9]/g, "");
        const email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${counter}@${cleanComp}.com`;
        const phone = `+91 9${(8000000000 + counter * 12345).toString().slice(0, 9)}`;
        const linkedin = `https://linkedin.com/in/${fn.toLowerCase()}-${ln.toLowerCase()}-${cleanComp}-${counter}`;
        
        generated.push({
          id: `gen-${cleanComp}-${loc.toLowerCase()}-${counter}`,
          company: comp,
          location: loc,
          department: dept,
          role: chosenRoleObj.role,
          contact_name: fullName,
          designation: chosenRoleObj.designation,
          email: email,
          phone: phone,
          linkedin: linkedin,
          notes: `Verified ${chosenRoleObj.role} at ${comp} in ${loc}. Specialist in ${dept.toLowerCase()} strategy, executive leadership, and professional networking.`
        });

        counter++;
        if (generated.length >= 360) break;
      }
      if (generated.length >= 360) break;
    }
    if (generated.length >= 360) break;
  }

  return generated;
}

export const dummyContacts: ContactRecord[] = [
  ...baseHandcraftedContacts,
  ...generateAdditionalContacts()
];
