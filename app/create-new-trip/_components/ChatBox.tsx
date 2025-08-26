"use client"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import axios from 'axios'
import { Loader, Send } from 'lucide-react'
import React, { useState, useRef, useEffect } from 'react'
import EmptyBoxState from './EmptyBoxState'

type Message = {
  role: string,
  content: string
}

function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([])
  const [userInput, setUserInput] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when new message arrives
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const cleanResponse = (text: string): string => {
    if (!text) return ''
    let cleaned = text
    cleaned = cleaned.replace(/UI component to display:.*$/gi, '')
    cleaned = cleaned.replace(/\(ui:[^)]+\)/gi, '')
    cleaned = cleaned.split('{')[0]
    return cleaned.trim()
  }

  const onSend = async () => {
    if (!userInput.trim()) return
    setLoading(true)

    const newMsg: Message = {
      role: 'user',
      content: userInput
    }

    setUserInput('')
    setMessages((prev: Message[]) => [...prev, newMsg])

    try {
      const result = await axios.post('/api/aimodel', {
        messages: [...messages, newMsg]
      })

      const rawText = result?.data?.resp || ''
      const filteredText = cleanResponse(rawText)

      setMessages((prev: Message[]) => [
        ...prev,
        { role: 'assistant', content: filteredText || '...' }
      ])
    } catch (err) {
      console.error('Error fetching response:', err)
      setMessages((prev: Message[]) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Something went wrong. Try again.' }
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-[85vh] flex flex-col bg-gradient-to-br from-white via-blue-50 to-primary/10 rounded-2xl shadow-lg p-4">
      {messages.length === 0 && (
        <EmptyBoxState onSelectOption={(v: string) => { setUserInput(v); onSend() }} />
      )}
      {/* Display Messages */}
      <section className="flex-1 overflow-y-auto px-2 py-4 space-y-4 custom-scrollbar">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`max-w-xl px-5 py-3 rounded-2xl transition-all duration-200 shadow-sm ${
              msg.role === 'user'
                ? 'bg-primary text-white self-end ml-auto'
                : 'bg-white border border-gray-200 text-gray-900 self-start mr-auto'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="max-w-xl px-5 py-3 rounded-2xl bg-white border border-gray-200 text-gray-900 self-start mr-auto flex items-center gap-2">
            <Loader className="animate-spin" />
            <span>Assistant is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </section>

      {/* User Input */}
      <section className="mt-2">
        <div className="border rounded-2xl p-4 shadow bg-white">
          <div className="flex flex-col gap-3">
            <Textarea
              placeholder="Type your message..."
              className="w-full h-24 resize-none bg-transparent focus:outline-none text-lg"
              onChange={(event) => setUserInput(event.target.value)}
              value={userInput}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  onSend()
                }
              }}
              disabled={loading}
            />
            <div className="flex justify-end">
              <Button
                size="icon"
                className="cursor-pointer bg-primary text-white hover:bg-primary/90 transition"
                onClick={onSend}
                disabled={loading || !userInput.trim()}
                aria-label="Send"
              >
                <Send size={22} />
              </Button>
            </div>
          </div>
        </div>
      </section>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e0e7ff;
          border-radius: 8px;
        }
      `}</style>
    </div>
  )
}

export default ChatBox