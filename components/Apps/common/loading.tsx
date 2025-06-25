"use client"

import { cn } from "@/lib/utils"
import { Loader2, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

interface LoadingProps {
  variant?: "default" | "minimal" | "dots" | "pulse"
  size?: "sm" | "md" | "lg"
  message?: string
  showProgress?: boolean
  className?: string
}

export default function LoadingComponent({
  variant = "default",
  size = "md",
  message = "Loading...",
  showProgress = false,
  className,
}: LoadingProps) {
  const [progress, setProgress] = useState(0)
  const [dots, setDots] = useState("")

  // Simulate progress for demo purposes
  useEffect(() => {
    if (!showProgress) return

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0
        return prev + Math.random() * 15
      })
    }, 200)

    return () => clearInterval(interval)
  }, [showProgress])

  // Animated dots for loading text
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  const spinnerSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center p-4", className)}>
        <Loader2 className={cn("animate-spin text-primary", spinnerSizes[size])} />
        <span className={cn("ml-2 text-muted-foreground", sizeClasses[size])}>
          {message}
          {dots}
        </span>
      </div>
    )
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8", className)}>
        <div className="flex space-x-2 mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-primary rounded-full animate-bounce"
              style={{
                animationDelay: `${i * 0.1}s`,
                animationDuration: "0.6s",
              }}
            />
          ))}
        </div>
        <p className={cn("text-muted-foreground animate-pulse", sizeClasses[size])}>{message}</p>
      </div>
    )
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center justify-center p-8 space-y-4", className)}>
        <div className="relative">
          <div className="w-16 h-16 bg-primary/20 rounded-full animate-ping absolute"></div>
          <div className="w-16 h-16 bg-primary/40 rounded-full animate-ping absolute animation-delay-75"></div>
          <div className="w-16 h-16 bg-primary rounded-full animate-pulse relative flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
        </div>
        <p className={cn("text-muted-foreground", sizeClasses[size])}>{message}</p>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn("flex flex-col items-center justify-center min-h-[200px] p-8 space-y-6", className)}>
      {/* Main spinner with glow effect */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse"></div>
        <Loader2
          className={cn(
            "animate-spin text-primary relative z-10",
            spinnerSizes[size === "sm" ? "md" : size === "md" ? "lg" : "lg"],
          )}
        />
      </div>

      {/* Loading message with typing animation */}
      <div className="text-center space-y-2">
        <p className={cn("font-medium text-foreground animate-pulse", sizeClasses[size])}>
          {message}
          {dots}
        </p>

        {showProgress && (
          <div className="w-48 max-w-full mx-auto">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating particles animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
