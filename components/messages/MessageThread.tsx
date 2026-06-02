'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatRelativeDate } from '@/lib/utils'
import { Send, Loader2 } from 'lucide-react'
import { useTranslations } from 'next-intl'
import type { Message } from '@/lib/supabase/types'

interface MessageThreadProps {
  conversationId: string
  currentUserId: string
  initialMessages: Message[]
  otherUserName: string
}

export function MessageThread({ conversationId, currentUserId, initialMessages, otherUserName }: MessageThreadProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()
  const t = useTranslations('messages')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Mark all existing unread messages as read on open
  useEffect(() => {
    supabase.from('messages')
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .eq('read', false)
      .neq('sender_id', currentUserId)
  }, [conversationId, currentUserId])

  useEffect(() => {
    const channel = supabase.channel(`conv-${conversationId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        const newMsg = payload.new as Message
        setMessages(prev => {
          if (prev.some(m => m.id === newMsg.id)) return prev
          return [...prev, newMsg]
        })
        if (newMsg.sender_id !== currentUserId) {
          supabase.from('messages').update({ read: true }).eq('id', newMsg.id)
        }
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [conversationId, currentUserId])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || sending) return
    setSending(true)
    const trimmed = content.trim()
    const { data, error } = await supabase.from('messages').insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: trimmed,
    }).select().single()
    if (!error && data) {
      setContent('')
      setMessages(prev => prev.some(m => m.id === data.id) ? prev : [...prev, data])
    }
    setSending(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e as unknown as React.FormEvent)
    }
  }

  // Group messages by date
  let lastDate = ''

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-2 space-y-1">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-8 text-sm">
            {t('start_hint', { name: otherUserName })}
          </div>
        )}
        {messages.map(msg => {
          const isMe = msg.sender_id === currentUserId
          const msgDate = new Date(msg.created_at ?? Date.now()).toLocaleDateString('fr-FR')
          const showDate = msgDate !== lastDate
          lastDate = msgDate

          return (
            <div key={msg.id}>
              {showDate && (
                <div className="text-center text-xs text-gray-400 py-3">{msgDate}</div>
              )}
              <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} mb-1`}>
                <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                  isMe
                    ? 'bg-[#722f37] text-white rounded-br-sm'
                    : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
                }`}>
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                  <p className={`text-xs mt-1 ${isMe ? 'text-white/60' : 'text-gray-400'}`}>
                    {new Date(msg.created_at ?? Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    {isMe && msg.read && ` · ${t('read')}`}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="flex gap-2 pt-4 border-t border-gray-100">
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('write_placeholder')}
          rows={1}
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#722f37]/20 focus:border-[#722f37] resize-none"
          style={{ minHeight: '44px', maxHeight: '120px' }}
        />
        <button type="submit" disabled={!content.trim() || sending}
          className="bg-[#722f37] text-white p-2.5 rounded-xl hover:bg-[#9b3d47] disabled:opacity-40 transition-colors flex-shrink-0">
          {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </form>
    </div>
  )
}
