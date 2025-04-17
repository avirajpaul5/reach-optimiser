import axios from "axios";

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
      uniquenessScore: number;
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
}

export interface UserInput {
  title: string;
  description: string;
}

export interface ReportOptions {
  includeDetailedScores: boolean;
  includeRecommendations: boolean;
  professionalTone: boolean;
  maxLength?: number;
}

export interface GeneratedReport {
  report: string;
  error?: string;
}

export class GroqReportGenerator {
  private apiKey: string;
  private model = "llama3-70b-8192";
  private baseUrl = "https://api.groq.com/openai/v1/chat/completions";

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateSummaryReport(
    analysis: AnalysisResult,
    userInput: UserInput,
  ): Promise<GeneratedReport> {
    try {
      if (!this.apiKey) {
        throw new Error("Groq API key is not provided");
      }

      // Build a concise prompt for summary
      const prompt = this.buildSummaryPrompt(analysis, userInput);

      // Make API call to Groq
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          messages: [
            {
              role: "system",
              content:
                "You are a concise YouTube SEO consultant. Provide a single paragraph assessment that captures the essence of the content quality and offers clear improvement suggestions.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (
        !response.data ||
        !response.data.choices ||
        !response.data.choices[0]
      ) {
        throw new Error("Invalid response format from Groq API");
      }

      return {
        report: response.data.choices[0].message.content,
      };
    } catch (error) {
      console.error("Error generating summary report with Groq:", error);
      let errorMessage = "Unknown error occurred";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `API Error (${error.response.status}): ${JSON.stringify(
          error.response.data,
        )}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        report: "",
        error: errorMessage,
      };
    }
  }

  async generateReport(
    analysis: AnalysisResult,
    userInput: UserInput,
    options: ReportOptions = {
      includeDetailedScores: true,
      includeRecommendations: true,
      professionalTone: true,
    },
  ): Promise<GeneratedReport> {
    try {
      if (!this.apiKey) {
        throw new Error("Groq API key is not provided");
      }

      // Prepare the content for the prompt
      const prompt = this.buildPrompt(analysis, userInput, options);

      // Make API call to Groq
      const response = await axios.post(
        this.baseUrl,
        {
          model: this.model,
          messages: [
            {
              role: "system",
              content:
                "You are a professional YouTube SEO consultant helping content creators optimize their metadata for better discoverability and engagement. Provide clear, actionable insights in a professional tone.",
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

      if (
        !response.data ||
        !response.data.choices ||
        !response.data.choices[0]
      ) {
        throw new Error("Invalid response format from Groq API");
      }

      return {
        report: response.data.choices[0].message.content,
      };
    } catch (error) {
      console.error("Error generating report with Groq:", error);
      let errorMessage = "Unknown error occurred";

      if (axios.isAxiosError(error) && error.response) {
        errorMessage = `API Error (${error.response.status}): ${JSON.stringify(
          error.response.data,
        )}`;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      return {
        report: "",
        error: errorMessage,
      };
    }
  }

  private buildSummaryPrompt(
    analysis: AnalysisResult,
    userInput: UserInput,
  ): string {
    // Format the scores as percentages with 1 decimal place
    const formatScore = (score: number) => `${score.toFixed(1)}%`;

    let prompt = `Rewrite the video title and description to sound more engaging, professional, and SEO-friendly. Incorporate all the key improvements I've made in the video. Generate two compelling title suggestions and two matching descriptions that clearly communicate the value of the content. Feel free to add relevant hashtags for discoverability.:\n\n`;

    prompt += `TITLE: "${userInput.title}"\n`;
    prompt += `DESCRIPTION: "${userInput.description}"\n\n`;

    prompt += `OVERALL SCORES:\n`;
    prompt += `- Title Score: ${formatScore(analysis.scores.title)}\n`;
    prompt += `- Description Score: ${formatScore(
      analysis.scores.description,
    )}\n`;
    prompt += `- Overall Score: ${formatScore(analysis.scores.overall)}\n\n`;

    // Add top 2-3 most important recommendations
    prompt += `TOP TITLE RECOMMENDATIONS:\n`;
    const titleRecs = analysis.recommendations.title
      .filter((rec) => rec.priority === "high")
      .slice(0, 2);
    titleRecs.forEach((rec) => {
      prompt += `- ${rec.message}\n`;
    });
    prompt += `\n`;

    prompt += `TOP DESCRIPTION RECOMMENDATIONS:\n`;
    const descRecs = analysis.recommendations.description
      .filter((rec) => rec.priority === "high")
      .slice(0, 2);
    descRecs.forEach((rec) => {
      prompt += `- ${rec.message}\n`;
    });
    prompt += `\n`;

    prompt += `Please generate a single paragraph that captures the current quality of the content and clearly articulates what they can improve on. Keep it professional but concise.`;

    return prompt;
  }

  private buildPrompt(
    analysis: AnalysisResult,
    userInput: UserInput,
    options: ReportOptions,
  ): string {
    const { includeDetailedScores, includeRecommendations, professionalTone } =
      options;

    // Format the scores as percentages with 1 decimal place
    const formatScore = (score: number) => `${score.toFixed(1)}%`;

    let prompt = `Generate a ${
      professionalTone ? "professional" : "friendly"
    } YouTube metadata optimization report based on the following analysis:\n\n`;

    prompt += `TITLE: "${userInput.title}"\n`;
    prompt += `DESCRIPTION: "${userInput.description}"\n\n`;

    prompt += `OVERALL SCORES:\n`;
    prompt += `- Title Score: ${formatScore(analysis.scores.title)}\n`;
    prompt += `- Description Score: ${formatScore(
      analysis.scores.description,
    )}\n`;
    prompt += `- Overall Score: ${formatScore(analysis.scores.overall)}\n\n`;

    if (includeDetailedScores) {
      prompt += `TITLE FACTORS:\n`;
      prompt += `- Keyword Relevance: ${formatScore(
        analysis.factors.title.keywordRelevance,
      )}\n`;
      prompt += `- Keyword Placement: ${formatScore(
        analysis.factors.title.keywordPlacement,
      )}\n`;
      prompt += `- Length Score: ${formatScore(
        analysis.factors.title.lengthScore,
      )}\n`;
      prompt += `- Uniqueness Score: ${formatScore(
        analysis.factors.title.uniquenessScore,
      )}\n\n`;

      prompt += `DESCRIPTION FACTORS:\n`;
      prompt += `- Keyword Coverage: ${formatScore(
        analysis.factors.description.keywordCoverage,
      )}\n`;
      prompt += `- Keyword Placement: ${formatScore(
        analysis.factors.description.keywordPlacement,
      )}\n`;
      prompt += `- Length Score: ${formatScore(
        analysis.factors.description.lengthScore,
      )}\n`;
      prompt += `- CTA Score: ${formatScore(
        analysis.factors.description.ctaScore,
      )}\n`;
      prompt += `- Hashtag Score: ${formatScore(
        analysis.factors.description.hashtagScore,
      )}\n\n`;
    }

    if (includeRecommendations) {
      prompt += `TITLE RECOMMENDATIONS:\n`;
      analysis.recommendations.title.forEach((rec) => {
        prompt += `- [${rec.priority.toUpperCase()}] ${rec.message}\n`;
      });
      prompt += `\n`;

      prompt += `DESCRIPTION RECOMMENDATIONS:\n`;
      analysis.recommendations.description.forEach((rec) => {
        prompt += `- [${rec.priority.toUpperCase()}] ${rec.message}\n`;
      });
      prompt += `\n`;
    }

    prompt += `Please generate a comprehensive report that includes:\n`;
    prompt += `1. A professional introduction summarizing overall performance\n`;
    prompt += `2. Detailed analysis of the title's strengths and weaknesses\n`;
    prompt += `3. Detailed analysis of the description's strengths and weaknesses\n`;
    prompt += `4. Specific, actionable recommendations for improvement\n`;
    prompt += `5. A summary of expected improvements if recommendations are implemented\n\n`;

    prompt += `The report should be well-structured with clear sections and professional language. Format it for easy readability.`;

    return prompt;
  }
}
