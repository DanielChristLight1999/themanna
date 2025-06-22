"use client"

import { Check, X } from "lucide-react"

interface PasswordStrengthProps {
  password: string
  className?: string
}

export function PasswordStrength({ password, className = "" }: PasswordStrengthProps) {
  const requirements = [
    { label: "At least 8 characters", test: (pwd: string) => pwd.length >= 8 },
    { label: "One uppercase letter", test: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: "One lowercase letter", test: (pwd: string) => /[a-z]/.test(pwd) },
    { label: "One number", test: (pwd: string) => /\d/.test(pwd) },
  ]

  const getStrengthScore = () => {
    return requirements.filter((req) => req.test(password)).length
  }

  const getStrengthColor = () => {
    const score = getStrengthScore()
    if (score <= 1) return "text-red-500"
    if (score <= 2) return "text-orange-500"
    if (score <= 3) return "text-yellow-500"
    return "text-green-500"
  }

  const getStrengthText = () => {
    const score = getStrengthScore()
    if (score <= 1) return "Weak"
    if (score <= 2) return "Fair"
    if (score <= 3) return "Good"
    return "Strong"
  }

  if (!password) return null

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Password strength:</span>
        <span className={`text-sm font-medium ${getStrengthColor()}`}>{getStrengthText()}</span>
      </div>

      <div className="grid grid-cols-4 gap-1">
        {[1, 2, 3, 4].map((level) => (
          <div
            key={level}
            className={`h-1 rounded-full transition-colors ${
              level <= getStrengthScore()
                ? level <= 1
                  ? "bg-red-500"
                  : level <= 2
                    ? "bg-orange-500"
                    : level <= 3
                      ? "bg-yellow-500"
                      : "bg-green-500"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>

      <ul className="space-y-1">
        {requirements.map((req, index) => (
          <li key={index} className="flex items-center text-xs">
            {req.test(password) ? (
              <Check className="w-3 h-3 text-green-500 mr-2" />
            ) : (
              <X className="w-3 h-3 text-gray-400 mr-2" />
            )}
            <span className={req.test(password) ? "text-green-600" : "text-gray-500"}>{req.label}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
