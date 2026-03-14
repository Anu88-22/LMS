'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import YouTube, { YouTubeProps } from 'react-youtube';

interface VideoPlayerProps {
    videoId: number;
    youtubeUrl: string; // expecting the ID like 'dQw4w9WgXcQ' for simplicity in youtube component
    startPositionSeconds: number;
    onProgress: (currentTime: number) => void;
    onCompleted: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
    videoId,
    youtubeUrl,
    startPositionSeconds,
    onProgress,
    onCompleted,
}) => {
    const playerRef = useRef<any>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Parse YouTube video ID from standard URL if full URL is passed.
    const getExtractYoutubeId = (urlOrId: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = urlOrId.match(regExp);
        return (match && match[2].length === 11) ? match[2] : urlOrId;
    };

    const ytId = getExtractYoutubeId(youtubeUrl);

    const onReady: YouTubeProps['onReady'] = (event) => {
        playerRef.current = event.target;
        // We could technically seek to startPosition here if the player doesn't respect playerVars
    };

    const onStateChange: YouTubeProps['onStateChange'] = (event) => {
        // 1 is Playing, 2 is Paused, 0 is Ended
        if (event.data === 1) {
            setIsPlaying(true);
        } else {
            setIsPlaying(false);
            // When paused or buffering, update progress
            if (playerRef.current) {
                onProgress(Math.floor(playerRef.current.getCurrentTime()));
            }
        }

        if (event.data === 0) {
            onCompleted();
        }
    };

    // Poll progress every 5 seconds while playing
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying && playerRef.current) {
            interval = setInterval(() => {
                onProgress(Math.floor(playerRef.current.getCurrentTime()));
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, onProgress]);

    const opts: YouTubeProps['opts'] = {
        height: '100%',
        width: '100%',
        playerVars: {
            autoplay: 0,
            start: startPositionSeconds,
            rel: 0,
        },
    };

    return (
        <div className="relative pt-[56.25%] w-full bg-black rounded-xl overflow-hidden shadow-2xl">
            <div className="absolute top-0 left-0 w-full h-full">
                <YouTube
                    videoId={ytId}
                    opts={opts}
                    onReady={onReady}
                    onStateChange={onStateChange}
                    className="w-full h-full"
                    iframeClassName="w-full h-full"
                />
            </div>
        </div>
    );
};
