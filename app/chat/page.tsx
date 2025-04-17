"use client"

import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { AlertCircle, FileText, Paperclip } from "lucide-react"

interface Embed {
  type: string
  title?: string
  color?: number
  fields?: {
    name: string
    value: string
    inline: boolean
  }[]
  footer?: {
    text: string
  }
  content_scan_version?: number
}

interface Message {
  timestamp: string
  userType: "System" | "Support" | string
  author: string
  content: string
  attachments: any[]
  embeds: Embed[]
}

export default function ChatPage() {
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState<Message[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  function base64ToUtf8(base64: string) {
    const binary = atob(base64);
    const bytes = Uint8Array.from([...binary].map(c => c.charCodeAt(0)));
    return new TextDecoder('utf-8').decode(bytes);
  }

  useEffect(() => {
    try {
      const base64Data = searchParams.get("data")

      if (!base64Data) {
        setError("No data provided in URL. Add ?data=<base64-encoded-json> to the URL.")
        setLoading(false)
        return
      }

      // Decode base64 to string
      const jsonString = base64ToUtf8(base64Data)

      // Parse JSON
      const parsedData = JSON.parse(jsonString)

      if (Array.isArray(parsedData)) {
        setMessages(parsedData)
      } else {
        setError("Invalid data format. Expected an array of messages.")
      }
    } catch (err) {
      setError("Failed to decode or parse data. Make sure it's valid base64-encoded JSON.")
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  // Group messages by author and date (within 1 minute)
  const groupedMessages = messages.reduce((groups: Message[][], message, index) => {
    const prevMessage = index > 0 ? messages[index - 1] : null

    // Start a new group if:
    // 1. This is the first message
    // 2. The author changed
    // 3. The message is more than 1 minute apart from the previous one
    // 4. The previous message has embeds
    const shouldStartNewGroup =
      !prevMessage ||
      prevMessage.author !== message.author ||
      Math.abs(new Date(message.timestamp).getTime() - new Date(prevMessage.timestamp).getTime()) > 60000 ||
      prevMessage.embeds.length > 0

    if (shouldStartNewGroup) {
      groups.push([message])
    } else {
      groups[groups.length - 1].push(message)
    }

    return groups
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#36393f]">
        <div className="animate-pulse text-gray-300">Loading chat...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#36393f] p-4">
        <div className="flex items-center gap-2 text-red-400 mb-4">
          <AlertCircle className="h-5 w-5" />
          <span>Error</span>
        </div>
        <p className="text-gray-300 text-center">{error}</p>
        <div className="mt-6 p-4 bg-[#2f3136] rounded-md max-w-lg w-full">
          <h3 className="text-gray-200 font-medium mb-2">Example Usage:</h3>
          <p className="text-gray-400 text-sm mb-4">
            Encode your JSON data as base64 and add it to the URL as a query parameter:
          </p>
          <code className="block p-3 bg-[#202225] text-gray-300 rounded text-xs overflow-x-auto">
            /chat?data=eyJ0aW1lc3RhbXAiOiIuLi4ifQ==
          </code>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#36393f]">
      <header className="bg-[#2f3136] border-b border-[#202225] p-4 shadow-sm">
        <h1 className="text-white font-semibold">Support Ticket</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto">
          {groupedMessages.map((group, groupIndex) => {
            const firstMessage = group[0]
            const date = new Date(firstMessage.timestamp)
            const timeAgo = formatDistanceToNow(date, { addSuffix: true })

            return (
              <div key={groupIndex} className="mb-6">
                {/* Message group header with author and timestamp */}
                <div className="flex items-baseline mb-1">
                  <span
                    className={`font-medium ${
                      firstMessage.userType === "System"
                        ? "text-yellow-300"
                        : firstMessage.userType === "Support"
                          ? "text-blue-300"
                          : "text-green-300"
                    }`}
                  >
                    {firstMessage.author}
                  </span>
                  <span className="ml-2 text-xs text-gray-400">{timeAgo}</span>
                </div>

                {/* Message content */}
                <div className="pl-1">
                  {group.map((message, messageIndex) => (
                    <div key={messageIndex} className="mb-1">
                      {message.content && <p className="text-gray-200 break-words">{message.content}</p>}

                      {/* Attachments */}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {message.attachments.map((attachment, i) => (
                            <div key={i} className="flex items-center bg-[#2f3136] rounded p-2 text-gray-300">
                              <Paperclip className="h-4 w-4 mr-2" />
                              <span className="text-sm">Attachment {i + 1}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Embeds */}
                      {message.embeds &&
                        message.embeds.map((embed, embedIndex) => (
                          <div
                            key={embedIndex}
                            className="mt-2 bg-[#2f3136] rounded-md overflow-hidden"
                            style={{
                              borderLeft: embed.color ? `4px solid #${embed.color.toString(16)}` : "4px solid #5865f2",
                            }}
                          >
                            {embed.title && (
                              <div className="p-3 pb-0">
                                <h3 className="text-white font-medium">{embed.title}</h3>
                              </div>
                            )}

                            {embed.fields && embed.fields.length > 0 && (
                              <div className="p-3 space-y-3">
                                {embed.fields.map((field, fieldIndex) => (
                                  <div key={fieldIndex} className={field.inline ? "inline-block mr-4" : "block"}>
                                    <h4 className="text-gray-300 font-medium text-sm">{field.name}</h4>
                                    <div
                                      className="text-gray-400 text-sm whitespace-pre-wrap"
                                      dangerouslySetInnerHTML={{
                                        __html: field.value.replace(
                                          /``(.*?)``/g,
                                          '<code class="bg-[#202225] px-1 rounded text-xs">$1</code>',
                                        ),
                                      }}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {embed.footer && (
                              <div className="px-3 py-2 border-t border-[#202225] text-xs text-gray-400">
                                {embed.footer.text}
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}

          {messages.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <FileText className="h-12 w-12 mb-4 opacity-50" />
              <p>No messages to display</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-[#2f3136] p-4 border-t border-[#202225]">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#40444b] rounded-md p-3 text-gray-400 text-sm">
            Chat history view only - messages cannot be sent
          </div>
        </div>
      </footer>
    </div>
  )
}
