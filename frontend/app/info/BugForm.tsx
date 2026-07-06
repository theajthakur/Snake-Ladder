'use client'
import React, { useState } from 'react'
import GamingButton from '@/app/_components/GamingButton'

export default function BugForm() {
  const [browser, setBrowser] = useState('')
  const [mode, setMode] = useState('online')
  const [steps, setSteps] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!browser || !steps || !description) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-center">
        <h4 className="text-emerald-400 font-bold mb-2">Bug Report Submitted!</h4>
        <p className="text-xs text-secondary-400">Thank you for reporting. Our developers have received your log report.</p>
        <GamingButton onClick={() => setSubmitted(false)} theme="classic" size="sm" className="mt-4">
          Report Another Bug
        </GamingButton>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-secondary-850/50 p-6 rounded-xl border border-secondary-800">
      <div>
        <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Browser & OS Version</label>
        <input
          type="text"
          placeholder="e.g. Chrome 120 on Windows 11"
          value={browser}
          onChange={(e) => setBrowser(e.target.value)}
          required
          className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Game Mode</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none"
        >
          <option value="online">Online Multiplayer</option>
          <option value="offline">Local Offline</option>
          <option value="lobby">Matchmaking Lobby</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Steps to Recreate</label>
        <textarea
          placeholder="What did you do before the bug occurred?"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          required
          rows={3}
          className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Detailed Description</label>
        <textarea
          placeholder="Explain the unexpected behavior..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none"
        />
      </div>
      <GamingButton type="submit" theme="primary" size="sm" className="w-full">
        Submit Bug Report
      </GamingButton>
    </form>
  )
}
