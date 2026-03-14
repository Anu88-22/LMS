'use client';

import { useState, useEffect } from 'react';
import YouTube from 'react-youtube';

/* Defines the props schema matching what the backend yields */
interface Video {
    id: number;
    title: string;
    youtube_url: string;
    order_index: number;
}

interface Section {
    id: number;
    title: string;
    order_index: number;
    videos: Video[];
}

export default function CoursePlayer({ subjectTitle, sections }: { subjectTitle: string, sections: Section[] }) {
    // Default to the first video of the first section if available
    const [activeVideo, setActiveVideo] = useState<Video | null>(null);

    useEffect(() => {
        if (sections.length > 0 && sections[0].videos.length > 0 && !activeVideo) {
            setActiveVideo(sections[0].videos[0]);
        }
    }, [sections, activeVideo]);

    const getYouTubeId = (url: string) => {
        try {
            const urlObj = new URL(url);
            if (urlObj.hostname.includes('youtube.com')) {
                return urlObj.searchParams.get('v');
            }
            if (urlObj.hostname.includes('youtu.be')) {
                return urlObj.pathname.slice(1);
            }
        } catch {
            return null;
        }
        return null;
    };

    const videoId = activeVideo ? getYouTubeId(activeVideo.youtube_url) : null;

    return (
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)] bg-gray-50">
            {/* Sidebar with Table of Contents */}
            <div className="w-full md:w-80 bg-white border-r border-gray-200 flex-shrink-0 h-auto md:h-[calc(100vh-4rem)] flex flex-col md:overflow-y-auto overflow-hidden shadow-sm">
                <div className="p-4 border-b border-gray-100 sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">{subjectTitle}</h2>
                    <p className="text-xs text-indigo-600 font-semibold mt-1 uppercase tracking-wider">Course Content</p>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {sections.length === 0 ? (
                        <div className="p-6 text-sm text-gray-500 text-center">No lessons available yet.</div>
                    ) : (
                        sections.map((section) => (
                            <div key={section.id} className="border-b border-gray-100 last:border-0">
                                <div className="bg-gray-50 px-4 py-3 border-y border-gray-100 first:border-t-0 font-medium text-sm text-gray-800">
                                    {section.title}
                                </div>
                                <div className="flex flex-col">
                                    {section.videos.map((video) => {
                                        const isActive = activeVideo?.id === video.id;
                                        return (
                                            <button
                                                key={video.id}
                                                onClick={() => setActiveVideo(video)}
                                                className={`text-left px-4 py-3 text-sm transition-colors duration-150 flex items-start gap-3
                                                    ${isActive
                                                        ? 'bg-indigo-50 border-l-4 border-indigo-600 text-indigo-900 font-medium'
                                                        : 'hover:bg-gray-50 text-gray-600 border-l-4 border-transparent'
                                                    }`}
                                            >
                                                <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border 
                                                    ${isActive ? 'bg-indigo-600 border-indigo-600' : 'border-gray-300 bg-white'}`}>
                                                    {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                                </div>
                                                <span className="leading-tight">{video.title}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Video Player Main Area */}
            <div className="flex-1 flex flex-col items-center bg-gray-900 border-l border-gray-800 shadow-inner overflow-y-auto">
                {videoId ? (
                    <div className="w-full max-w-5xl p-0 md:p-6 lg:p-8 flex-1 flex flex-col">
                        <div className="bg-black w-full rounded-none md:rounded-xl overflow-hidden shadow-2xl relative" style={{ paddingTop: '56.25%' }}>
                            <YouTube
                                videoId={videoId as string}
                                className="absolute top-0 left-0 w-full h-full"
                                opts={{
                                    width: '100%',
                                    height: '100%',
                                    playerVars: {
                                        autoplay: 1,
                                        modestbranding: 1,
                                        rel: 0
                                    }
                                }}
                            />
                        </div>
                        <div className="mt-4 md:mt-6 p-4 md:p-0">
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{activeVideo?.title}</h1>
                            <p className="text-gray-400 text-sm">Select videos from the sidebar to continue learning.</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 w-full flex items-center justify-center p-8">
                        <div className="text-center bg-gray-800 rounded-2xl p-10 max-w-md shadow-lg border border-gray-700">
                            <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                            <h3 className="text-xl font-medium text-white mb-2">No Video Selected</h3>
                            <p className="text-gray-400">Please select a lesson from the sidebar to start watching.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
