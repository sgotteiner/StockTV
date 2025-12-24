'use client'

import { useRef, useCallback, useMemo } from 'react'

interface UseSwipeProps {
    onSwipeLeft?: () => void
    onSwipeRight?: () => void
    threshold?: number
}

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50 }: UseSwipeProps) {
    const touchStartX = useRef(0)
    const touchEndX = useRef(0)

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX
    }, [])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX
    }, [])

    const handleTouchEnd = useCallback(() => {
        const distance = touchStartX.current - touchEndX.current
        const isLeftSwipe = distance > threshold
        const isRightSwipe = distance < -threshold

        if (isLeftSwipe && onSwipeLeft) {
            onSwipeLeft()
        }
        if (isRightSwipe && onSwipeRight) {
            onSwipeRight()
        }
    }, [onSwipeLeft, onSwipeRight, threshold])

    return useMemo(() => ({
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd
    }), [handleTouchStart, handleTouchMove, handleTouchEnd])
}
