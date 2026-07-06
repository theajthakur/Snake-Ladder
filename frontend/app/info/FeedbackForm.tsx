'use client'
import React, { useState } from 'react'
import GamingButton from '@/app/_components/GamingButton'

export default function FeedbackForm() {
  const [rating, setRating] = useState(5)
  const [comments, setComments] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!comments) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-center">
        <h4 className="text-emerald-400 font-bold mb-2">Feedback Received!</h4>
        <p className="text-xs text-secondary-400">We appreciate your feedback. Thank you for helping us grow!</p>
        <GamingButton onClick={() => setSubmitted(false)} theme="classic" size="sm" className="mt-4">
          Send More Feedback
        </GamingButton>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-secondary-850/50 p-6 rounded-xl border border-secondary-800">
      <div>
        <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Rate Your Experience</label>
        <div className="flex gap-2 justify-between">
          {[1, 2, 3, 4, 5].map((stars) => (
            <button
              type="button"
              key={stars}
              onClick={() => setRating(stars)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer ${
                rating === stars
                  ? 'border-primary-500 bg-primary-950/20 text-primary-400'
                  : 'border-secondary-750 bg-secondary-900/50 text-secondary-400 hover:border-secondary-650'
              }`}
            >
              {stars} ★
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">What can we improve?</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          required
          rows={4}
          className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none"
        />
      </div>
      <GamingButton type="submit" theme="primary" size="sm" className="w-full">
        Submit Feedback
      </GamingButton>
    </form>
  )
}
