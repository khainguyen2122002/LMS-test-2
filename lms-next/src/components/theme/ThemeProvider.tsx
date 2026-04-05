"use client"

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type ThemeMode = 'dark' | 'light' | 'system'
export type ResolvedTheme = 'dark' | 'light'

interface ThemeContextValue {
  /** The user's chosen mode ('dark' | 'light' | 'system') */
  mode: ThemeMode
  /** The actually applied theme ('dark' | 'light') — resolved from system if needed */
  resolvedTheme: ResolvedTheme
  /** Change the theme mode */
  setMode: (mode: ThemeMode) => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'inspiring-hr-theme'

function getSystemPreference(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === 'system' ? getSystemPreference() : mode
}

function applyToDOM(resolved: ResolvedTheme) {
  const html = document.documentElement
  html.classList.remove('dark', 'light')
  html.classList.add(resolved)
  // Set color-scheme for native browser elements (scrollbars, form controls)
  html.style.colorScheme = resolved
}

// ─── Inline script to prevent FOUC ───────────────────────────────────────────
// This runs BEFORE React hydrates so there's no flash of wrong theme.
export const ThemeScript = () => (
  <script
    dangerouslySetInnerHTML={{
      __html: `
(function(){
  try {
    var mode = localStorage.getItem('${STORAGE_KEY}') || 'dark';
    var resolved = mode === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : mode;
    document.documentElement.classList.remove('dark','light');
    document.documentElement.classList.add(resolved);
    document.documentElement.style.colorScheme = resolved;
  } catch(e) {}
})()
      `.trim(),
    }}
  />
)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('dark')
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('dark')

  // Load persisted preference on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null
    const initial = stored && ['dark', 'light', 'system'].includes(stored) ? stored : 'dark'
    setModeState(initial)
    const resolved = resolveTheme(initial)
    setResolvedTheme(resolved)
    applyToDOM(resolved)
  }, [])

  // Listen for OS preference changes (only matters when mode === 'system')
  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => {
      if (mode === 'system') {
        const resolved = getSystemPreference()
        setResolvedTheme(resolved)
        applyToDOM(resolved)
      }
    }
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [mode])

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
    localStorage.setItem(STORAGE_KEY, newMode)
    const resolved = resolveTheme(newMode)
    setResolvedTheme(resolved)
    applyToDOM(resolved)
  }, [])

  return (
    <ThemeContext.Provider value={{ mode, resolvedTheme, setMode }}>
      {children}
    </ThemeContext.Provider>
  )
}
