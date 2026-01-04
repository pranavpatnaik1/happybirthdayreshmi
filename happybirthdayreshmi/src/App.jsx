import { useState, useEffect, useRef } from 'react'
import './App.css'

function App() {
  const names = ['reshmi', 'bub', 'slug', 'terry', 'bob']
  const [currentIndex, setCurrentIndex] = useState(0)
  const [currentSection, setCurrentSection] = useState(0)
  const [hasSwipedDown, setHasSwipedDown] = useState(false)
  const [showSwipeDownIndicator, setShowSwipeDownIndicator] = useState(false)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const touchStartY = useRef(0)
  const touchEndY = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeDownIndicator(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX
    touchEndX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    touchEndY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX
    touchEndY.current = e.touches[0].clientY
  }

  const handleTouchEnd = (e) => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const swipeDistanceX = touchStartX.current - touchEndX.current
    const swipeDistanceY = touchStartY.current - touchEndY.current
    const minSwipeDistance = 50

    // Check if vertical swipe is more dominant
    if (Math.abs(swipeDistanceY) > Math.abs(swipeDistanceX)) {
      if (swipeDistanceY > minSwipeDistance && currentSection === 0) {
        // Swipe down - cycle to next name
        setHasSwipedDown(true)
        setCurrentIndex((prev) => (prev + 1) % names.length)
      } else if (swipeDistanceY < -minSwipeDistance && currentSection === 0) {
        // Swipe up - cycle to previous name
        setCurrentIndex((prev) => (prev - 1 + names.length) % names.length)
      }
    } else {
      // Horizontal swipe for section navigation
      if (swipeDistanceX > minSwipeDistance) {
        // Swipe left (finger moved left, so we go to next section)
        setCurrentSection((prev) => Math.min(prev + 1, 1))
      } else if (swipeDistanceX < -minSwipeDistance) {
        // Swipe right (finger moved right, so we go to previous section)
        setCurrentSection((prev) => Math.max(prev - 1, 0))
      }
    }
    
    touchStartX.current = 0
    touchEndX.current = 0
    touchStartY.current = 0
    touchEndY.current = 0
  }

  const handleMouseDown = (e) => {
    touchStartX.current = e.clientX
    touchEndX.current = e.clientX
    touchStartY.current = e.clientY
    touchEndY.current = e.clientY
  }

  const handleMouseMove = (e) => {
    if (touchStartX.current !== 0) {
      touchEndX.current = e.clientX
      touchEndY.current = e.clientY
    }
  }

  const handleMouseUp = (e) => {
    if (!touchStartX.current || !touchEndX.current) return
    
    const swipeDistanceX = touchStartX.current - touchEndX.current
    const swipeDistanceY = touchStartY.current - touchEndY.current
    const minSwipeDistance = 50

    // Check if vertical swipe is more dominant
    if (Math.abs(swipeDistanceY) > Math.abs(swipeDistanceX)) {
      if (swipeDistanceY > minSwipeDistance && currentSection === 0) {
        // Drag down - cycle to next name
        setHasSwipedDown(true)
        setCurrentIndex((prev) => (prev + 1) % names.length)
      } else if (swipeDistanceY < -minSwipeDistance && currentSection === 0) {
        // Drag up - cycle to previous name
        setCurrentIndex((prev) => (prev - 1 + names.length) % names.length)
      }
    } else {
      // Horizontal drag for section navigation
      if (swipeDistanceX > minSwipeDistance) {
        // Drag left to go to next section
        setCurrentSection((prev) => Math.min(prev + 1, 1))
      } else if (swipeDistanceX < -minSwipeDistance) {
        // Drag right to go to previous section
        setCurrentSection((prev) => Math.max(prev - 1, 0))
      }
    }
    
    touchStartX.current = 0
    touchEndX.current = 0
    touchStartY.current = 0
    touchEndY.current = 0
  }

  const handleWheel = (e) => {
    // Detect trackpad swipes
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 50) {
      // Horizontal swipe for section navigation
      e.preventDefault()
      
      if (e.deltaX > 0) {
        // Swipe right (scroll right) - go to next section
        setCurrentSection((prev) => Math.min(prev + 1, 1))
      } else {
        // Swipe left (scroll left) - go to previous section
        setCurrentSection((prev) => Math.max(prev - 1, 0))
      }
    } else if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && Math.abs(e.deltaY) > 50 && currentSection === 0) {
      // Vertical swipe for name cycling (only on main screen)
      e.preventDefault()
      
      if (e.deltaY > 0) {
        // Swipe down - cycle to next name
        setHasSwipedDown(true)
        setCurrentIndex((prev) => (prev + 1) % names.length)
      } else {
        // Swipe up - cycle to previous name
        setCurrentIndex((prev) => (prev - 1 + names.length) % names.length)
      }
    }
  }

  const currentName = names[currentIndex]
  const isPotterybloom = currentName === 'potterybloom'
  const isReshmi = currentName === 'reshmi'

  return (
    <div 
      className="app-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
    >
      <div className={`section section-0 ${currentSection === 0 ? 'active' : ''}`}>
        <div className="app">
          <h1>
            <span className='happs'>happy birthday,</span><br />
            <span key={currentIndex} className={`name ${isPotterybloom ? 'smaller' : ''} ${isReshmi ? 'reshmi' : ''}`}>
              {currentName.split('').map((letter, idx) => (
                <span key={idx} className="letter" style={{ animationDelay: `${idx * 0.05}s` }}>
                  {letter === ' ' ? '\u00A0' : letter}
                </span>
              ))}
            </span>
            {isReshmi && !hasSwipedDown && showSwipeDownIndicator && (
              <span className="swipe-down-indicator">swipe down for a surprise!</span>
            )}
          </h1>
          <div className="swipe-indicator">
            swipe left! →
          </div>
        </div>
      </div>
      <div className={`section section-1 ${currentSection === 1 ? 'active' : ''}`}>
        <div className="new-section">
          <video controls className="video-player">
            <source src="/video.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <p>Swipe left to go back</p>
        </div>
      </div>
    </div>
  )
}

export default App
