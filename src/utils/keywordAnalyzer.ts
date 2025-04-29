// Remove natural import and replace with custom implementation
const STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "he",
  "in",
  "is",
  "it",
  "its",
  "of",
  "on",
  "that",
  "the",
  "to",
  "was",
  "were",
  "will",
  "with",
  "https",
  "http",
  "www",
  "com",
  "youtube",
  "watch",
  "v=",
  "channel",
  "subscribe",
  "like",
  "share",
  "comment",
  "follow",
  "social",
  "media",
  "link",
  "links",
  "click",
  "here",
  "below",
  "above",
  "description",
  "video",
  "videos",
  "shorts",
  "short",
  "reels",
  "reel",
]);

const tokenize = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 0 && !STOPWORDS.has(word));
};

const calculateTFIDFScore = (text: string, corpus: string[]): number => {
  // Tokenize all documents
  const documents = corpus.map((doc) => tokenize(doc));
  const queryTokens = tokenize(text);

  // Calculate IDF for each term in the query
  const idfScores: Record<string, number> = {};
  queryTokens.forEach((token) => {
    const docCount = documents.filter((doc) => doc.includes(token)).length;
    idfScores[token] = Math.log(corpus.length / (1 + docCount));
  });

  // Calculate TF for the query
  const tfScores: Record<string, number> = {};
  queryTokens.forEach((token) => {
    tfScores[token] = (tfScores[token] || 0) + 1;
  });

  // Calculate final TF-IDF score
  let score = 0;
  queryTokens.forEach((token) => {
    score += (tfScores[token] / queryTokens.length) * idfScores[token];
  });

  return score;
};

// Types for better code safety and documentation
export interface UserInput {
  title: string;
  description: string;
}

export interface SampleData {
  titles: string;
  descriptions: string;
}

export interface TitleFactors {
  keywordRelevance: number;
  keywordPlacement: number;
  lengthScore: number;
  score: number;
}

export interface DescriptionFactors {
  keywordRelevance: number;
  keywordCoverage: number;
  keywordPlacement: number;
  lengthScore: number;
  ctaScore: number;
  socialMediaScore: number;
  hashtagScore: number;
  score: number;
}

export interface Recommendation {
  priority: "high" | "medium" | "low";
  message: string;
}

export interface AnalysisResult {
  scores: {
    title: number;
    description: number;
    overall: number;
  };
  factors: {
    title: TitleFactors;
    description: DescriptionFactors;
  };
  recommendations: {
    title: Recommendation[];
    description: Recommendation[];
  };
  topKeywords: {
    title: string[];
    description: string[];
  };
  topHashtags: string[];
}

// Enhanced stopwords list with more common words
const CTA_PATTERNS = [
  /subscribe/i,
  /follow.*on/i,
  /check.*out/i,
  /visit.*website/i,
  /like.*share/i,
  /comment.*below/i,
  /click.*link/i,
  /join.*community/i,
  /sign.*up/i,
  /learn.*more/i,
  /watch.*next/i,
  /don't forget to/i,
];

/**
 * Calculate enhanced keyword placement score
 */
const calculateEnhancedPlacementScore = (
  text: string,
  importantWords: string[],
  isTitle: boolean,
): number => {
  const words = text.toLowerCase().split(" ");
  const checkLength = isTitle ? 3 : 150;
  const checkText = isTitle
    ? words.slice(0, 3)
    : text.slice(0, 150).toLowerCase().split(" ");

  // Calculate basic placement score (70%)
  const importantWordsInCheck = checkText.filter((word) =>
    importantWords.some((keyword) => word.includes(keyword.toLowerCase())),
  ).length;
  const basicScore = Math.min(
    100,
    (importantWordsInCheck / Math.min(importantWords.length, checkLength)) *
      100,
  );

  // Calculate semantic similarity score (30%)
  const semanticScore = Math.min(
    100,
    calculateSemanticSimilarity(checkText.join(" "), importantWords.join(" ")),
  );

  return Math.min(100, Math.max(0, 0.7 * basicScore + 0.3 * semanticScore));
};

/**
 * Calculate semantic similarity between two texts
 */
const calculateSemanticSimilarity = (text1: string, text2: string): number => {
  // Simple cosine similarity implementation
  const words1 = new Set(text1.toLowerCase().split(" "));
  const words2 = new Set(text2.toLowerCase().split(" "));

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return (intersection.size / union.size) * 100;
};

/**
 * Removes stopwords from text
 */
const removeStopwords = (text: string): string => {
  return text
    .split(" ")
    .filter((word) => !STOPWORDS.has(word.toLowerCase()))
    .join(" ");
};

/**
 * Preprocesses text by removing stopwords, converting to lowercase,
 * and cleaning special characters (except hashtags)
 */
const preprocessText = (text: string = ""): string => {
  // Remove URLs
  text = text.replace(/https?:\/\/\S+/g, "");
  // Remove common URL patterns
  text = text.replace(/\b(?:www\.|http|https|\.com|\.org|\.net)\b/g, "");
  // Remove special characters except hashtags and basic punctuation
  text = text.replace(/[^\w\s#.,!?]/g, "");
  // Convert to lowercase
  text = text.toLowerCase();
  // Remove extra whitespace
  text = text.replace(/\s+/g, " ").trim();
  return text;
};

/**
 * Calculates word frequency in a given text
 */
const getWordFrequency = (text: string): Record<string, number> => {
  const words = preprocessText(text)
    .split(" ")
    .filter((word) => word.length > 0);
  const frequency: Record<string, number> = {};

  words.forEach((word) => {
    frequency[word] = (frequency[word] || 0) + 1;
  });

  return frequency;
};

/**
 * Extracts top keywords from a list of texts
 */
const extractTopKeywords = (texts: string[], count: number = 10): string[] => {
  const allText = texts.join(" ");
  const wordFreq = getWordFrequency(allText);

  return Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([word]) => word);
};

/**
 * Checks for CTAs in description
 */
const containsCTA = (text: string): boolean => {
  return CTA_PATTERNS.some((pattern) => pattern.test(text));
};

/**
 * Counts hashtags in text
 */
const countHashtags = (text: string): number => {
  return (text.match(/#\w+/g) || []).length;
};

/**
 * Checks for social media links in text
 */
const containsSocialMediaLinks = (text: string): boolean => {
  const socialMediaPatterns = [
    /instagram\.com/i,
    /facebook\.com/i,
    /linkedin\.com/i,
    /twitter\.com/i,
    /youtube\.com/i,
    /tiktok\.com/i,
    /pinterest\.com/i,
  ];
  return socialMediaPatterns.some((pattern) => pattern.test(text));
};

/**
 * Calculate title factors with enhanced scoring
 */
const calculateTitleFactors = (
  userTitle: string,
  topTitles: string[],
): TitleFactors => {
  // Keyword Relevance Score (33.33%)
  const topKeywords = findTopKeywords(topTitles, 5);
  const titleWords = new Set(userTitle.toLowerCase().split(" "));
  const matchingKeywords = topKeywords.filter((keyword) =>
    titleWords.has(keyword.toLowerCase()),
  );
  const keywordRelevance = (matchingKeywords.length / 5) * 100;

  // Enhanced Keyword Placement (33.33%)
  const keywordPlacement = calculateEnhancedPlacementScore(
    userTitle,
    topKeywords,
    true,
  );

  // Length Score (33.33%)
  const titleLength = userTitle.length;
  let lengthScore;
  if (titleLength < 30) {
    lengthScore = (titleLength / 30) * 100;
  } else if (titleLength > 60) {
    lengthScore = Math.max(0, 100 - (titleLength - 60) * 2);
  } else if (titleLength >= 45 && titleLength <= 60) {
    lengthScore = 100;
  } else {
    lengthScore = 80 + ((titleLength - 30) / 15) * 20;
  }

  // Calculate final title score (equal weights for all three factors)
  const score = (keywordRelevance + keywordPlacement + lengthScore) / 3;

  return {
    keywordRelevance,
    keywordPlacement,
    lengthScore,
    score,
  };
};

/**
 * Calculate description factors with enhanced scoring
 */
const calculateDescriptionFactors = (
  userDesc: string,
  topDescs: string[],
): DescriptionFactors => {
  // Keyword Coverage Score (25%)
  const topKeywords = findTopKeywords(topDescs, 10); // Changed from 5 to 10
  const descWords = new Set(userDesc.toLowerCase().split(" "));
  const matchingKeywords = topKeywords.filter((keyword) =>
    descWords.has(keyword.toLowerCase()),
  );
  const keywordCoverage = (matchingKeywords.length / 10) * 100;

  // Enhanced Keyword Placement (20%)
  const keywordPlacement = calculateEnhancedPlacementScore(
    userDesc,
    topKeywords,
    false,
  );

  // Length Score (20%)
  const wordCount = userDesc.split(" ").length;
  let lengthScore;
  if (wordCount < 100) {
    lengthScore = (wordCount / 100) * 100;
  } else if (wordCount > 200) {
    lengthScore = Math.max(0, 100 - (wordCount - 200) * 0.5);
  } else {
    lengthScore = 100;
  }

  // CTA Score (10%)
  const ctaScore = containsCTA(userDesc) ? 100 : 0;

  // Social Media Score (10%)
  const socialMediaScore = containsSocialMediaLinks(userDesc) ? 100 : 0;

  // Hashtag Score (15%)
  const hashtagCount = countHashtags(userDesc);
  const hashtagScore = Math.min(100, hashtagCount * 20);

  // Calculate final description score with specified weights
  const score =
    keywordCoverage * 0.25 +
    keywordPlacement * 0.2 +
    lengthScore * 0.2 +
    ctaScore * 0.1 +
    socialMediaScore * 0.1 +
    hashtagScore * 0.15;

  return {
    keywordRelevance: keywordCoverage,
    keywordCoverage,
    keywordPlacement,
    lengthScore,
    ctaScore,
    socialMediaScore,
    hashtagScore,
    score: Math.min(100, Math.max(0, score)),
  };
};

/**
 * Extracts keywords from text, excluding stopwords and common words
 */
const extractKeywords = (text: string): string[] => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOPWORDS.has(word));
};

/**
 * Finds missing keywords that are present in successful videos but not in user's input
 */
const findMissingKeywords = (
  userInput: string,
  successfulVideos: string[],
  minFrequency: number = 2,
): string[] => {
  const userKeywords = new Set(extractKeywords(userInput));
  const videoKeywords = new Map<string, number>();

  // Count keyword frequency in successful videos
  successfulVideos.forEach((video) => {
    extractKeywords(video).forEach((keyword) => {
      if (!userKeywords.has(keyword)) {
        videoKeywords.set(keyword, (videoKeywords.get(keyword) || 0) + 1);
      }
    });
  });

  // Return keywords that appear frequently in successful videos but not in user's input
  return Array.from(videoKeywords.entries())
    .filter(([_, count]) => count >= minFrequency)
    .sort((a, b) => b[1] - a[1])
    .map(([keyword]) => keyword);
};

/**
 * Finds the top N most occurring keywords in a list of texts
 */
const findTopKeywords = (texts: string[], count: number): string[] => {
  const keywordFrequency = new Map<string, number>();

  texts.forEach((text) => {
    extractKeywords(text).forEach((keyword) => {
      keywordFrequency.set(keyword, (keywordFrequency.get(keyword) || 0) + 1);
    });
  });

  return Array.from(keywordFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([keyword]) => keyword);
};

/**
 * Calculates keyword presence score based on top keywords
 */
const calculateKeywordPresenceScore = (
  text: string,
  topKeywords: string[],
): { score: number; missingKeywords: string[] } => {
  const textKeywords = new Set(extractKeywords(text));
  const missingKeywords = topKeywords.filter(
    (keyword) => !textKeywords.has(keyword),
  );

  const presentCount = topKeywords.length - missingKeywords.length;
  const score = (presentCount / topKeywords.length) * 100;

  return { score, missingKeywords };
};

/**
 * Generates dynamic recommendations based on missing top keywords
 */
const generateRecommendations = (
  titleFactors: TitleFactors,
  descFactors: DescriptionFactors,
  userInput: UserInput,
  successfulVideos: string[],
): { title: Recommendation[]; description: Recommendation[] } => {
  const recommendations = {
    title: [] as Recommendation[],
    description: [] as Recommendation[],
  };

  // Find top keywords for title and description
  const topTitleKeywords = findTopKeywords(
    successfulVideos.filter((_, i) => i < successfulVideos.length / 2), // Use first half for titles
    5,
  );
  const topDescKeywords = findTopKeywords(
    successfulVideos.filter((_, i) => i >= successfulVideos.length / 2), // Use second half for descriptions
    5,
  );

  // Calculate missing keywords
  const titleKeywordScore = calculateKeywordPresenceScore(
    userInput.title,
    topTitleKeywords,
  );
  const descKeywordScore = calculateKeywordPresenceScore(
    userInput.description,
    topDescKeywords,
  );

  // Title recommendations (excluding keyword recommendations)
  if (titleFactors.keywordPlacement < 70) {
    recommendations.title.push({
      priority: "medium",
      message:
        "Place important keywords within the first 3 words of your title",
    });
  }

  if (titleFactors.lengthScore < 70) {
    recommendations.title.push({
      priority: "high",
      message: "Adjust title length to 50-60 characters for optimal visibility",
    });
  }

  // Description recommendations (excluding keyword recommendations)
  if (descFactors.keywordPlacement < 70) {
    recommendations.description.push({
      priority: "medium",
      message:
        "Include key terms in the first 150 characters (visible in search previews)",
    });
  }

  if (descFactors.ctaScore < 100) {
    recommendations.description.push({
      priority: "high",
      message:
        'Add a clear call-to-action (e.g., "Subscribe for more", "Check out related videos")',
    });
  }

  if (descFactors.hashtagScore < 70) {
    recommendations.description.push({
      priority: "medium",
      message: "Use 3-5 relevant hashtags to improve discoverability",
    });
  }

  if (descFactors.lengthScore < 70) {
    recommendations.description.push({
      priority: "high",
      message:
        "Aim for 100-200 words in your description for better engagement",
    });
  }

  return recommendations;
};

/**
 * Extracts hashtags from text
 */
const extractHashtags = (text: string): string[] => {
  const hashtagRegex = /#\w+/g;
  return (text.match(hashtagRegex) || []).map((tag) => tag.toLowerCase());
};

/**
 * Finds the top N most occurring hashtags
 */
const findTopHashtags = (texts: string[], count: number): string[] => {
  const hashtagFrequency = new Map<string, number>();

  texts.forEach((text) => {
    extractHashtags(text).forEach((hashtag) => {
      hashtagFrequency.set(hashtag, (hashtagFrequency.get(hashtag) || 0) + 1);
    });
  });

  return Array.from(hashtagFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([hashtag]) => hashtag);
};

/**
 * Calculate hashtag score based on top hashtags
 */
const calculateHashtagScore = (text: string, topHashtags: string[]): number => {
  const textHashtags = extractHashtags(text);
  // Each hashtag gives 20%, max 100% for 5 or more hashtags
  return Math.min(100, textHashtags.length * 20);
};

/**
 * Main analysis function
 */
export const analyzeMetadata = (
  userInput: UserInput,
  sampleData: SampleData,
): AnalysisResult => {
  // Safety checks for null or undefined data
  if (!sampleData) {
    console.error("Sample data is null or undefined");
    sampleData = {
      titles: "Sample Video Title 1;Sample Video Title 2;Sample Video Title 3",
      descriptions:
        "Sample description 1. Sample description 2. Sample description 3.",
    };
  }

  if (!sampleData.titles || !sampleData.descriptions) {
    console.error("Sample data missing titles or descriptions");
    sampleData = {
      titles:
        sampleData.titles ||
        "Sample Video Title 1;Sample Video Title 2;Sample Video Title 3",
      descriptions:
        sampleData.descriptions ||
        "Sample description 1. Sample description 2. Sample description 3.",
    };
  }

  // Parse sample data
  const titles = sampleData.titles.split(";").filter(Boolean);
  const descriptions = sampleData.descriptions.split(".").filter(Boolean);

  // Add additional safety check for empty arrays
  if (titles.length === 0 || descriptions.length === 0) {
    console.error("Parsed titles or descriptions arrays are empty");
    const fallbackTitles = [
      "Sample Video Title 1",
      "Sample Video Title 2",
      "Sample Video Title 3",
    ];
    const fallbackDescriptions = [
      "Sample description 1",
      "Sample description 2",
      "Sample description 3",
    ];

    if (titles.length === 0) titles.push(...fallbackTitles);
    if (descriptions.length === 0) descriptions.push(...fallbackDescriptions);
  }

  const allVideos = [...titles, ...descriptions];

  // Find top keywords and hashtags
  const topTitleKeywords = findTopKeywords(titles, 5);
  const topDescKeywords = findTopKeywords(descriptions, 10); // Changed from 5 to 10
  const topHashtags = findTopHashtags(descriptions, 5);

  // Calculate factors
  const titleFactors = calculateTitleFactors(userInput.title, titles);
  const descFactors = calculateDescriptionFactors(
    userInput.description,
    descriptions,
  );

  // Calculate overall score with specified weights (40% title, 60% description)
  const overallScore = Math.min(
    100,
    Math.max(0, titleFactors.score * 0.4 + descFactors.score * 0.6),
  );

  // Generate recommendations
  const recommendations = generateRecommendations(
    titleFactors,
    descFactors,
    userInput,
    allVideos,
  );

  return {
    scores: {
      title: Math.min(
        100,
        Math.max(0, Math.round(titleFactors.score * 10) / 10),
      ),
      description: Math.min(
        100,
        Math.max(0, Math.round(descFactors.score * 10) / 10),
      ),
      overall: Math.min(100, Math.max(0, Math.round(overallScore * 10) / 10)),
    },
    factors: {
      title: titleFactors,
      description: descFactors,
    },
    recommendations,
    topKeywords: {
      title: topTitleKeywords,
      description: topDescKeywords,
    },
    topHashtags,
  };
};
