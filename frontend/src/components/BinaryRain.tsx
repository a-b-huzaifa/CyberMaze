import { useEffect, useRef } from 'react'
import './BinaryRain.css'

interface BinaryRainProps {
  intensity?: number
  speed?: number
}

const BinaryRain: React.FC<BinaryRainProps> = ({ intensity = 100, speed = 1 }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const createBinaryRain = () => {
      // Clear any existing elements
      container.innerHTML = ''

      // Responsive binary count based on screen size
      const isMobile = window.innerWidth <= 768
      const isSmallMobile = window.innerWidth <= 480
      const binaryCount = isSmallMobile ? 50 : isMobile ? 100 : 200

      // Create binary numbers
      for (let i = 0; i < binaryCount; i++) {
        const binaryNumber = document.createElement('div')
        binaryNumber.classList.add('binary-number')
        binaryNumber.textContent = Math.random() > 0.5 ? '1' : '0'

        // Randomize position and animation properties
        binaryNumber.style.left = `${Math.random() * 100}vw` // Random horizontal position
        binaryNumber.style.animationDuration = `${(Math.random() * 4 + 3) / speed}s` // Random duration (slower)
        binaryNumber.style.animationDelay = `-${Math.random() * 5}s` // Negative delay for random start
        
        // Responsive font sizes
        const baseFontSize = isSmallMobile ? 8 : isMobile ? 12 : 15
        const fontSizeVariation = isSmallMobile ? 4 : isMobile ? 6 : 10
        binaryNumber.style.fontSize = `${Math.random() * fontSizeVariation + baseFontSize}px`
        
        // Responsive opacity
        const baseOpacity = isSmallMobile ? 0.6 : isMobile ? 0.7 : 0.8
        binaryNumber.style.opacity = `${baseOpacity + Math.random() * 0.2}`

        container.appendChild(binaryNumber)
      }
    }

    // Initial creation
    createBinaryRain()

    // Handle window resize for responsive adjustments
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        createBinaryRain()
      }, 300)
    }

    window.addEventListener('resize', handleResize)

    // Cleanup function
    return () => {
      if (container) {
        container.innerHTML = ''
      }
      window.removeEventListener('resize', handleResize)
      if (resizeTimeout) {
        clearTimeout(resizeTimeout)
      }
    }
  }, [speed])

  return (
    <div
      ref={containerRef}
      className="binary-rain"
      style={{ opacity: intensity / 100 }}
    />
  )
}

export default BinaryRain
