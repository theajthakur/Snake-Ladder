'use client'
import React, { useState, useEffect } from 'react'
import GamingButton from './GamingButton'

interface ConsentPreferences {
  adStorage: boolean;
  adUserData: boolean;
  adPersonalization: boolean;
  analyticsStorage: boolean;
}

export default function ConsentDialog() {
  const [isVisible, setIsVisible] = useState(false)
  const [showManage, setShowManage] = useState(false)
  
  // Custom toggles
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    adStorage: false,
    adUserData: false,
    adPersonalization: false,
    analyticsStorage: false,
  })

  useEffect(() => {
    // Check if consent has already been given
    const stored = localStorage.getItem('snake_ladder_consent_v2')
    if (!stored) {
      setIsVisible(true)
    } else {
      try {
        const parsed = JSON.parse(stored) as ConsentPreferences
        // Set values just in case
        updateGtagConsent(parsed)
      } catch (e) {
        setIsVisible(true)
      }
    }
  }, [])

  const updateGtagConsent = (prefs: ConsentPreferences) => {
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('consent', 'update', {
        'ad_storage': prefs.adStorage ? 'granted' : 'denied',
        'ad_user_data': prefs.adUserData ? 'granted' : 'denied',
        'ad_personalization': prefs.adPersonalization ? 'granted' : 'denied',
        'analytics_storage': prefs.analyticsStorage ? 'granted' : 'denied',
      })
    }
  }

  const handleAcceptAll = () => {
    const allAccepted: ConsentPreferences = {
      adStorage: true,
      adUserData: true,
      adPersonalization: true,
      analyticsStorage: true,
    }
    localStorage.setItem('snake_ladder_consent_v2', JSON.stringify(allAccepted))
    updateGtagConsent(allAccepted)
    setIsVisible(false)
  }

  const handleSaveCustom = () => {
    localStorage.setItem('snake_ladder_consent_v2', JSON.stringify(preferences))
    updateGtagConsent(preferences)
    setIsVisible(false)
  }

  const togglePref = (key: keyof ConsentPreferences) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 md:max-w-md md:left-auto md:right-6 bg-secondary-850/95 border border-secondary-750 backdrop-blur-md rounded-2xl p-6 shadow-2xl text-secondary-100 font-sans flex flex-col gap-4 animate-fade-in transition-all duration-300">
      <div className="space-y-1.5">
        <h4 className="text-sm font-black font-sans uppercase tracking-wide text-secondary-100">
          Cookie Consent &amp; Privacy
        </h4>
        <p className="text-[0.7rem] text-secondary-400 leading-relaxed font-medium">
          We use cookies to synchronize multiplayer lobby rooms, pre-load game audio contexts, and serve contextual ads. You can customize your preferences for users in the EEA, the UK, and Switzerland.
        </p>
      </div>

      {showManage ? (
        <div className="space-y-3.5 border-t border-secondary-800/80 pt-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-secondary-200 block uppercase tracking-tight">Ad Cookies &amp; Data</span>
              <span className="text-[0.62rem] text-secondary-500 block">Required for third-party cookie tags</span>
            </div>
            <button
              onClick={() => togglePref('adStorage')}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer outline-none border-0 ${
                preferences.adStorage ? 'bg-primary-600' : 'bg-secondary-700'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences.adStorage ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-secondary-200 block uppercase tracking-tight">Personalized Advertising</span>
              <span className="text-[0.62rem] text-secondary-500 block">Deliver tailored and relevant board game ads</span>
            </div>
            <button
              onClick={() => {
                togglePref('adUserData')
                togglePref('adPersonalization')
              }}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer outline-none border-0 ${
                preferences.adPersonalization ? 'bg-primary-600' : 'bg-secondary-700'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences.adPersonalization ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-secondary-200 block uppercase tracking-tight">Analytics Tracker</span>
              <span className="text-[0.62rem] text-secondary-500 block">Measure loading speed and layout latency</span>
            </div>
            <button
              onClick={() => togglePref('analyticsStorage')}
              className={`w-9 h-5 rounded-full p-0.5 transition-colors cursor-pointer outline-none border-0 ${
                preferences.analyticsStorage ? 'bg-primary-600' : 'bg-secondary-700'
              }`}
            >
              <div
                className={`w-4 h-4 bg-white rounded-full transition-transform ${
                  preferences.analyticsStorage ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex gap-2 pt-2">
            <GamingButton onClick={() => setShowManage(false)} theme="classic" size="sm" className="flex-1">
              Back
            </GamingButton>
            <GamingButton onClick={handleSaveCustom} theme="primary" size="sm" className="flex-1">
              Save Choices
            </GamingButton>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 pt-1">
          <GamingButton onClick={handleAcceptAll} theme="golden" size="lg" className="w-full">
            Accept All (Consent)
          </GamingButton>
          <div className="flex gap-2">
            <GamingButton onClick={() => setShowManage(true)} theme="classic" size="sm" className="flex-1">
              Manage Settings
            </GamingButton>
            <GamingButton onClick={() => setIsVisible(false)} theme="classic" size="sm" className="flex-1">
              Dismiss
            </GamingButton>
          </div>
        </div>
      )}
    </div>
  )
}
