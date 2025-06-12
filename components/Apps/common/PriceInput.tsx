"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"

type PriceInputProps = {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  label?: string
  placeholder?: string
}

const PriceInput = ({ value, onChange, min, max, label = "Price", placeholder = "₦0.00" }: PriceInputProps) => {
  const [input, setInput] = useState("")

  const formatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  })

  useEffect(() => {
    if (!input && value > 0) {
      setInput(formatter.format(value))
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/[^0-9.]/g, "")
    if (raw.startsWith(".")) raw = "0" + raw

    setInput(raw)

    const numeric = parseFloat(raw) || 0
    onChange(numeric)
  }

  const handleBlur = () => {
    if (!input) {
      setInput("")
      return
    }

    setInput(formatter.format(value))
  }

  return (
    <div>
      {label && <Label className="text-xs text-gray-500">{label}</Label>}
      <Input
        type="text"
        value={input}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        placeholder={placeholder}
      />
    </div>
  )
}

export default PriceInput
