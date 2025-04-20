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
  uniquenessScore: number;
  score: number;
}

export interface DescriptionFactors {
  keywordCoverage: number;
  keywordPlacement: number;
  lengthScore: number;
  ctaScore: number;
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
  topKeywords: string[];
}

// Enhanced stopwords list with more common words
const STOPWORDS = new Set([
  "and",
  "the",
  "is",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "with",
  "a",
  "an",
  "but",
  "or",
  "as",
  "be",
  "this",
  "that",
  "by",
  "from",
  "has",
  "it",
  "its",
  "are",
  "was",
  "were",
  "will",
  "would",
  "could",
  "should",
  "have",
  "had",
  "what",
  "when",
  "where",
  "who",
  "which",
  "why",
  "how",
  "do",
  "does",
  "did",
  "my",
  "your",
  "our",
  "their",
  "we",
  "you",
  "they",
  "he",
  "she",
  "him",
  "her",
  "them",
  "me",
  "there",
  "here",
  "some",
  "any",
  "one",
  "two",
  "three",
  "many",
  "much",
  "can",
]);

// Enhanced CTA patterns
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
  return removeStopwords(text)
    .toLowerCase()
    .replace(/[^\w\s#]/g, "") // Allow hashtags
    .replace(/\s+/g, " ")
    .trim();
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
 * Calculates cosine similarity between two texts
 */
const calculateCosineSimilarity = (text1: string, text2: string): number => {
  const words1 = preprocessText(text1).split(" ");
  const words2 = preprocessText(text2).split(" ");

  const vocabulary = new Set([...words1, ...words2]);
  const vector1 = Array.from(vocabulary).map(
    (word) => words1.filter((w) => w === word).length
  );
  const vector2 = Array.from(vocabulary).map(
    (word) => words2.filter((w) => w === word).length
  );

  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
  const magnitude1 = Math.sqrt(
    vector1.reduce((sum, val) => sum + val * val, 0)
  );
  const magnitude2 = Math.sqrt(
    vector2.reduce((sum, val) => sum + val * val, 0)
  );

  // Prevent division by zero
  if (magnitude1 === 0 || magnitude2 === 0) return 0;

  return dotProduct / (magnitude1 * magnitude2);
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
 * Calculate title factors
 */
const calculateTitleFactors = (
  userTitle: string,
  topTitles: string[]
): TitleFactors => {
  const topKeywords = extractTopKeywords(topTitles);
  const userTitleWords = preprocessText(userTitle).split(" ");

  // Keyword Relevance (25%)
  const keywordsFound = userTitleWords.filter((word) =>
    topKeywords.includes(word)
  ).length;
  const keywordRelevance = Math.min(
    100,
    (keywordsFound / Math.min(5, topKeywords.length)) * 100
  );

  // Keyword Placement (25%)
  const firstThreeWords = userTitleWords.slice(0, 3);
  const importantWordsAtStart = firstThreeWords.filter((word) =>
    topKeywords.includes(word)
  ).length;
  const totalImportantWords = userTitleWords.filter((word) =>
    topKeywords.includes(word)
  ).length;
  const keywordPlacement =
    totalImportantWords > 0
      ? (importantWordsAtStart / Math.min(totalImportantWords, 3)) * 100
      : 0;

  // Length Score (25%)
  const titleLength = userTitle.length;
  let lengthScore;
  if (titleLength >= 50 && titleLength <= 60) lengthScore = 100;
  else if (titleLength >= 40 && titleLength < 50) lengthScore = 90;
  else if (titleLength > 60 && titleLength <= 70) lengthScore = 80;
  else if (titleLength >= 30 && titleLength < 40) lengthScore = 70;
  else if (titleLength > 70 && titleLength <= 80) lengthScore = 60;
  else lengthScore = 40;

  // Uniqueness Score (25%)
  const similarities = topTitles.map((title) =>
    calculateCosineSimilarity(userTitle, title)
  );
  const avgSimilarity =
    similarities.length > 0
      ? similarities.reduce((a, b) => a + b, 0) / similarities.length
      : 0;
  const uniquenessScore = (1 - avgSimilarity) * 100;

  // Calculate weighted average
  const score =
    (keywordRelevance + keywordPlacement + lengthScore + uniquenessScore) / 4;

  return {
    keywordRelevance,
    keywordPlacement,
    lengthScore,
    uniquenessScore,
    score,
  };
};

/**
 * Calculate description factors
 */
const calculateDescriptionFactors = (
  userDesc: string,
  topDescs: string[]
): DescriptionFactors => {
  const topKeywords = extractTopKeywords(topDescs);
  const userDescWords = preprocessText(userDesc).split(" ");

  // Keyword Coverage (20%)
  const keywordsFound = userDescWords.filter((word) =>
    topKeywords.includes(word)
  ).length;
  const keywordCoverage = Math.min(
    100,
    (keywordsFound / Math.min(10, topKeywords.length)) * 100
  );

  // Keyword Placement (20%)
  const first150Chars = userDesc.slice(0, 150);
  const importantWordsInFirst150 = preprocessText(first150Chars)
    .split(" ")
    .filter((word) => topKeywords.includes(word)).length;
  const totalImportantWords = userDescWords.filter((word) =>
    topKeywords.includes(word)
  ).length;
  const keywordPlacement =
    totalImportantWords > 0
      ? (importantWordsInFirst150 / Math.min(5, totalImportantWords)) * 100
      : 0;

  // Length Score (20%)
  const wordCount = userDescWords.length;
  let lengthScore;
  if (wordCount >= 100 && wordCount <= 200) lengthScore = 100;
  else if (wordCount >= 80 && wordCount < 100) lengthScore = 90;
  else if (wordCount > 200 && wordCount <= 250) lengthScore = 80;
  else if (wordCount >= 50 && wordCount < 80) lengthScore = 70;
  else if (wordCount > 250 && wordCount <= 300) lengthScore = 60;
  else lengthScore = 40;

  // CTA Score (20%)
  const ctaScore = containsCTA(userDesc) ? 100 : 0;

  // Hashtag Usage Score (20%)
  const hashtagCount = countHashtags(userDesc);
  let hashtagScore;
  if (hashtagCount >= 3 && hashtagCount <= 5) hashtagScore = 100;
  else if (hashtagCount === 2 || hashtagCount === 6) hashtagScore = 80;
  else if (hashtagCount === 1 || (hashtagCount >= 7 && hashtagCount <= 8))
    hashtagScore = 60;
  else if (hashtagCount >= 9) hashtagScore = 40;
  else hashtagScore = 20;

  // Calculate weighted average
  const score =
    (keywordCoverage +
      keywordPlacement +
      lengthScore +
      ctaScore +
      hashtagScore) /
    5;

  return {
    keywordCoverage,
    keywordPlacement,
    lengthScore,
    ctaScore,
    hashtagScore,
    score,
  };
};

/**
 * Generate recommendations based on scores
 */
const generateRecommendations = (
  titleFactors: TitleFactors,
  descFactors: DescriptionFactors,
  topKeywords: string[]
): { title: Recommendation[]; description: Recommendation[] } => {
  const recommendations = {
    title: [] as Recommendation[],
    description: [] as Recommendation[],
  };

  // Title recommendations
  if (titleFactors.keywordRelevance < 70) {
    recommendations.title.push({
      priority: "high",
      message: `Include these popular keywords: ${topKeywords
        .slice(0, 3)
        .join(", ")}`,
    });
  }

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
      message:
        "Adjust title length to 50-60 characters for optimal visibility in search results",
    });
  }

  if (titleFactors.uniquenessScore < 70) {
    recommendations.title.push({
      priority: "medium",
      message:
        "Make your title more distinctive to stand out from similar videos",
    });
  }

  // Description recommendations
  if (descFactors.keywordCoverage < 70) {
    recommendations.description.push({
      priority: "high",
      message: `Incorporate these trending keywords: ${topKeywords
        .slice(0, 3)
        .join(", ")}`,
    });
  }

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
        "Aim for 100-200 words in your description for better engagement and SEO",
    });
  }

  return recommendations;
};

/**
 * Main analysis function
 */
export const analyzeMetadata = (
  userInput: UserInput,
  sampleData: SampleData
): AnalysisResult => {
  // Parse sample data, handling potential formatting issues
  const titles = sampleData.titles
    .split(";")
    .map((t) => t.trim())
    .filter(Boolean);
  const descriptions = sampleData.descriptions
    .split(".")
    .map((d) => d.trim())
    .filter(Boolean);

  // Get top keywords for recommendations
  const topKeywords = extractTopKeywords([...titles, ...descriptions]);

  // Calculate factors
  const titleFactors = calculateTitleFactors(userInput.title, titles);
  const descFactors = calculateDescriptionFactors(
    userInput.description,
    descriptions
  );

  // Generate recommendations
  const recommendations = generateRecommendations(
    titleFactors,
    descFactors,
    topKeywords
  );

  // Calculate overall score (weighted: title 40%, description 60%)
  const overallScore = titleFactors.score * 0.4 + descFactors.score * 0.6;

  return {
    scores: {
      title: Math.round(titleFactors.score * 10) / 10, // Round to 1 decimal place
      description: Math.round(descFactors.score * 10) / 10,
      overall: Math.round(overallScore * 10) / 10,
    },
    factors: {
      title: titleFactors,
      description: descFactors,
    },
    recommendations,
    topKeywords,
  };
};
