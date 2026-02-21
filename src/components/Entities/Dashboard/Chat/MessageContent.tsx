'use client'

import { useState } from 'react'

import { cn } from '~/utils/cn'

/** Матчит <spoiler>...</spoiler> и вытаскивает содержимое (в т.ч. пустое или "pii") */
function parseSpoilers(content: string) {
  const regex = /<spoiler>([\s\S]*?)<\/spoiler>/g
  const parts: Array<{ type: 'text'; value: string } | { type: 'spoiler'; value: string }> = []
  let lastIndex = 0
  let m: RegExpExecArray | null

  while ((m = regex.exec(content)) !== null) {
    if (m.index > lastIndex) parts.push({ type: 'text', value: content.slice(lastIndex, m.index) })
    parts.push({ type: 'spoiler', value: m[1] ?? '' })
    lastIndex = m.index + m[0].length
  }

  if (lastIndex < content.length) parts.push({ type: 'text', value: content.slice(lastIndex) })

  return parts
}

function SpoilerBlock({ innerContent }: { innerContent?: string }) {
  const [revealed, setRevealed] = useState(false)
  const label = innerContent?.trim() ? innerContent : 'Персональные данные'

  return (
    <button
      type="button"
      onClick={() => setRevealed((r) => !r)}
      className={cn(
        'relative inline-flex items-center rounded-sm px-1 py-0.5 text-inherit font-inherit transition-all duration-300 ease-out',
        'cursor-pointer select-none border-0 outline-none overflow-hidden',
        !revealed && 'bg-muted-foreground/30 hover:bg-muted-foreground/40',
      )}
      title={revealed ? 'Нажмите, чтобы скрыть' : 'Нажмите, чтобы показать'}
    >
      <span className={cn('transition-all duration-300 ease-out', !revealed && 'select-none blur-[6px]')}>{label}</span>
      {!revealed && <span className="absolute inset-0 rounded-sm bg-muted-foreground/25 pointer-events-none" aria-hidden />}
    </button>
  )
}

/**
 * Рендерит текст сообщения: теги <spoiler>...</spoiler> (от LLM или <spoiler>pii</spoiler>) — интерактивный спойлер в стиле iMessage.
 */
export function MessageContent({ content, className }: { content: string; className?: string }) {
  if (!content) return null

  const parts = parseSpoilers(content)

  return (
    <p className={cn('text-sm whitespace-pre-wrap break-words', className)}>
      {parts.map((part, i) => (part.type === 'text' ? <span key={i}>{part.value}</span> : <SpoilerBlock key={i} innerContent={part.value} />))}
    </p>
  )
}
