"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"

interface VerificationCodeInputProps {
    length: number
    value: string
    onChange: (value: string) => void
    disabled?: boolean
    error?: boolean
}

export function VerificationCodeInput({
    length,
    value,
    onChange,
    disabled = false,
    error = false,
}: VerificationCodeInputProps) {
    const [code, setCode] = useState<string[]>(new Array(length).fill(""))
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    useEffect(() => {
        // Initialize code array from value (remove any dashes)
        const cleanValue = value.replace("-", "")
        const codeArray = cleanValue.split("").slice(0, length)
        while (codeArray.length < length) {
            codeArray.push("")
        }
        setCode(codeArray)
    }, [value, length])

    const handleChange = (element: HTMLInputElement, index: number) => {
        const inputValue = element.value.toUpperCase()
        if (!/^[A-Z0-9]?$/.test(inputValue)) return

        const newCode = [...code]
        newCode[index] = inputValue
        setCode(newCode)

        // Join all the characters and call onChange
        onChange(newCode.join(""))

        // Focus next input
        if (inputValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace") {
            const newCode = [...code]

            if (code[index]) {
                // Clear current input
                newCode[index] = ""
                setCode(newCode)
                onChange(newCode.join(""))
            } else if (index > 0) {
                // Move to previous input and clear it
                newCode[index - 1] = ""
                setCode(newCode)
                onChange(newCode.join(""))
                inputRefs.current[index - 1]?.focus()
            }
        } else if (e.key === "ArrowLeft" && index > 0) {
            inputRefs.current[index - 1]?.focus()
        } else if (e.key === "ArrowRight" && index < length - 1) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pasteData = e.clipboardData
            .getData("text/plain")
            .replace(/[^A-Z0-9]/gi, "")
            .toUpperCase()
            .slice(0, length)

        if (pasteData) {
            const newCode = pasteData.split("")
            while (newCode.length < length) {
                newCode.push("")
            }
            setCode(newCode)
            onChange(pasteData)

            // Focus the next empty input or the last input
            const nextEmptyIndex = newCode.findIndex((char) => !char)
            const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1
            inputRefs.current[focusIndex]?.focus()
        }
    }

    return (
        <div className="flex justify-center space-x-2">
            {code.map((char, index) => (
                <Input
                    key={index}
                    ref={(el) => {
                        inputRefs.current[index] = el
                    }}

                    type="text"
                    maxLength={1}
                    value={char}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`w-12 h-12 text-center text-lg font-semibold border-2 transition-all duration-200 uppercase ${error
                            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-200 focus:border-pink-400 focus:ring-pink-400"
                        } ${char ? "bg-pink-50" : ""}`}
                    aria-label={`Verification code character ${index + 1}`}
                />
            ))}
        </div>
    )
}
