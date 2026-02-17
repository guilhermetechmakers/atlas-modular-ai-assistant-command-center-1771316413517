import { useState, useCallback, useRef, useEffect } from 'react'
import { Search, FileText, Calendar, Wallet, FolderGit2, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useGlobalSearch } from '@/hooks/useCommandCenter'
import { cn } from '@/lib/utils'
import type { GlobalSearchResult } from '@/types/command-center'

const typeIcons: Record<GlobalSearchResult['type'], typeof FileText> = {
  repo: FolderGit2,
  note: FileText,
  event: Calendar,
  transaction: Wallet,
}

export interface GlobalSearchBarProps {
  className?: string
  onSelect?: (result: GlobalSearchResult) => void
}

export function GlobalSearchBar({ className, onSelect }: GlobalSearchBarProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [debounced, setDebounced] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(query), 200)
    return () => clearTimeout(t)
  }, [query])

  const { data: results = [], isFetching } = useGlobalSearch(debounced)

  useEffect(() => {
    setOpen(debounced.length >= 2)
  }, [debounced])

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [handleClickOutside])

  const handleSelect = useCallback(
    (r: GlobalSearchResult) => {
      onSelect?.(r)
      setOpen(false)
      setQuery('')
    },
    [onSelect]
  )

  return (
    <div ref={containerRef} className={cn('relative w-full max-w-2xl', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
        <Input
          type="search"
          placeholder="Search repos, notes, events, transactions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setOpen(true)}
          className="pl-10 pr-10 rounded-xl border-border bg-card focus:ring-2 focus:ring-primary/30 transition-all duration-200"
          aria-label="Global search"
          aria-expanded={open}
          aria-autocomplete="list"
        />
        {isFetching && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" aria-hidden />
        )}
        {!isFetching && query.length > 0 && (
          <kbd className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded bg-muted px-1.5 py-0.5 text-xs sm:inline-block">⌘K</kbd>
        )}
      </div>

      {open && (
        <div
          className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-auto rounded-card-lg border border-border bg-card shadow-card animate-fade-in"
          role="listbox"
        >
          {results.length === 0 && !isFetching && (
            <div className="p-4 text-sm text-muted-foreground">No results. Try a different query.</div>
          )}
          {results.map((r) => {
            const Icon = typeIcons[r.type]
            return (
              <button
                key={`${r.type}-${r.id}`}
                type="button"
                role="option"
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-primary/10 focus:bg-primary/10 focus:outline-none"
                onClick={() => handleSelect(r)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-foreground truncate">{r.title}</div>
                  {r.subtitle && (
                    <div className="text-xs text-muted-foreground truncate">{r.subtitle}</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
