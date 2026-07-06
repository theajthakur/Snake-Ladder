'use client'
import React, { useState } from 'react'
import GamingButton from '@/app/_components/GamingButton'

export default function ContactForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="p-6 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-center">
        <h4 className="text-emerald-400 font-bold mb-2">Message Sent!</h4>
        <p className="text-xs text-secondary-400">Thank you for reaching out. We will get back to you shortly.</p>
        <GamingButton onClick={() => setSubmitted(false)} theme="classic" size="sm" className="mt-4">
          Send Another Message
        </GamingButton>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-secondary-850/50 p-6 rounded-xl border border-secondary-800">
      <div>
        <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none"
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          rows={4}
          className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none"
        />
      </div>
      <GamingButton type="submit" theme="primary" size="sm" className="w-full">
        Send Message
      </GamingButton>
    </form>
  )
}
