import { useState } from 'react'
import type { Feedback, SurveyAnswer } from '../types'

/**
 * 需求验证钩子。
 *
 * 为什么放在产品里：这个产品的核心假设是「养宠物的人正在用备忘录/表格凑合着记」。
 * 如果假设错了，整个方向就该换。与其上线后再猜，不如让每个真实用户顺手回答一句。
 * 答案存在本地，可以在设置里一次性导出，用来判断继续做还是换方向。
 */

const OPTIONS = [
  { key: 'memo', label: '手机备忘录', emoji: '📝' },
  { key: 'photo', label: '拍照存相册', emoji: '📷' },
  { key: 'sheet', label: 'Excel / 表格', emoji: '📊' },
  { key: 'brain', label: '全靠记，经常忘', emoji: '🫠' },
  { key: 'app', label: '别的 App', emoji: '📱' },
  { key: 'never', label: '从来不记', emoji: '🤷' },
]

export function SurveyCard({
  onAnswer,
  onSkip,
}: {
  onAnswer: (a: SurveyAnswer) => void
  onSkip: () => void
}) {
  const [other, setOther] = useState('')

  const pick = (label: string) => {
    onAnswer({ currentMethod: label, answeredAt: new Date().toISOString() })
  }

  return (
    <div className="card animate-pop-in border-peach-300 bg-gradient-to-br from-cream-100 to-milk">
      <div className="mb-3 flex items-start gap-3">
        <span className="animate-wiggle text-2xl" aria-hidden="true">
          👋
        </span>
        <div>
          <h2 className="font-hand text-xl font-bold text-cocoa-800">
            在你用它之前，想先问一句
          </h2>
          <p className="text-sm text-cocoa-400">
            在遇到这个页面之前，你是怎么记宠物的疫苗和驱虫的？
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => pick(o.label)}
            className="chip border-2 border-cream-300 bg-milk text-sm text-cocoa-600
              transition hover:border-peach-400 hover:bg-peach-300/20 hover:text-cocoa-800"
          >
            <span aria-hidden="true">{o.emoji}</span>
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          className="field flex-1"
          value={other}
          onChange={(e) => setOther(e.target.value)}
          placeholder="或者自己写一句"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && other.trim()) pick(other.trim())
          }}
        />
        <div className="flex gap-2">
          <button
            type="button"
            className="btn-primary"
            onClick={() => other.trim() && pick(other.trim())}
            disabled={!other.trim()}
          >
            提交
          </button>
          <button type="button" className="btn-ghost" onClick={onSkip}>
            跳过
          </button>
        </div>
      </div>
    </div>
  )
}

export function FeedbackBox({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState('')
  const [sent, setSent] = useState(false)

  const submit = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSubmit(trimmed)
    setText('')
    setSent(true)
    window.setTimeout(() => setSent(false), 2600)
  }

  return (
    <div>
      <p className="mb-2 text-sm text-cocoa-400">
        缺什么？哪里别扭？写下来，会存在你本地，导出后能一起发给我。
      </p>
      <textarea
        className="field min-h-[80px] resize-y"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="比如：希望能提醒我，希望能两个人一起记……"
      />
      <div className="mt-2 flex items-center gap-3">
        <button type="button" className="btn-primary" onClick={submit} disabled={!text.trim()}>
          留个话
        </button>
        {sent ? (
          <span className="animate-pop-in text-sm font-bold text-mint-700">
            记下了，谢谢 🌿
          </span>
        ) : null}
      </div>
    </div>
  )
}

export function ValidationSummary({
  survey,
  feedbacks,
}: {
  survey: SurveyAnswer | null
  feedbacks: Feedback[]
}) {
  if (!survey && feedbacks.length === 0) return null
  return (
    <div className="rounded-2xl bg-cream-50 px-4 py-3 text-sm">
      {survey ? (
        <p className="text-cocoa-600">
          你之前说，你是用<strong className="text-cocoa-800">「{survey.currentMethod}」</strong>记的
        </p>
      ) : null}
      {feedbacks.length > 0 ? (
        <p className="mt-1 text-cocoa-400">已留下 {feedbacks.length} 条想法</p>
      ) : null}
    </div>
  )
}
