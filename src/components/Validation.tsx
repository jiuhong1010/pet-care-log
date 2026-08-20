import { useState } from 'react'
import type { Feedback, SurveyAnswer } from '../types'
import { Group } from './ui'

/**
 * 需求验证钩子。
 *
 * 这个产品的核心假设是「养宠物的人正在用备忘录/表格凑合着记」。
 * 假设错了整个方向就该换，所以让每个真实用户顺手回答一句，
 * 答案存本地、随导出一起带出，用来判断继续做还是换方向。
 */

const OPTIONS = ['手机备忘录', '拍照存相册', 'Excel / 表格', '全靠记，经常忘', '别的 App', '从来不记']

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
    <Group header="用之前，想先问一句" footer="只存在你本地，随时可跳过">
      <div className="px-gutter py-3.5">
        <p className="text-body text-label">
          在遇到这个页面之前，你是怎么记宠物的疫苗和驱虫的？
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {OPTIONS.map((o) => (
            <button
              key={o}
              type="button"
              onClick={() => pick(o)}
              className="rounded-full px-3 py-1.5 text-subheadline font-medium text-blue
                transition duration-150 ease-ios active:opacity-60"
              style={{ background: 'var(--c-fill-3)' }}
            >
              {o}
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <input
            className="field-boxed flex-1"
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder="或者自己写一句"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && other.trim()) pick(other.trim())
            }}
          />
          <button
            type="button"
            className="btn-plain"
            onClick={() => other.trim() && pick(other.trim())}
            disabled={!other.trim()}
          >
            提交
          </button>
          <button
            type="button"
            className="btn-plain"
            onClick={onSkip}
            style={{ color: 'var(--c-label-2)' }}
          >
            跳过
          </button>
        </div>
      </div>
    </Group>
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
    <div className="px-gutter py-3">
      <textarea
        className="field-boxed min-h-[76px] resize-y"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="缺什么？哪里别扭？"
      />
      <div className="mt-2 flex items-center gap-3">
        <button type="button" className="btn-tinted" onClick={submit} disabled={!text.trim()}>
          提交
        </button>
        {sent ? (
          <span className="animate-fade-in text-subheadline text-green">已记下，谢谢</span>
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
    <div className="px-gutter py-3 text-subheadline">
      {survey ? (
        <p style={{ color: 'var(--c-label-2)' }}>
          你之前说，你是用
          <strong className="font-semibold text-label">「{survey.currentMethod}」</strong>
          记的
        </p>
      ) : null}
      {feedbacks.length > 0 ? (
        <p className="mt-0.5" style={{ color: 'var(--c-label-3)' }}>
          已留下 {feedbacks.length} 条想法
        </p>
      ) : null}
    </div>
  )
}
