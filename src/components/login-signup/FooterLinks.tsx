import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

export interface FooterLinksProps {
  className?: string
}

const links = [
  { to: '/terms', label: 'Terms' },
  { to: '/privacy', label: 'Privacy' },
  { to: '/about', label: 'Help' },
] as const

export function FooterLinks({ className }: FooterLinksProps) {
  return (
    <footer className={cn('flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground', className)}>
      {links.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className="hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded"
        >
          {label}
        </Link>
      ))}
    </footer>
  )
}
