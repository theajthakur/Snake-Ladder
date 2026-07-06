'use client'
import React, { useState } from 'react'

interface FAQItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  faqs: FAQItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx)
  }

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => (
        <div
          key={idx}
          className="bg-secondary-900/60 border border-secondary-800 rounded-xl overflow-hidden"
        >
          <button
            onClick={() => toggle(idx)}
            className="w-full text-left px-5 py-4 font-sans font-bold text-xs sm:text-sm text-secondary-200 hover:text-secondary-100 flex justify-between items-center transition-colors cursor-pointer border-0 bg-transparent outline-none"
          >
            <span>{faq.question}</span>
            <span className="text-primary-500 font-mono text-base ml-2">
              {openIdx === idx ? '−' : '+'}
            </span>
          </button>
          {openIdx === idx && (
            <div className="px-5 pb-4 text-xs text-secondary-400 leading-relaxed border-t border-secondary-800/40 pt-2.5 bg-secondary-900/20">
              {faq.answer}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
