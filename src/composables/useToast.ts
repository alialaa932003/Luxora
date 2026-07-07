import { toast as sonnerToast } from 'vue-sonner'

export function useToast() {
  function toast({
    title,
    description,
    variant = 'default',
    duration,
    icon,
  }: {
    title: string
    description?: string
    variant?: 'default' | 'destructive' | 'success' | 'cart'
    duration?: number
    icon?: any
  }) {
    const options: any = { description }
    if (duration !== undefined) options.duration = duration
    if (icon) options.icon = icon

    if (variant === 'destructive') {
      sonnerToast.error(title, options)
    } else if (variant === 'success') {
      sonnerToast.success(title, options)
    } else if (variant === 'cart') {
      sonnerToast(title, {
        ...options,
        duration: duration || 2000,
        className: 'bg-primary text-primary-foreground border-primary/20 shadow-xl shadow-primary/20 !rounded-2xl',
        descriptionClassName: 'text-primary-foreground/90 font-medium',
      })
    } else {
      sonnerToast(title, options)
    }
  }

  return { toast }
}
