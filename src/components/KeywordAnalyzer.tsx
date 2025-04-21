import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
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
import { Button } from "./ui/button";

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
  const [showProfessionalReport, setShowProfessionalReport] = useState(false);
  const [showSummaryReport, setShowSummaryReport] = useState(false);
  const [showFlashCards, setShowFlashCards] = useState(false);
  const [isSavingSession, setIsSavingSession] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);

  const { user, signOut } = useAuth();

  const {
    fetchData,
    isLoading: isLoadingYT,
    error: ytError,
  } = useYouTubeData();

  const {
    generateReport,
    generateSummaryReport,
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
    setShowProfessionalReport(false);
    setShowSummaryReport(false);
    setShowFlashCards(false);
    setSessionSaved(false);

    try {
      // Fetch YouTube data
      const youtubeData = await fetchData(
        userInput.title,
        userInput.description,
      );

      // Use the fetched data for analysis
      const result = await analyzeMetadata(userInput, youtubeData);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      // You might want to show an error message to the user here
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

    setShowProfessionalReport(true);
    setShowSummaryReport(false);
    setShowFlashCards(false);
    await generateReport(analysis, userInput, {
      includeDetailedScores: true,
      includeRecommendations: true,
      professionalTone: true,
      maxLength: 1500,
    });
  };

  const handleGenerateSummaryReport = async () => {
    if (!analysis) return;

    setShowSummaryReport(true);
    setShowProfessionalReport(false);
    setShowFlashCards(true);
    await generateSummaryReport(analysis, userInput);
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
        report,
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
      setShowSummaryReport(true);
      setShowFlashCards(true);
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
      <div className='w-full max-w-4xl mx-auto p-4'>
        <Card>
          <CardContent className='p-6'>
            <div className='flex items-center gap-2 text-red-600'>
              <AlertCircle className='w-5 h-5' />
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

  return (
    <>
      <HistorySidebar
        onSelectSession={handleSelectSession}
        onSignOut={signOut}
      />

      <div className='w-full max-w-4xl mx-auto p-4 space-y-4 mt-10'>
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center justify-between'>
              <span>YouTube Metadata Optimizer</span>
              {sessionSaved && (
                <span className='text-sm font-normal text-green-600 flex items-center gap-1'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-4 w-4'
                    viewBox='0 0 20 20'
                    fill='currentColor'>
                    <path
                      fillRule='evenodd'
                      d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                  Session saved
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-2'>
              <label className='block text-sm font-medium text-neutral-700'>
                Video Title
              </label>
              <input
                type='text'
                className='w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                value={userInput.title}
                onChange={(e) =>
                  setUserInput((prev) => ({ ...prev, title: e.target.value }))
                }
                placeholder='Enter your video title'
              />
            </div>

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-neutral-700'>
                Video Description
              </label>
              <textarea
                className='w-full p-3 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors h-32'
                value={userInput.description}
                onChange={(e) =>
                  setUserInput((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder='Enter your video description'
              />
            </div>

            <div className='flex gap-3'>
              <Button
                onClick={handleAnalyze}
                disabled={
                  isProcessing ||
                  isLoadingYT ||
                  !userInput.title.trim() ||
                  !userInput.description.trim()
                }
                className='flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors'>
                {isProcessing || isLoadingYT ? (
                  <div className='flex items-center justify-center gap-2'>
                    <Loader className='w-4 h-4 animate-spin' />
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
                  variant='outline'
                  className='px-4'>
                  {isSavingSession ? (
                    <Loader className='h-4 w-4 animate-spin' />
                  ) : sessionSaved ? (
                    "Saved"
                  ) : (
                    "Save Session"
                  )}
                </Button>
              )}
            </div>

            {(isProcessing || isLoadingYT) && (
              <div className='w-full bg-gray-200 rounded-full h-2'>
                <div
                  className='bg-purple-600 h-2 rounded-full transition-all duration-300 ease-in-out'
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {analysis && (
          <>
            {/* Summary Report (if displayed) */}
            {showSummaryReport && (
              <AISummaryReportCard
                report={report}
                isLoading={isGeneratingReport}
                error={reportError}
                onViewDetailedReport={handleGenerateReport}
              />
            )}

            {/* Report Flash Cards */}
            {showFlashCards && report && <ReportFlashCards report={report} />}

            {/* Professional Report (if displayed) */}
            {showProfessionalReport && (
              <ProfessionalReportCard
                report={report}
                isLoading={isGeneratingReport}
                error={reportError}
              />
            )}

            {/* Summary Report Cards - Always shown when analysis exists */}
            <SummaryReportCards
              analysis={analysis}
              isLoading={false}
              error={null}
            />

            {/* Recommendation Cards */}
            <RecommendationCards recommendations={analysis.recommendations} />

            {/* Buttons for generating reports */}
            <div className='flex gap-4 mb-6'>
              <Button
                onClick={handleGenerateSummaryReport}
                disabled={isGeneratingReport}
                className='flex-1 bg-gradient-to-r from-purple-500 to-violet-500 text-white py-3 px-4 rounded-xl shadow-md hover:from-purple-600 hover:to-violet-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all'>
                {isGeneratingReport && showSummaryReport ? (
                  <>
                    <Loader className='w-5 h-5 animate-spin' />
                    <span>Generating Summary...</span>
                  </>
                ) : (
                  <>
                    <MessageSquare className='w-5 h-5' />
                    <span>Quick Summary Report</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
                className='flex-1 bg-gradient-to-r from-violet-500 to-purple-500 text-white py-3 px-4 rounded-xl shadow-md hover:from-violet-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all'>
                {isGeneratingReport && showProfessionalReport ? (
                  <>
                    <Loader className='w-5 h-5 animate-spin' />
                    <span>Generating Report...</span>
                  </>
                ) : (
                  <>
                    <FileText className='w-5 h-5' />
                    <span>Detailed Professional Report</span>
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default KeywordAnalyzer;
