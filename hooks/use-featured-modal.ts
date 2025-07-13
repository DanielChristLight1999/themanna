"use client"

import { useEffect, useState } from "react"

export function useFeaturedFoodsModal() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [showFloatingButton, setShowFloatingButton] = useState(false)

  const today = new Date().toISOString().split("T")[0]
  const storageKey = `featured-foods-dismissed-${today}`

  useEffect(() => {
    // Check if modal was already dismissed today
    const wasDismissedToday = localStorage.getItem(storageKey)
    console.log("wasDismissedToday", wasDismissedToday)

    if (!wasDismissedToday) {
      // Show modal after a short delay for better UX
      const timer = setTimeout(() => {
        setIsModalOpen(true)
      }, 1000)

      return () => clearTimeout(timer)
    } else {
      // If dismissed today, show floating button
      setShowFloatingButton(true)
    }
  }, [storageKey])

  const closeModal = () => {
    setIsModalOpen(false)
    setShowFloatingButton(true)
    // Mark as dismissed for today
    localStorage.setItem(storageKey, "true")
  }

  const openModal = () => {
    setIsModalOpen(true)
  }

  return {
    isModalOpen,
    showFloatingButton,
    closeModal,
    openModal,
  }
}
