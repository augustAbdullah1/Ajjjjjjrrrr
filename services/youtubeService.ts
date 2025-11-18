
import type { SurahSummary } from '../types';

export interface YouTubeSearchResult {
    type: string;
    title: string;
    videoId: string;
    author: string;
    lengthSeconds: number;
    videoThumbnails: { quality: string; url: string }[];
}

const INVIDIOUS_INSTANCE = 'https://invidious.io.lol'; 
const COBALT_INSTANCE = 'https://co.wuk.sh';

/**
 * Searches YouTube for videos using an Invidious instance.
 * @param query The search query.
 * @returns A promise that resolves to an array of search results.
 */
export const searchYouTube = async (query: string): Promise<YouTubeSearchResult[]> => {
    try {
        const response = await fetch(`${INVIDIOUS_INSTANCE}/api/v1/search?q=${encodeURIComponent(query)}&type=video`);
        if (!response.ok) {
            throw new Error(`Invidious API error: ${response.statusText}`);
        }
        const data: YouTubeSearchResult[] = await response.json();
        return data.filter(item => item.type === 'video');
    } catch (error) {
        console.error('Error searching YouTube via Invidious:', error);
        return [];
    }
};

/**
 * Gets a direct audio stream URL for a YouTube video using the Cobalt API.
 * @param videoId The ID of the YouTube video.
 * @returns A promise that resolves to the audio stream URL.
 */
export const getYouTubeAudioStreamUrl = async (videoId: string): Promise<string | null> => {
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    try {
        const response = await fetch(`${COBALT_INSTANCE}/api/json`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                url: youtubeUrl,
                isAudioOnly: true
            })
        });

        if (!response.ok) {
            throw new Error(`Cobalt API error: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.status === 'stream') {
            return data.url;
        } else if (data.status === 'error') {
            throw new Error(`Cobalt error: ${data.text}`);
        } else {
             console.warn("Cobalt returned unexpected status:", data.status, data);
             return null;
        }
    } catch (error) {
        console.error('Error getting YouTube audio stream via Cobalt:', error);
        return null;
    }
};

/**
 * Downloads the audio for a given YouTube video ID.
 * @param videoId The ID of the YouTube video.
 * @returns A promise that resolves to an audio Blob.
 */
export const downloadYouTubeAudio = async (videoId: string): Promise<Blob> => {
    const streamUrl = await getYouTubeAudioStreamUrl(videoId);
    if (!streamUrl) {
        throw new Error('Could not retrieve audio stream URL.');
    }

    const response = await fetch(streamUrl);
    if (!response.ok) {
        throw new Error(`Failed to download audio file: ${response.statusText}`);
    }
    const audioBlob = await response.blob();
    return audioBlob;
};