import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'outline'
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
      variant === 'default' && 'bg-[#722f37]/10 text-[#722f37]',
      variant === 'outline' && 'border border-current',
      className
    )}>
      {children}
    </span>
  )
}
