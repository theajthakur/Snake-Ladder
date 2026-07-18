'use client'
import React, { useState } from 'react'
import GamingButton from '@/app/_components/GamingButton'

type TabType = 'contact' | 'bug' | 'feedback'

export default function SupportHub() {
  const [activeTab, setActiveTab] = useState<TabType>('contact')

  // Contact Form State
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')
  const [contactSubmitted, setContactSubmitted] = useState(false)

  // Bug Report State
  const [bugBrowser, setBugBrowser] = useState('')
  const [bugMode, setBugMode] = useState('online')
  const [bugSteps, setBugSteps] = useState('')
  const [bugDescription, setBugDescription] = useState('')
  const [bugSubmitted, setBugSubmitted] = useState(false)

  // Feedback State
  const [feedbackRating, setFeedbackRating] = useState(5)
  const [feedbackComments, setFeedbackComments] = useState('')
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  // Submissions
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactName || !contactEmail || !contactMessage) return
    setContactSubmitted(true)
  }

  const handleBugSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bugBrowser || !bugSteps || !bugDescription) return
    setBugSubmitted(true)
  }

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!feedbackComments) return
    setFeedbackSubmitted(true)
  }

  return (
    <div className="space-y-6">
      {/* Tab Selectors */}
      <div className="flex flex-wrap gap-2 border-b border-secondary-800 pb-4">
        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border outline-none cursor-pointer ${
            activeTab === 'contact'
              ? 'border-primary-500 bg-primary-950/20 text-primary-400 font-extrabold'
              : 'border-secondary-800 bg-secondary-850/30 text-secondary-400 hover:border-secondary-700 hover:text-secondary-200'
          }`}
        >
          General Support
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('bug')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border outline-none cursor-pointer ${
            activeTab === 'bug'
              ? 'border-primary-500 bg-primary-950/20 text-primary-400 font-extrabold'
              : 'border-secondary-800 bg-secondary-850/30 text-secondary-400 hover:border-secondary-700 hover:text-secondary-200'
          }`}
        >
          Report a Bug
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border outline-none cursor-pointer ${
            activeTab === 'feedback'
              ? 'border-primary-500 bg-primary-950/20 text-primary-400 font-extrabold'
              : 'border-secondary-800 bg-secondary-850/30 text-secondary-400 hover:border-secondary-700 hover:text-secondary-200'
          }`}
        >
          Give Feedback
        </button>
      </div>

      {/* Render Active Form */}
      <div>
        {activeTab === 'contact' && (
          <div>
            {contactSubmitted ? (
              <div className="p-6 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-center">
                <h4 className="text-emerald-400 font-bold mb-2">Message Sent!</h4>
                <p className="text-xs text-secondary-400">Thank you for reaching out. We will get back to you within 24 to 48 hours.</p>
                <GamingButton onClick={() => { setContactSubmitted(false); setContactMessage('') }} theme="classic" size="sm" className="mt-4">
                  Send Another Message
                </GamingButton>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 bg-secondary-850/50 p-6 rounded-xl border border-secondary-800">
                <div>
                  <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                    placeholder="Enter your name"
                    className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Email Address</label>
                  <input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    placeholder="name@example.com"
                    className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Message</label>
                  <textarea
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none"
                  />
                </div>
                <GamingButton type="submit" theme="primary" size="sm" className="w-full">
                  Send Message
                </GamingButton>
              </form>
            )}
          </div>
        )}

        {activeTab === 'bug' && (
          <div>
            {bugSubmitted ? (
              <div className="p-6 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-center">
                <h4 className="text-emerald-400 font-bold mb-2">Bug Report Submitted!</h4>
                <p className="text-xs text-secondary-400">Our engineering team has received your telemetry report. Thank you for making our lobbies stabler!</p>
                <GamingButton onClick={() => { setBugSubmitted(false); setBugDescription(''); setBugSteps('') }} theme="classic" size="sm" className="mt-4">
                  Report Another Bug
                </GamingButton>
              </div>
            ) : (
              <form onSubmit={handleBugSubmit} className="space-y-4 bg-secondary-850/50 p-6 rounded-xl border border-secondary-800">
                <div>
                  <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Browser & OS Version</label>
                  <input
                    type="text"
                    placeholder="e.g. Chrome 120 on Windows 11"
                    value={bugBrowser}
                    onChange={(e) => setBugBrowser(e.target.value)}
                    required
                    className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Game Mode</label>
                  <select
                    value={bugMode}
                    onChange={(e) => setBugMode(e.target.value)}
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
                    value={bugSteps}
                    onChange={(e) => setBugSteps(e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Detailed Description</label>
                  <textarea
                    placeholder="Explain the unexpected behavior..."
                    value={bugDescription}
                    onChange={(e) => setBugDescription(e.target.value)}
                    required
                    rows={3}
                    className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none"
                  />
                </div>
                <GamingButton type="submit" theme="primary" size="sm" className="w-full">
                  Submit Bug Report
                </GamingButton>
              </form>
            )}
          </div>
        )}

        {activeTab === 'feedback' && (
          <div>
            {feedbackSubmitted ? (
              <div className="p-6 bg-emerald-950/20 border border-emerald-800/40 rounded-xl text-center">
                <h4 className="text-emerald-400 font-bold mb-2">Feedback Received!</h4>
                <p className="text-xs text-secondary-400">We appreciate your feedback. Thank you for helping us grow!</p>
                <GamingButton onClick={() => { setFeedbackSubmitted(false); setFeedbackComments('') }} theme="classic" size="sm" className="mt-4">
                  Send More Feedback
                </GamingButton>
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4 bg-secondary-850/50 p-6 rounded-xl border border-secondary-800">
                <div>
                  <label className="block text-xs font-bold text-secondary-400 uppercase mb-1.5">Rate Your Experience</label>
                  <div className="flex gap-2 justify-between">
                    {[1, 2, 3, 4, 5].map((stars) => (
                      <button
                        type="button"
                        key={stars}
                        onClick={() => setFeedbackRating(stars)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg border cursor-pointer transition-colors ${
                          feedbackRating === stars
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
                    value={feedbackComments}
                    placeholder="Let us know what feature ideas or changes you want to see."
                    onChange={(e) => setFeedbackComments(e.target.value)}
                    required
                    rows={4}
                    className="w-full bg-secondary-900 border border-secondary-750 focus:border-secondary-650 rounded-lg px-3 py-2 text-xs text-white outline-none resize-none"
                  />
                </div>
                <GamingButton type="submit" theme="primary" size="sm" className="w-full">
                  Submit Feedback
                </GamingButton>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
