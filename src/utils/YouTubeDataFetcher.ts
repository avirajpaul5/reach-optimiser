import axios from 'axios';

export type YouTubeVideo = {
  id: string;
  snippet: {
    title: string;
    description: string;
  };
};

export type ProcessedData = {
  titles: string;
  descriptions: string;
};

export class YouTubeDataFetcher {
  private apiKey: string;
  private baseUrl = 'https://www.googleapis.com/youtube/v3';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private buildSearchQuery(title: string, description: string): string {
    const searchTerms = [
      ...new Set([
        ...title.split(' '),
        ...description.split(' ').slice(0, 5)
      ])
    ].join(' ');

    return searchTerms.trim();
  }

  async fetchRelatedVideos(userTitle: string, userDescription: string): Promise<ProcessedData> {
    try {
      const searchQuery = this.buildSearchQuery(userTitle, userDescription);
      
      const searchResponse = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          q: searchQuery,
          type: 'video',
          maxResults: 10,
          order: 'date',
          relevanceLanguage: 'en',
          key: this.apiKey
        }
      });

      const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId);

      const videosResponse = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet',
          id: videoIds.join(','),
          key: this.apiKey
        }
      });

      const videos: YouTubeVideo[] = videosResponse.data.items;

      const processedData: ProcessedData = {
        titles: videos.map(video => video.snippet.title).join(';'),
        descriptions: videos.map(video => video.snippet.description).join('. ')
      };

      return processedData;

    } catch (error) {
      console.error('Error fetching YouTube data:', error);
      throw error;
    }
  }
}