import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import Header from "./ui/Header";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";
import {
  AlertCircle,
  Loader,
  Hash,
  Type,
  BarChart2,
  Fingerprint,
  Award,
  FileText,
  MessageSquare,
  PercentSquare,
  RefreshCw,
  Check,
  Clock,
} from "lucide-react";
import { analyzeMetadata } from "../utils/keywordAnalyzer";
import { useYouTubeData } from "../hooks/useYouTubeData";
import { useGroqReport } from "../hooks/useGroqReport";
import ProfessionalReport from "./ProfessionalReport";
import SummaryReport from "./SummaryReport";
import SummaryReportCards from "./SummaryReportCards";
import RecommendationCards from "./RecommendationCards";
import AISummaryReportCard from "./AISummaryReportCard";
import ProfessionalReportCard from "./ProfessionalReportCard";
import ReportFlashCards from "./ReportFlashCards";
import HistorySidebar from "./HistorySidebar";
import { useAuth } from "./AuthProvider";
import { saveSession, SessionHistory } from "../utils/supabase";
import ImprovementReportCard from "./ImprovementReportCard";

type UserInput = {
  title: string;
  description: string;
};

const KeywordAnalyzer: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    title: "",
    description: "",
  });

  const [analysis, setAnalysis] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [historySidebarOpen, setHistorySidebarOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user, signOut } = useAuth();

  const {
    fetchData,
    isLoading: isLoadingYT,
    error: ytError,
  } = useYouTubeData();

  const {
    generateReport,
    report,
    isLoading: isGeneratingReport,
    error: reportError,
  } = useGroqReport();

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 300);
    return interval;
  };

  const handleAnalyze = async () => {
    setIsProcessing(true);
    const progressInterval = simulateProgress();
    setShowReport(false);
    setSessionSaved(false);
    setError(null);

    try {
      console.log("Fetching YouTube data for:", userInput.title);
      const youtubeData = await fetchData(userInput.title);
      console.log("YouTube data received:", youtubeData);

      console.log("Analyzing metadata...");
      const result = await analyzeMetadata(userInput, youtubeData);
      console.log("Analysis complete:", result);

      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      setError(
        typeof error === "string"
          ? error
          : error instanceof Error
          ? error.message
          : "An unexpected error occurred during analysis"
      );
    } finally {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 300);
    }
  };

  const handleGenerateReport = async () => {
    if (!analysis) return;

    setShowReport(true);
    const youtubeData = await fetchData(userInput.title);
    await generateReport(analysis, userInput, youtubeData);
  };

  const handleSaveSession = async () => {
    if (!user || !analysis) return;

    setIsSavingSession(true);
    try {
      await saveSession(
        user.id,
        userInput.title,
        userInput.description,
        analysis,
        report
      );
      setSessionSaved(true);
    } catch (error) {
      console.error("Error saving session:", error);
    } finally {
      setIsSavingSession(false);
    }
  };

  const handleSelectSession = (session: SessionHistory) => {
    setUserInput({
      title: session.title,
      description: session.description,
    });
    setAnalysis(session.analysis_result);

    if (session.report) {
      setShowReport(true);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  // Show error message if YouTube API fails
  if (ytError) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>
                Failed to connect to YouTube API. Please check your API key and
                try again.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // After the existing error for YouTube API
  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg text-red-600">
              <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Analysis Error</h3>
                <p className="text-sm mt-1 text-red-500">{error}</p>
                <Button
                  onClick={() => setError(null)}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white"
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Header onOpenHistory={() => setHistorySidebarOpen(true)} />

      <HistorySidebar
        onSelectSession={handleSelectSession}
        open={historySidebarOpen}
        setOpen={setHistorySidebarOpen}
      />

      <div className="w-full max-w-4xl mx-auto p-4 space-y-4 mt-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="text-2xl font-bold text-orange-800 dark:text-orange-300">
                Reach Optimizer
              </span>
              {sessionSaved && (
                <span className="text-sm font-normal text-green-600 flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Session saved
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-orange-900 dark:text-orange-200 text-left">
                Video Title
              </label>
              <input
                type="text"
                className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors bg-white/70"
                value={userInput.title}
                onChange={(e) =>
                  setUserInput((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder="Enter your video title"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-orange-900 dark:text-orange-200 text-left">
                Video Description
              </label>
              <textarea
                className="w-full p-3 border border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors h-32 bg-white/70"
                value={userInput.description}
                onChange={(e) =>
                  setUserInput((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Enter your video description"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={
                  isProcessing ||
                  isLoadingYT ||
                  !userInput.title.trim() ||
                  !userInput.description.trim()
                }
                className="flex-1 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
              >
                {isProcessing || isLoadingYT ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Processing... {progress}%</span>
                  </div>
                ) : (
                  "Analyze Metadata"
                )}
              </Button>

              {analysis && user && (
                <Button
                  onClick={handleSaveSession}
                  disabled={isSavingSession || sessionSaved}
                  variant="outline"
                  className="px-4"
                >
                  {isSavingSession ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : sessionSaved ? (
                    "Saved"
                  ) : (
                    "Save Session"
                  )}
                </Button>
              )}
            </div>

            {(isProcessing || isLoadingYT) && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {analysis && (
          <>
            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <BarChart2 className="w-5 h-5" />
                    <span>Title Score</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-orange-600 mb-4">
                    {analysis.scores.title.toFixed(1)}%
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Keyword Relevance
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {analysis.factors.title.keywordRelevance.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Keyword Placement
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {analysis.factors.title.keywordPlacement.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Length Score
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {analysis.factors.title.lengthScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <FileText className="w-5 h-5" />
                    <span>Description Score</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-orange-600 mb-4">
                    {analysis.scores.description.toFixed(1)}%
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Keyword Coverage
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {analysis.factors.description.keywordCoverage.toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Keyword Placement
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {analysis.factors.description.keywordPlacement.toFixed(
                          1
                        )}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Length Score
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {analysis.factors.description.lengthScore.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">CTA Score</span>
                      <span className="text-sm font-medium text-orange-600">
                        {analysis.factors.description.ctaScore.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">
                        Hashtag Score
                      </span>
                      <span className="text-sm font-medium text-orange-600">
                        {analysis.factors.description.hashtagScore.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Award className="w-5 h-5" />
                    <span>Overall Score</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-orange-600 mb-4">
                    {analysis.scores.overall.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">
                    Based on weighted analysis of title and description
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Top Keywords Information */}
            <div className="space-y-6">
              <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Hash className="w-5 h-5" />
                    <span>Top Title Keywords</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.topKeywords.title.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-4 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium shadow-sm hover:shadow transition-shadow"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Type className="w-5 h-5" />
                    <span>Top Description Keywords</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.topKeywords.description.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-4 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium shadow-sm hover:shadow transition-shadow"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <Hash className="w-5 h-5" />
                    <span>Top Hashtags</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analysis.topHashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        className="px-4 py-1.5 bg-orange-100 text-orange-800 rounded-full text-sm font-medium shadow-sm hover:shadow transition-shadow"
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recommendations */}
            <div className="space-y-6">
              <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <MessageSquare className="w-5 h-5" />
                    <span>Title Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.recommendations.title.map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 bg-white/80 rounded-lg shadow-sm border border-orange-100"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 ${
                            rec.priority === "high"
                              ? "bg-red-500"
                              : rec.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                        <span className="text-sm text-gray-700">
                          {rec.message}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-orange-700">
                    <MessageSquare className="w-5 h-5" />
                    <span>Description Recommendations</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {analysis.recommendations.description.map((rec, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-3 p-3 bg-white/80 rounded-lg shadow-sm border border-orange-100"
                      >
                        <div
                          className={`w-2 h-2 rounded-full mt-1.5 ${
                            rec.priority === "high"
                              ? "bg-red-500"
                              : rec.priority === "medium"
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          }`}
                        />
                        <span className="text-sm text-gray-700">
                          {rec.message}
                        </span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Improvement Report */}
            {showReport && (
              <Card className="border-orange-100 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="py-6">
                  {isGeneratingReport ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="flex flex-col items-center gap-3">
                        <Loader className="h-10 w-10 animate-spin text-orange-500" />
                        <p className="text-sm text-gray-500">
                          Generating improvement suggestions...
                        </p>
                      </div>
                    </div>
                  ) : reportError ? (
                    <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg text-red-600">
                      <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-medium">Error generating report</h3>
                        <p className="text-sm mt-1 text-red-500">
                          {reportError}
                        </p>
                      </div>
                    </div>
                  ) : report ? (
                    <>
                      {console.log("Debug - Report received:", report)}
                      <ImprovementReportCard
                        report={report}
                        isLoading={isGeneratingReport}
                        error={reportError}
                      />
                    </>
                  ) : null}
                </CardContent>
              </Card>
            )}

            {/* Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-xl shadow-md hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all hover:shadow-lg"
              >
                {isGeneratingReport ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Generating Improvements...</span>
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    <span>Generate Improvement Report</span>
                  </>
                )}
              </Button>

              {user && (
                <Button
                  onClick={handleSaveSession}
                  disabled={isSavingSession || sessionSaved}
                  variant="outline"
                  className="px-4 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                >
                  {isSavingSession ? (
                    <Loader className="h-4 w-4 animate-spin" />
                  ) : sessionSaved ? (
                    "Saved"
                  ) : (
                    "Save Session"
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default KeywordAnalyzer;
