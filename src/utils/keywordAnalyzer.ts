import { useState, useCallback } from 'react';

// Enhanced utility functions
const removeStopwords = (text) => {
  const stopwords = new Set(['and', 'the', 'is', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
    'a', 'an', 'but', 'or', 'as', 'be', 'this', 'that', 'by', 'from', 'has', 'it',
    'its', 'are', 'was', 'were', 'will', 'would', 'could', 'should', 'have', 'had',
    'what', 'when', 'where', 'who', 'which', 'why', 'how']);
  return text.split(' ').filter(word => !stopwords.has(word.toLowerCase())).join(' ');
};

const preprocessText = (text = '') => {
  return removeStopwords(text)
    .toLowerCase()
    .replace(/[^\w\s#]/g, '') // Allow hashtags
    .replace(/\s+/g, ' ')
    .trim();
};

// Calculate cosine similarity between two texts
const calculateCosineSimilarity = (text1, text2) => {
  const words1 = preprocessText(text1).split(' ');
  const words2 = preprocessText(text2).split(' ');
  
  const vocabulary = new Set([...words1, ...words2]);
  const vector1 = Array.from(vocabulary).map(word => words1.filter(w => w === word).length);
  const vector2 = Array.from(vocabulary).map(word => words2.filter(w => w === word).length);
  
  const dotProduct = vector1.reduce((sum, val, i) => sum + val * vector2[i], 0);
  const magnitude1 = Math.sqrt(vector1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vector2.reduce((sum, val) => sum + val * val, 0));
  
  return dotProduct / (magnitude1 * magnitude2) || 0;
};

// Check for CTAs in description
const containsCTA = (text) => {
  const ctaPatterns = [
    /subscribe/i,
    /follow.*on/i,
    /check.*out/i,
    /visit.*website/i,
    /like.*share/i,
    /comment.*below/i
  ];
  return ctaPatterns.some(pattern => pattern.test(text));
};

// Count hashtags in text
const countHashtags = (text) => {
  return (text.match(/#\w+/g) || []).length;
};

// Calculate title factors
const calculateTitleFactors = (userTitle, topTitles) => {
  // Keyword Relevance (25%)
  const allTopWords = preprocessText(topTitles.join(' ')).split(' ');
  const wordFrequency = {};
  allTopWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  const topKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
    
  const userTitleWords = preprocessText(userTitle).split(' ');
  const keywordRelevance = (userTitleWords.filter(word => 
    topKeywords.includes(word)).length / topKeywords.length) * 100;

  // Keyword Placement (25%)
  const importantWordsAtStart = userTitleWords
    .slice(0, 3)
    .filter(word => topKeywords.includes(word)).length;
  const totalImportantWords = userTitleWords
    .filter(word => topKeywords.includes(word)).length;
  const keywordPlacement = totalImportantWords ? 
    (importantWordsAtStart / totalImportantWords) * 100 : 0;

  // Length Score (25%)
  const titleLength = userTitle.length;
  let lengthScore;
  if (titleLength >= 50 && titleLength <= 60) lengthScore = 100;
  else if (titleLength >= 40 && titleLength <= 70) lengthScore = 70;
  else lengthScore = 40;

  // Uniqueness Score (25%)
  const similarities = topTitles.map(title => 
    calculateCosineSimilarity(userTitle, title));
  const avgSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
  const uniquenessScore = (1 - avgSimilarity) * 100;

  return {
    keywordRelevance,
    keywordPlacement,
    lengthScore,
    uniquenessScore,
    score: (keywordRelevance + keywordPlacement + lengthScore + uniquenessScore) / 4
  };
};

// Calculate description factors
const calculateDescriptionFactors = (userDesc, topDescs) => {
  // Keyword Coverage (20%)
  const allTopWords = preprocessText(topDescs.join(' ')).split(' ');
  const wordFrequency = {};
  allTopWords.forEach(word => {
    wordFrequency[word] = (wordFrequency[word] || 0) + 1;
  });
  
  const topKeywords = Object.entries(wordFrequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
    
  const userDescWords = preprocessText(userDesc).split(' ');
  const keywordCoverage = (userDescWords.filter(word => 
    topKeywords.includes(word)).length / topKeywords.length) * 100;

  // Keyword Placement (20%)
  const first150Chars = userDesc.slice(0, 150);
  const importantWordsInFirst150 = preprocessText(first150Chars)
    .split(' ')
    .filter(word => topKeywords.includes(word)).length;
  const totalImportantWords = userDescWords
    .filter(word => topKeywords.includes(word)).length;
  const keywordPlacement = totalImportantWords ? 
    (importantWordsInFirst150 / totalImportantWords) * 100 : 0;

  // Length Score (20%)
  const wordCount = userDescWords.length;
  let lengthScore;
  if (wordCount >= 100 && wordCount <= 200) lengthScore = 100;
  else if (wordCount >= 80 && wordCount <= 250) lengthScore = 70;
  else lengthScore = 40;

  // CTA Score (20%)
  const ctaScore = containsCTA(userDesc) ? 100 : 0;

  // Hashtag Usage Score (20%)
  const hashtagCount = countHashtags(userDesc);
  let hashtagScore;
  if (hashtagCount >= 2 && hashtagCount <= 5) hashtagScore = 100;
  else if (hashtagCount >= 6 && hashtagCount <= 10) hashtagScore = 50;
  else hashtagScore = 20;

  return {
    keywordCoverage,
    keywordPlacement,
    lengthScore,
    ctaScore,
    hashtagScore,
    score: (keywordCoverage + keywordPlacement + lengthScore + ctaScore + hashtagScore) / 5
  };
};

// Generate recommendations based on scores
const generateRecommendations = (titleFactors, descFactors, topKeywords) => {
  const recommendations = {
    title: [],
    description: []
  };

  // Title recommendations
  if (titleFactors.keywordRelevance < 70) {
    recommendations.title.push({
      priority: 'high',
      message: `Consider adding these popular keywords: ${topKeywords.slice(0, 3).join(', ')}`
    });
  }

  if (titleFactors.keywordPlacement < 70) {
    recommendations.title.push({
      priority: 'medium',
      message: 'Move important keywords closer to the beginning of your title'
    });
  }

  if (titleFactors.lengthScore < 70) {
    recommendations.title.push({
      priority: 'high',
      message: 'Adjust title length to 50-60 characters for optimal visibility'
    });
  }

  if (titleFactors.uniquenessScore < 70) {
    recommendations.title.push({
      priority: 'medium',
      message: 'Your title is too similar to existing videos, try making it more unique'
    });
  }

  // Description recommendations
  if (descFactors.keywordCoverage < 70) {
    recommendations.description.push({
      priority: 'high',
      message: `Include these trending keywords: ${topKeywords.slice(0, 3).join(', ')}`
    });
  }

  if (descFactors.ctaScore < 100) {
    recommendations.description.push({
      priority: 'high',
      message: 'Add a call-to-action (e.g., "Subscribe for more", "Check out my other videos")'
    });
  }

  if (descFactors.hashtagScore < 70) {
    recommendations.description.push({
      priority: 'medium',
      message: 'Use 2-5 relevant hashtags in your description'
    });
  }

  if (descFactors.lengthScore < 70) {
    recommendations.description.push({
      priority: 'high',
      message: 'Adjust description length to 100-200 words for optimal engagement'
    });
  }

  return recommendations;
};

// Main analysis function
export const analyzeMetadata = (userInput, sampleData) => {
  const titles = sampleData.titles.split(';');
  const descriptions = sampleData.descriptions.split('.');
  
  // Calculate title factors
  const titleFactors = calculateTitleFactors(userInput.title, titles);
  
  // Calculate description factors
  const descFactors = calculateDescriptionFactors(userInput.description, descriptions);
  
  // Get top keywords for recommendations
  const allWords = preprocessText(titles.join(' ')).split(' ');
  const wordFreq = {};
  allWords.forEach(word => {
    wordFreq[word] = (wordFreq[word] || 0) + 1;
  });
  
  const topKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([word]) => word);
  
  // Generate recommendations
  const recommendations = generateRecommendations(titleFactors, descFactors, topKeywords);
  
  return {
    scores: {
      title: titleFactors.score,
      description: descFactors.score,
      overall: (titleFactors.score + descFactors.score) / 2
    },
    factors: {
      title: titleFactors,
      description: descFactors
    },
    recommendations,
    topKeywords
  };
};