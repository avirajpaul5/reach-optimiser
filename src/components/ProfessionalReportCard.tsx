import React from "react";
import {
  FileText,
  Loader,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface ProfessionalReportCardProps {
  report: string;
  isLoading: boolean;
  error: string | null;
}

const ProfessionalReportCard: React.FC<ProfessionalReportCardProps> = ({
  report,
  isLoading,
  error,
}) => {
  const [expanded, setExpanded] = React.useState(false);

  if (isLoading) {
    return (
      <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md overflow-hidden mb-6'>
        <div className='p-4'>
          <div className='flex justify-between items-start mb-4'>
            <div className='flex items-center'>
              <FileText className='h-5 w-5 text-blue-600 mr-2' />
              <span className='text-sm text-gray-600'>Professional</span>
            </div>
            <span className='text-sm text-gray-600'>Report</span>
          </div>
          <div className='mb-4 h-8 bg-blue-100 rounded-md w-2/3 animate-pulse'></div>
          <div className='mb-6 space-y-2'>
            <div className='h-4 bg-blue-100 rounded-md w-full animate-pulse'></div>
            <div className='h-4 bg-blue-100 rounded-md w-full animate-pulse'></div>
            <div className='h-4 bg-blue-100 rounded-md w-5/6 animate-pulse'></div>
            <div className='h-4 bg-blue-100 rounded-md w-full animate-pulse'></div>
            <div className='h-4 bg-blue-100 rounded-md w-4/5 animate-pulse'></div>
          </div>
          <div className='mt-6 flex justify-center'>
            <div className='w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-gradient-to-br from-red-50 to-pink-50 rounded-xl shadow-md overflow-hidden mb-6'>
        <div className='p-4'>
          <div className='flex justify-between items-start mb-2'>
            <div className='flex items-center'>
              <FileText className='h-5 w-5 text-red-600 mr-2' />
              <span className='text-sm text-gray-600'>Professional</span>
            </div>
            <span className='text-sm text-gray-600'>Report</span>
          </div>
          <div className='mb-2'>
            <span className='text-xl font-semibold text-red-600'>
              Generation Failed
            </span>
          </div>
          <p className='text-red-600'>{error}</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return null;
  }

  // Process the report to extract sections
  const formatReport = () => {
    const lines = report.split("\n");

    // Find headings and content
    const sections: { heading: string; content: string[] }[] = [];
    let currentHeading = "Overview";
    let currentContent: string[] = [];

    lines.forEach((line) => {
      const trimmedLine = line.trim();

      // Check if it's a heading (starts with #, all caps, or ends with :)
      if (
        trimmedLine.startsWith("#") ||
        /^[A-Z0-9\s]{5,}$/.test(trimmedLine) ||
        trimmedLine.endsWith(":")
      ) {
        // Save previous section if it exists
        if (currentContent.length > 0) {
          sections.push({
            heading: currentHeading,
            content: [...currentContent],
          });
          currentContent = [];
        }

        // Set new heading
        currentHeading = trimmedLine.replace(/^#+\s*/, "");
      } else if (trimmedLine.length > 0) {
        // Add to current content
        currentContent.push(trimmedLine);
      }
    });

    // Add the last section
    if (currentContent.length > 0) {
      sections.push({
        heading: currentHeading,
        content: currentContent,
      });
    }

    return sections;
  };

  const sections = formatReport();
  const previewSections = expanded ? sections : sections.slice(0, 2);

  return (
    <div className='bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-md overflow-hidden mb-6'>
      <div className='p-4'>
        <div className='flex justify-between items-start mb-2'>
          <div className='flex items-center'>
            <FileText className='h-5 w-5 text-blue-600 mr-2' />
            <span className='text-sm text-gray-600'>Professional</span>
          </div>
          <span className='text-sm text-gray-600'>Report</span>
        </div>

        <div className='mb-2'>
          <span className='text-2xl font-bold text-blue-700'>
            Improvement Report
          </span>
        </div>

        <div className='flex items-center text-sm text-gray-600 mb-4'>
          <span>@DetailedAnalysis</span>
        </div>

        {/* Report sections */}
        <div className='space-y-4'>
          {previewSections.map((section, index) => (
            <div
              key={index}
              className='border-b border-gray-200 pb-4 last:border-b-0'>
              <h3 className='font-bold text-blue-700 mb-2'>
                {section.heading}
              </h3>
              <div className='space-y-2'>
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className='text-gray-700 text-sm'>
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {sections.length > 2 && (
          <div className='mt-4 flex justify-center'>
            <button
              onClick={() => setExpanded(!expanded)}
              className='inline-flex items-center text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors'>
              {expanded ? (
                <>
                  Show less <ChevronUp className='ml-1 h-4 w-4' />
                </>
              ) : (
                <>
                  Show more <ChevronDown className='ml-1 h-4 w-4' />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessionalReportCard;
