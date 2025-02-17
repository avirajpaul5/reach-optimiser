import { useState } from 'react';
import { YouTubeDataFetcher, ProcessedData } from '../utils/YouTubeDataFetcher';

type UseYouTubeDataReturn = {
  fetchData: (title: string, description: string) => Promise<ProcessedData>;
  isLoading: boolean;
  error: Error | null;
};

export const useYouTubeData = (apiKey: string): UseYouTubeDataReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetcher = new YouTubeDataFetcher(apiKey);

  const fetchData = async (title: string, description: string): Promise<ProcessedData> => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetcher.fetchRelatedVideos(title, description);
      return data;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchData,
    isLoading,
    error
  };
};