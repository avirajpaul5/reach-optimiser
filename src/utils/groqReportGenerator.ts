import axios from "axios";

// Define interfaces for analysis results, user input, report options, and generated report
export interface AnalysisResult {
  scores: {
    title: number;
    description: number;
    overall: number;
  };
  factors: {
    title: {
      keywordRelevance: number;
      keywordPlacement: number;
      lengthScore: number;
    };
    description: {
      keywordCoverage: number;
      keywordPlacement: number;
      lengthScore: number;
      ctaScore: number;
      hashtagScore: number;
    };
  };
  recommendations: {
    title: Array<{
      priority: string;
      message: string;
    }>;
    description: Array<{
      priority: string;
      message: string;
    }>;
  };
  topKeywords: {
    title: string[];
    description: string[];
  };
  topHashtags: string[];
}

export interface UserInput {
  title: string;
  description: string;
}

export interface ReportOptions {
  maxLength?: number;
}

export interface GeneratedReport {
  report: string;
  error?: string;
}

export interface SampleData {
  titles: string;
  descriptions: string;
}

// Main class for generating reports using the Groq API
export class GroqReportGenerator {
  private apiKey: string;
  private model = "llama3-70b-8192";
  private baseUrl = "https://api.groq.com/openai/v1/chat/completions";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  // Generate improvement report with two alternative title-description pairs
  async generateReport(
    analysis: AnalysisResult,
    userInput: UserInput,
    sampleData: SampleData,
    options: ReportOptions = {},
  ): Promise<GeneratedReport> {
    try {
      if (!this.apiKey) {
        throw new Error("Groq API key is not provided");
      }

      const prompt = this.buildPrompt(analysis, userInput, sampleData);

      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          messages: [
            {
              role: "system",
              content:
                "You are a YouTube SEO expert. Your task is to generate two alternative title and description pairs that take inspiration from successful videos while incorporating all the provided recommendations, keywords, and best practices. Each pair should be optimized for search and engagement while maintaining semantic correctness and natural flow. Focus on creating titles and descriptions that the user can use directly.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: options.maxLength || 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      // Validate response
      if (!response.data?.choices?.[0]?.message?.content) {
        throw new Error("Invalid response format from Groq API");
      }

      const report = response.data.choices[0].message.content;

      // Validate report content
      if (!report || report.length < 100) {
        throw new Error("Generated report is too short or empty");
      }

      return { report };
    } catch (error) {
      console.error("Error generating report with Groq:", error);
      return {
        report: "",
        error: this.handleError(error),
      };
    }
  }

  // Build prompt for improvement report
  private buildPrompt(
    analysis: AnalysisResult,
    userInput: UserInput,
    sampleData: SampleData,
  ): string {
    const { recommendations, topKeywords, topHashtags } = analysis;
    const { title, description } = userInput;

    let prompt = `Analyze this YouTube video metadata and generate two optimized title and description pairs that incorporate all recommendations and best practices.

Current Title: "${title}"
Current Description: "${description}"

Top Keywords to Use:
- Title Keywords: ${topKeywords.title.join(", ")}
- Description Keywords: ${topKeywords.description.join(", ")}

Fetched Hashtags (MUST use these first):
${
  topHashtags.length > 0
    ? topHashtags.map((tag) => `- ${tag}`).join("\n")
    : "No hashtags found in sample videos"
}

Recommendations to Follow:
${[...recommendations.title, ...recommendations.description]
  .map((rec) => `- ${rec.message}`)
  .join("\n")}

Length Guidelines:
- Title: 50-60 characters
- Description: MINIMUM 170 words (this is a strict requirement)

Generate two alternative title and description pairs that:
1. MUST incorporate all the top keywords in appropriate positions
2. MUST use ALL the fetched hashtags first (if any)
3. MUST add additional relevant hashtags to reach a total of 5 hashtags in each description
4. MUST follow all recommendations
5. MUST have AT LEAST 170 words in each description (this is mandatory)
6. MUST be optimized for search and engagement

Format the response in EXACTLY this structure without any additional text:

Title Option 1: [title]
Description Option 1: [description with 5 hashtags and minimum 170 words]

Title Option 2: [title]
Description Option 2: [description with 5 hashtags and minimum 170 words]

DO NOT include any asterisks, headings, or extra formatting. Please provide ONLY the title and description pairs in the exact format specified above.`;

    return prompt;
  }

  // Handle errors consistently
  private handleError(error: unknown): string {
    if (axios.isAxiosError(error) && error.response) {
      return `API Error (${error.response.status}): ${JSON.stringify(
        error.response.data,
      )}`;
    }
    if (error instanceof Error) {
      return error.message;
    }
    return "An unknown error occurred";
  }
}
