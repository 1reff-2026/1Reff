export default function Loading() {
  return (
    <div className="w-full max-w-2xl md:max-w-4xl mx-auto flex flex-col h-[600px] animate-pulse p-4">
      <div className="h-8 bg-gray-200/50 rounded-lg w-48 mb-8 mt-4"></div>
      <div className="h-16 bg-gray-100/50 rounded-[16px] mb-6"></div>
      
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-gray-50/50 rounded-[16px] border border-gray-100/50"></div>
        ))}
      </div>
    </div>
  )
}
