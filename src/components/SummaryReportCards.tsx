import React from "react";
import {
  Award,
  MessageSquare,
  BarChart2,
  Type,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

interface SummaryReportCardsProps {
  analysis: any;
  isLoading: boolean;
  error: string | null;
}

const SummaryReportCards: React.FC<SummaryReportCardsProps> = ({
  analysis,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className='bg-white rounded-xl shadow-md p-4 animate-pulse'>
            <div className='h-6 bg-gray-200 rounded w-1/3 mb-4'></div>
            <div className='h-10 bg-gray-200 rounded w-1/2 mb-4'></div>
            <div className='h-4 bg-gray-200 rounded w-full mb-2'></div>
            <div className='h-4 bg-gray-200 rounded w-2/3'></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-red-50 border border-red-200 rounded-xl p-4 mb-6'>
        <p className='text-red-600'>{error}</p>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreArrow = (score: number) => {
    if (score >= 80) return <ArrowUp className='h-4 w-4 text-green-600' />;
    if (score >= 60) return <ArrowUp className='h-4 w-4 text-yellow-600' />;
    return <ArrowDown className='h-4 w-4 text-red-600' />;
  };

  const getPercentageClass = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
      {/* Overall Performance Card */}
      <div className='bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl shadow-md overflow-hidden'>
        <div className='p-4'>
          <div className='flex justify-between items-start mb-2'>
            <div className='flex items-center'>
              <Award className='h-5 w-5 text-purple-600 mr-2' />
              <span className='text-sm text-gray-600'>Overall</span>
            </div>
            <span className='text-sm text-gray-600'>Performance</span>
          </div>
          <div className='mb-2'>
            <span
              className={`text-3xl font-bold ${getScoreColor(
                analysis.scores.overall,
              )}`}>
              {analysis.scores.overall.toFixed(1)}%
            </span>
          </div>
          <div className='flex items-center text-sm text-gray-600 mb-4'>
            <span>@MetadataScore</span>
          </div>

          <div className='w-full bg-gray-200 h-2 rounded-full mb-4'>
            <div
              className='bg-blue-500 h-2 rounded-full'
              style={{ width: `${analysis.scores.overall}%` }}></div>
          </div>

          <div className='grid grid-cols-3 gap-2'>
            <div>
              <div
                className={`text-sm ${getPercentageClass(
                  analysis.scores.title,
                )}`}>
                {analysis.scores.title.toFixed(1)}%
              </div>
              <div className='text-xs text-gray-500'>Title</div>
            </div>
            <div>
              <div
                className={`text-sm ${getPercentageClass(
                  analysis.scores.description,
                )}`}>
                {analysis.scores.description.toFixed(1)}%
              </div>
              <div className='text-xs text-gray-500'>Description</div>
            </div>
            <div>
              <div
                className={`text-sm ${getPercentageClass(
                  analysis.factors.description.keywordCoverage,
                )}`}>
                {analysis.factors.description.keywordCoverage.toFixed(1)}%
              </div>
              <div className='text-xs text-gray-500'>Keywords</div>
            </div>
          </div>
        </div>
      </div>

      {/* Title Analysis Card */}
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md overflow-hidden'>
        <div className='p-4'>
          <div className='flex justify-between items-start mb-2'>
            <div className='flex items-center'>
              <Type className='h-5 w-5 text-blue-600 mr-2' />
              <span className='text-sm text-gray-600'>Title</span>
            </div>
            <span className='text-sm text-gray-600'>Analysis</span>
          </div>
          <div className='mb-2'>
            <span
              className={`text-3xl font-bold ${getScoreColor(
                analysis.scores.title,
              )}`}>
              {analysis.scores.title.toFixed(1)}%
            </span>
          </div>
          <div className='flex items-center text-sm text-gray-600 mb-4'>
            <span>@TitlePerformance</span>
          </div>

          <div className='w-full bg-gray-200 h-2 rounded-full mb-4'>
            <div
              className='bg-blue-500 h-2 rounded-full'
              style={{ width: `${analysis.scores.title}%` }}></div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <div>
              <div
                className={`text-sm ${getPercentageClass(
                  analysis.factors.title.keywordRelevance,
                )}`}>
                {analysis.factors.title.keywordRelevance.toFixed(1)}%
              </div>
              <div className='text-xs text-gray-500'>Keyword Relevance</div>
            </div>
            <div>
              <div
                className={`text-sm ${getPercentageClass(
                  analysis.factors.title.keywordPlacement,
                )}`}>
                {analysis.factors.title.keywordPlacement.toFixed(1)}%
              </div>
              <div className='text-xs text-gray-500'>Keyword Placement</div>
            </div>
            <div>
              <div
                className={`text-sm ${getPercentageClass(
                  analysis.factors.title.lengthScore,
                )}`}>
                {analysis.factors.title.lengthScore.toFixed(1)}%
              </div>
              <div className='text-xs text-gray-500'>Length</div>
            </div>
            <div>
              <div
                className={`text-sm ${getPercentageClass(
                  analysis.factors.title.uniquenessScore,
                )}`}>
                {analysis.factors.title.uniquenessScore.toFixed(1)}%
              </div>
              <div className='text-xs text-gray-500'>Uniqueness</div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Analysis Card */}
      <div className='bg-gradient-to-br from-green-50 to-teal-50 rounded-xl shadow-md overflow-hidden'>
        <div className='p-4'>
          <div className='flex justify-between items-start mb-2'>
            <div className='flex items-center'>
              <BarChart2 className='h-5 w-5 text-green-600 mr-2' />
              <span className='text-sm text-gray-600'>Description</span>
            </div>
            <span className='text-sm text-gray-600'>Analysis</span>
          </div>
          <div className='mb-2'>
            <span
              className={`text-3xl font-bold ${getScoreColor(
                analysis.scores.description,
              )}`}>
              {analysis.scores.description.toFixed(1)}%
            </span>
          </div>
          <div className='flex items-center text-sm text-gray-600 mb-4'>
            <span>@DescriptionPerformance</span>
          </div>

          <div className='w-full bg-gray-200 h-2 rounded-full mb-4'>
            <div
              className='bg-blue-500 h-2 rounded-full'
              style={{ width: `${analysis.scores.description}%` }}></div>
          </div>

          <div className='grid grid-cols-3 gap-2'>
            <div>
              <div
                className={`text-sm ${getPercentageClass(
                  analysis.factors.description.keywordCoverage,
                )}`}>
                {analysis.factors.description.keywordCoverage.toFixed(1)}%
              </div>
              <div className='text-xs text-gray-500'>Keyword Coverage</div>
            </div>
            <div>
              <div
                className={`text-sm ${getPercentageClass(
                  analysis.factors.description.keywordPlacement,
                )}`}>
                {analysis.factors.description.keywordPlacement.toFixed(1)}%
              </div>
              <div className='text-xs text-gray-500'>Keyword Placement</div>
            </div>
            <div>
              <div
                className={`text-sm ${getPercentageClass(
                  analysis.factors.description.lengthScore,
                )}`}>
                {analysis.factors.description.lengthScore.toFixed(1)}%
              </div>
              <div className='text-xs text-gray-500'>Length</div>
            </div>
            <div>
              <div
                className={`text-sm ${getPercentageClass(
                  analysis.factors.description.ctaScore,
                )}`}>
                {analysis.factors.description.ctaScore.toFixed(1)}%
              </div>
              <div className='text-xs text-gray-500'>CTA</div>
            </div>
            <div>
              <div
                className={`text-sm ${getPercentageClass(
                  analysis.factors.description.hashtagScore,
                )}`}>
                {analysis.factors.description.hashtagScore.toFixed(1)}%
              </div>
              <div className='text-xs text-gray-500'>Hashtags</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryReportCards;
