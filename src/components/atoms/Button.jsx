import { forwardRef } from "react"
import { cn } from "@/utils/cn"

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "default", 
  children, 
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variants = {
    primary: "bg-gradient-to-r from-primary to-secondary text-white hover:shadow-neon hover:scale-[1.02] focus:ring-primary",
    secondary: "bg-surface text-white border border-white/20 hover:border-primary/50 hover:shadow-neon-purple hover:scale-[1.02] focus:ring-secondary",
    outline: "border border-primary text-primary hover:bg-primary hover:text-background hover:shadow-neon hover:scale-[1.02] focus:ring-primary",
    ghost: "text-gray-400 hover:text-white hover:bg-surface/50 hover:scale-[1.02] focus:ring-primary",
    danger: "bg-gradient-to-r from-error to-accent text-white hover:shadow-neon-pink hover:scale-[1.02] focus:ring-error"
  }
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    default: "h-10 px-4",
    lg: "h-12 px-6 text-lg",
    icon: "h-10 w-10"
  }
  
  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"

export default Button