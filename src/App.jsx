import { useEffect, useState, useRef } from 'react'
import cowLogo from './assets/cowLogo.png'

const REFERRAL_API_URL = 'https://wordle-api-sq0v.onrender.com/users/referral/click'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.wordle.app.wordle'

function detectDevice() {
  if (typeof window === 'undefined' || !window.navigator) {
    return { isAndroid: false, isIOS: false }
  }
  const ua = navigator.userAgent || navigator.vendor || window.opera || ''
  const isAndroid = /android/i.test(ua)
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

  return { isAndroid, isIOS }
}

export default function App() {
  const [device] = useState(() => detectDevice())
  const [isRedirecting, setIsRedirecting] = useState(() => detectDevice().isAndroid)
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    if (hasTrackedRef.current) return
    hasTrackedRef.current = true

    const currentUrl = window.location.href
    const isAndroidDevice = device.isAndroid

    // Track referral click and navigate to Play Store if on Android once API returns
    const trackReferralAndRedirect = async () => {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 4000)

      try {
        await fetch(REFERRAL_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            referral_url: currentUrl,
          }),
          signal: controller.signal,
        })
      } catch (err) {
        console.warn('Referral click notification completed:', err)
      } finally {
        clearTimeout(timeoutId)
        if (isAndroidDevice) {
          window.location.href = PLAY_STORE_URL
        } else {
          setIsRedirecting(false)
        }
      }
    }

    trackReferralAndRedirect()
  }, [device.isAndroid])

  const handleAndroidClick = () => {
    window.location.href = PLAY_STORE_URL
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-between px-4 py-8 sm:py-12">
      {/* Top spacing / subtle decorative badge */}
      <div className="w-full max-w-md flex justify-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold tracking-wide text-indigo-700 bg-indigo-50 border border-indigo-100/80 rounded-full shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Now Available on Android
        </span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md my-auto flex flex-col items-center bg-white/95 backdrop-blur-md rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/70 p-6 sm:p-8 text-center transition-all">
        {/* App Logo */}
        <div className="relative group mb-6">
          <div className="absolute -inset-1 rounded-3xl bg-gradient-to-tr from-amber-400 via-indigo-500 to-purple-500 opacity-20 blur-md group-hover:opacity-30 transition duration-300"></div>
          <img
            src={cowLogo}
            alt="Clash of Words Logo"
            className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-3xl object-cover shadow-md shadow-indigo-100 ring-1 ring-slate-200/80 transform transition duration-300 hover:scale-105"
            width="144"
            height="144"
          />
        </div>

        {/* Title & Tagline */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Clash of Words
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed max-w-xs">
          The ultimate multiplayer word puzzle battle. Challenge your friends and climb the global leaderboards!
        </p>

        {/* Highlights Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 mb-6">
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200/80">
            ⚡ Quick 1v1 Duels
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200/80">
            🧠 Brain Training
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200/80">
            🏆 Daily Tournaments
          </span>
        </div>

        {/* Redirecting Banner for Android Users */}
        {device.isAndroid && isRedirecting && (
          <div className="w-full mb-5 p-3 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-center gap-2.5 text-xs font-medium text-indigo-900 animate-pulse">
            <svg
              className="animate-spin h-4 w-4 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>Opening Google Play Store...</span>
          </div>
        )}

        {/* Download Buttons Section */}
        <div className="w-full flex flex-col gap-3.5">
          {/* Google Play Store Button */}
          <a
            href={PLAY_STORE_URL}
            onClick={handleAndroidClick}
            className="group relative w-full flex items-center justify-center gap-3.5 bg-slate-900 hover:bg-slate-800 text-white font-medium py-3.5 px-6 rounded-2xl shadow-lg shadow-slate-900/15 border border-slate-800 transition-all duration-200 active:scale-98"
          >
            {/* Google Play SVG Icon */}
            <svg
              className="w-7 h-7 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.609 1.814L13.793 12 3.61 22.186A2.43 2.43 0 0 1 3 20.485V3.515c0-.648.225-1.246.609-1.701z"
                fill="#00C3FF"
              />
              <path
                d="M17.18 8.613L13.793 12l3.387 3.387 3.824-2.176c1.085-.617 1.085-1.625 0-2.242L17.18 8.613z"
                fill="#FFC800"
              />
              <path
                d="M3.61 1.814c.484-.575 1.258-.87 2.146-.365l11.424 6.49-3.387 3.387L3.61 1.814z"
                fill="#00E676"
              />
              <path
                d="M13.793 12l3.387 3.387-11.424 6.49c-.888.505-1.662.21-2.146-.365L13.793 12z"
                fill="#FF3A44"
              />
            </svg>

            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-300 leading-none">
                GET IT ON
              </span>
              <span className="text-lg font-bold tracking-tight text-white leading-tight">
                Google Play
              </span>
            </div>
          </a>

          {/* Apple App Store Button - Greyed Out / Coming Soon */}
          <div
            className="relative w-full flex items-center justify-center gap-3.5 bg-slate-100/90 text-slate-400 py-3.5 px-6 rounded-2xl border border-slate-200/80 cursor-not-allowed select-none opacity-70"
            aria-disabled="true"
            title="Coming soon to the Apple App Store"
          >
            {/* Apple Logo SVG */}
            <svg
              className="w-7 h-7 shrink-0 fill-slate-400"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.58.66-1.09 1.73-.95 2.76 1.01.08 2.05-.51 2.67-1.26z" />
            </svg>

            <div className="flex flex-col text-left">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400 leading-none">
                Download on the
              </span>
              <span className="text-lg font-bold tracking-tight text-slate-500 leading-tight">
                App Store
              </span>
            </div>

            {/* Coming Soon Pill */}
            <span className="ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200/80">
              Coming Soon
            </span>
          </div>
        </div>

        {/* Helpful context note */}
        {device.isIOS ? (
          <p className="mt-4 text-xs text-amber-700 bg-amber-50/70 py-2 px-3 rounded-xl border border-amber-100">
            iOS version is currently in development. It will be available on the App Store soon!
          </p>
        ) : device.isAndroid ? (
          <p className="mt-4 text-xs text-slate-500">
            If you are not automatically redirected, tap the Google Play button above.
          </p>
        ) : (
          <p className="mt-4 text-xs text-slate-500">
            Available now on Android via Google Play. iOS coming soon.
          </p>
        )}
      </div>

      {/* Footer */}
      <footer className="w-full max-w-md text-center pt-6 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} Clash of Words. All rights reserved.</p>
      </footer>
    </main>
  )
}
