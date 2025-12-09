import { useState, useEffect, useRef } from 'react';
import { useMedia } from '../context/MediaContext';

export function useVideoPlayback(isFirst = false) {
    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const { isMuted } = useMedia();

    const [isPlaying, setIsPlaying] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const [progress, setProgress] = useState(0);

    // Auto play/pause when video enters/leaves viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                    } else {
                        setIsInView(false);
                    }
                });
            },
            { threshold: 0.5 }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                observer.unobserve(containerRef.current);
            }
        };
    }, []);

    // Handle auto play/pause based on visibility and global mute state
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = isMuted;

            if (isInView) {
                const playPromise = videoRef.current.play();
                if (playPromise !== undefined) {
                    playPromise
                        .then(() => setIsPlaying(true))
                        .catch(error => {
                            console.error('Error playing video:', error);
                        });
                }
            } else {
                try {
                    videoRef.current.pause();
                    setIsPlaying(false);
                } catch (error) {
                    // Ignore pause errors
                }
            }
        }
    }, [isInView, isMuted]);

    const togglePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                setIsPlaying(false);
            } else {
                videoRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const current = videoRef.current.currentTime;
            const total = videoRef.current.duration;
            setProgress((current / total) * 100);
        }
    };

    const handleSeek = (e) => {
        e.stopPropagation();
        const progressBar = e.currentTarget;
        const rect = progressBar.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        const percentage = clickX / width;

        if (videoRef.current) {
            const newTime = percentage * videoRef.current.duration;
            videoRef.current.currentTime = newTime;
            setProgress(percentage * 100);
        }
    };

    const handleVideoEnd = () => {
        const nextCard = containerRef.current?.nextElementSibling;
        if (nextCard) {
            nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return {
        videoRef,
        containerRef,
        isPlaying,
        progress,
        togglePlayPause,
        handleTimeUpdate,
        handleSeek,
        handleVideoEnd
    };
}
