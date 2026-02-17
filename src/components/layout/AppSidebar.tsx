import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  LayoutGrid,
  FolderGit2,
  FileText,
  BookOpen,
  Calendar,
  Wallet,
  Bot,
  Settings,
  Shield,
  ChevronLeft,
  ChevronRight,
  Search,
  ClipboardList,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/dashboard/command-center', label: 'Command Center', icon: LayoutGrid },
  { to: '/dashboard/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/content-pipeline', label: 'Content Pipeline', icon: FileText },
  { to: '/dashboard/research', label: 'Research', icon: BookOpen },
  { to: '/dashboard/personal', label: 'Calendar & Travel', icon: Calendar },
  { to: '/dashboard/finance', label: 'Finance', icon: Wallet },
  { to: '/dashboard/agents', label: 'Agent Builder', icon: Bot },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
]

const bottomItems = [
  { to: '/dashboard/audit', label: 'Audit', icon: ClipboardList },
  { to: '/dashboard/admin', label: 'Admin', icon: Shield },
]

const SIDEBAR_STORAGE_KEY = 'atlas-sidebar-collapsed'

export function AppSidebar() {
  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem(SIDEBAR_STORAGE_KEY) === 'true'
    } catch {
      return false
    }
  })

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    try {
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next))
    } catch {}
  }

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-card-secondary transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[72px]' : 'w-64'
      )}
      aria-label="Main navigation"
    >
      <div className="flex h-14 items-center gap-2 border-b border-border px-3">
        {!collapsed && (
          <NavLink to="/dashboard" className="flex items-center gap-2 font-semibold text-foreground">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              A
            </span>
            <span>Atlas</span>
          </NavLink>
        )}
        {collapsed && (
          <NavLink to="/dashboard" className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
            A
          </NavLink>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 overflow-y-auto p-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/dashboard'}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-primary/15 text-primary border-l-2 border-primary border-l-primary'
                  : 'text-muted-foreground hover:bg-card hover:text-foreground',
                collapsed && 'justify-center px-2'
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </div>

      <div className="border-t border-border p-2">
        {bottomItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200',
                isActive ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-card hover:text-foreground',
                collapsed && 'justify-center px-2'
              )
            }
          >
            <Icon className="h-5 w-5 shrink-0" aria-hidden />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </div>

      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggle}
          className="w-full"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </Button>
      </div>
    </aside>
  )
}

export function GlobalSearchTrigger() {
  return (
    <button
      type="button"
      className="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
      aria-label="Open global search"
    >
      <Search className="h-4 w-4 shrink-0" />
      <span>Search...</span>
      <kbd className="ml-auto hidden rounded bg-muted px-1.5 py-0.5 text-xs sm:inline-block">⌘K</kbd>
    </button>
  )
}
