import { useState } from "react";
import { YouTubeDataFetcher, ProcessedData } from "../utils/YouTubeDataFetcher";
import { useApiKeys } from "../App";

type UseYouTubeDataReturn = {
  fetchData: (title: string) => Promise<ProcessedData>;
  isLoading: boolean;
  error: Error | null;
};

export const useYouTubeData = (): UseYouTubeDataReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { youtubeApiKey } = useApiKeys();

  const fetcher = new YouTubeDataFetcher(youtubeApiKey);

  const fetchData = async (title: string): Promise<ProcessedData> => {
    setIsLoading(true);
    setError(null);

    try {
      // Only use the title for searching
      const searchQuery = title.trim();
      
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
          searchQuery
        )}&type=video&maxResults=50&key=${youtubeApiKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch YouTube data");
      }

      const data = await response.json();

      // Filter out Shorts and get video IDs
      const videoIds = data.items
        .filter((item: any) => {
          // Filter out videos with "shorts" in title or description
          const title = item.snippet.title.toLowerCase();
          const description = item.snippet.description.toLowerCase();
          return !title.includes("#shorts") && 
                 !description.includes("#shorts") &&
                 !title.includes("short") &&
                 !description.includes("short");
        })
        .map((item: any) => item.id.videoId);

      // Fetch video details to get duration
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(
          ","
        )}&key=${youtubeApiKey}`
      );

      if (!detailsResponse.ok) {
        throw new Error("Failed to fetch video details");
      }

      const detailsData = await detailsResponse.json();

      // Filter out Shorts based on duration (Shorts are typically less than 60 seconds)
      const validVideos = detailsData.items.filter((item: any) => {
        const duration = item.contentDetails.duration;
        // Convert duration to seconds
        const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
        const hours = (parseInt(match[1]) || 0) * 3600;
        const minutes = (parseInt(match[2]) || 0) * 60;
        const seconds = parseInt(match[3]) || 0;
        const totalSeconds = hours + minutes + seconds;
        return totalSeconds >= 60; // Only include videos longer than 60 seconds
      });

      const validVideoIds = validVideos.map((item: any) => item.id);

      // Filter original items to only include valid videos
      const filteredItems = data.items.filter((item: any) =>
        validVideoIds.includes(item.id.videoId)
      );

      // Return consistent data structure based only on title search
      return {
        titles: filteredItems
          .map((item: any) => item.snippet.title)
          .join(";"),
        descriptions: filteredItems
          .map((item: any) => item.snippet.description)
          .join("."),
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchData,
    isLoading,
    error,
  };
};
