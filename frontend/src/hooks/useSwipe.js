import { useRef } from 'react';

/**
 * Custom hook to handle swipe detection (Touch and Mouse)
 * @param {Object} options
 * @param {Function} options.onSwipeLeft - Callback for left swipe
 * @param {Function} options.onSwipeRight - Callback for right swipe
 * @param {number} options.threshold - Minimum distance to trigger swipe (default: 20% of screen width)
 * @returns {Object} Event handlers to attach to the container
 */
export function useSwipe({ onSwipeLeft, onSwipeRight, threshold }) {
    const touchStartX = useRef(0);
    const touchStartY = useRef(0);
    const touchEndX = useRef(0);
    const mouseStartX = useRef(0);
    const mouseEndX = useRef(0);

    // Default threshold if not provided (20% of viewport width)
    const getThreshold = () => threshold || window.innerWidth * 0.2;

    // --- Touch Events ---

    const handleTouchStart = (e) => {
        const touch = e.targetTouches[0];
        touchStartX.current = touch.clientX;
        touchStartY.current = touch.clientY;
    };

    const handleTouchMove = (e) => {
        const touch = e.targetTouches[0];
        const currentTouchX = touch.clientX;
        const currentTouchY = touch.clientY;

        const diffX = touchStartX.current - currentTouchX;
        const diffY = touchStartY.current - currentTouchY;

        // Determine if movement is primarily horizontal or vertical
        // If horizontal, prevent default to stop scrolling (if browser allows)
        if (Math.abs(diffX) > Math.abs(diffY)) {
            if (e.cancelable) e.preventDefault();
        }

        touchEndX.current = currentTouchX;
    };

    const handleTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;

        const diffX = touchStartX.current - touchEndX.current;

        if (Math.abs(diffX) > getThreshold()) {
            if (diffX > 0) {
                onSwipeLeft && onSwipeLeft();
            } else {
                onSwipeRight && onSwipeRight();
            }
        }

        // Reset
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    // --- Mouse Events ---

    const handleMouseDown = (e) => {
        mouseStartX.current = e.clientX;
    };

    const handleMouseMove = (e) => {
        // Only track when primary button is pressed
        if (e.buttons !== 1) return;
        mouseEndX.current = e.clientX;
    };

    const handleMouseUp = () => {
        if (!mouseStartX.current || !mouseEndX.current) return;

        const diffX = mouseStartX.current - mouseEndX.current;

        if (Math.abs(diffX) > getThreshold()) {
            if (diffX > 0) {
                onSwipeLeft && onSwipeLeft();
            } else {
                onSwipeRight && onSwipeRight();
            }
        }

        // Reset
        mouseStartX.current = 0;
        mouseEndX.current = 0;
    };

    const handleMouseLeave = () => {
        mouseStartX.current = 0;
        mouseEndX.current = 0;
    };

    return {
        onTouchStart: handleTouchStart,
        onTouchMove: handleTouchMove,
        onTouchEnd: handleTouchEnd,
        onTouchCancel: handleTouchEnd,
        onMouseDown: handleMouseDown,
        onMouseMove: handleMouseMove,
        onMouseUp: handleMouseUp,
        onMouseLeave: handleMouseLeave
    };
}
