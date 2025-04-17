import { useState } from "react";
import {
  GroqReportGenerator,
  AnalysisResult,
  UserInput,
  ReportOptions,
  GeneratedReport,
} from "../utils/groqReportGenerator";
import { useApiKeys } from "../App";

interface UseGroqReportReturn {
  generateReport: (
    analysis: AnalysisResult,
    userInput: UserInput,
    options?: ReportOptions,
  ) => Promise<void>;
  generateSummaryReport: (
    analysis: AnalysisResult,
    userInput: UserInput,
  ) => Promise<void>;
  report: string;
  isLoading: boolean;
  error: string | null;
}

export const useGroqReport = (): UseGroqReportReturn => {
  const [report, setReport] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { groqApiKey } = useApiKeys();

  // Create a new generator instance only when the API key changes or is needed
  const getGenerator = () => {
    if (!groqApiKey) {
      throw new Error(
        "Groq API key is not available. Please check your environment variables.",
      );
    }
    return new GroqReportGenerator(groqApiKey);
  };

  const generateReport = async (
    analysis: AnalysisResult,
    userInput: UserInput,
    options?: ReportOptions,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const generator = getGenerator();
      const result: GeneratedReport = await generator.generateReport(
        analysis,
        userInput,
        options,
      );

      if (result.error) {
        setError(result.error);
        setReport("");
      } else {
        setReport(result.report);
      }
    } catch (err) {
      console.error("Error in useGroqReport.generateReport:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setReport("");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSummaryReport = async (
    analysis: AnalysisResult,
    userInput: UserInput,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const generator = getGenerator();
      const result: GeneratedReport = await generator.generateSummaryReport(
        analysis,
        userInput,
      );

      if (result.error) {
        setError(result.error);
        setReport("");
      } else {
        setReport(result.report);
      }
    } catch (err) {
      console.error("Error in useGroqReport.generateSummaryReport:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      setReport("");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    generateReport,
    generateSummaryReport,
    report,
    isLoading,
    error,
  };
};
