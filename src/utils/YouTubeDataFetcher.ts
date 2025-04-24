import axios from 'axios';

export type YouTubeVideo = {
  id: string;
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
  };
  statistics: {
    viewCount: string;
    likeCount: string;
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

  private buildSearchQuery(title: string): string {
    // Extract keywords from title
    const keywords = title
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3); // Filter out short words

    return keywords.join(' ');
  }

  private calculateViewToLikeRatio(video: YouTubeVideo): number {
    const views = parseInt(video.statistics.viewCount);
    const likes = parseInt(video.statistics.likeCount);
    return likes > 0 ? views / likes : 0;
  }

  private isWithinLast90Days(publishedAt: string): boolean {
    const videoDate = new Date(publishedAt);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
    return videoDate >= ninetyDaysAgo;
  }

  async fetchRelatedVideos(userTitle: string): Promise<ProcessedData> {
    try {
      const searchQuery = this.buildSearchQuery(userTitle);
      
      // First, search for videos
      const searchResponse = await axios.get(`${this.baseUrl}/search`, {
        params: {
          part: 'snippet',
          q: searchQuery,
          type: 'video',
          maxResults: 50, // Get more results to filter
          order: 'date',
          relevanceLanguage: 'en',
          publishedAfter: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          key: this.apiKey
        }
      });

      const videoIds = searchResponse.data.items.map((item: any) => item.id.videoId);

      // Get detailed video information including statistics
      const videosResponse = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          part: 'snippet,statistics',
          id: videoIds.join(','),
          key: this.apiKey
        }
      });

      // Filter and sort videos
      const videos: YouTubeVideo[] = videosResponse.data.items
        .filter((video: YouTubeVideo) => {
          const views = parseInt(video.statistics.viewCount);
          return (
            this.isWithinLast90Days(video.snippet.publishedAt) &&
            views >= 5000
          );
        })
        .sort((a: YouTubeVideo, b: YouTubeVideo) => {
          const ratioA = this.calculateViewToLikeRatio(a);
          const ratioB = this.calculateViewToLikeRatio(b);
          return ratioA - ratioB;
        })
        .slice(0, 50); // Take top 50 after filtering

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