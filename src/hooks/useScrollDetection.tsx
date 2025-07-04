import { useState, useEffect } from "react"

interface ScrollOptions {
  threshold?: number
}

export const useScrollDetection = ({ threshold = 0 }: ScrollOptions = {}) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > threshold)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [threshold])

  return isScrolled
} 