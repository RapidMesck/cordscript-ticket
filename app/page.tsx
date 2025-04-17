import Link from "next/link"
import { ArrowRight, FileText } from "lucide-react"

export default function Home() {
  // Example data for demonstration
  const exampleData = [
    {
      timestamp: "4/16/2025, 5:26:31 PM",
      userType: "System",
      author: "ticket-bot#0001",
      content: "Ticket criado",
      attachments: [],
      embeds: [],
    },
    {
      timestamp: "4/16/2025, 5:26:35 PM",
      userType: "Support",
      author: "supporter",
      content: "Hello, how can I help you today?",
      attachments: [],
      embeds: [],
    },
  ]

  // Convert to base64
  const base64Example = btoa(JSON.stringify(exampleData))

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#36393f] p-4">
      <div className="max-w-md w-full bg-[#2f3136] rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-center mb-6">
            <FileText className="h-10 w-10 text-[#5865f2]" />
          </div>
          <h1 className="text-xl font-bold text-white text-center mb-6">CordScript - Ticket</h1>

          <p className="text-gray-300 mb-6">
            This application converts base64-encoded JSON chat data into a Discord-style chat interface.
          </p>

          <div className="space-y-4">
            <div className="bg-[#202225] p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-300 mb-2">How to use:</h3>
              <ol className="text-sm text-gray-400 space-y-2 list-decimal pl-5">
                <li>Encode your JSON chat data as base64</li>
                <li>
                  Add it to the URL as a query parameter:{" "}
                  <code className="bg-[#40444b] px-1 rounded">/chat?data=...</code>
                </li>
                <li>View your chat in a Discord-style interface</li>
              </ol>
            </div>

            <Link
              href={`/chat?data=${base64Example}`}
              className="flex items-center justify-center gap-2 w-full bg-[#5865f2] hover:bg-[#4752c4] text-white py-2 px-4 rounded-md transition-colors"
            >
              Try Example
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="bg-[#202225] px-6 py-4 text-xs text-gray-400">
          <p>Note: All data is processed client-side and is not stored on any server.</p>
        </div>
      </div>
    </div>
  )
}
