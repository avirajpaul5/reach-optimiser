import React from "react";
import { Card, CardContent } from "./ui/card";
import { Loader, AlertCircle, FileText } from "lucide-react";
import { Button } from "./ui/button";

interface AISummaryReportCardProps {
  report: string | null;
  isLoading: boolean;
  error: string | null;
  onViewDetailedReport: () => void;
}

const AISummaryReportCard: React.FC<AISummaryReportCardProps> = ({
  report,
  isLoading,
  error,
  onViewDetailedReport,
}) => {
  // Format bullet points
  const formatReport = (text: string) => {
    // Split the text by newlines and filter out empty lines
    const lines = text.split("\n").filter((line) => line.trim() !== "");

    // Process each line
    return lines.map((line, index) => {
      // Check if the line is a bullet point
      const isBulletPoint =
        line.trim().startsWith("-") || line.trim().startsWith("•");

      if (isBulletPoint) {
        // Remove the bullet character and trim the text
        const bulletText = line.trim().substring(1).trim();
        return (
          <li key={index} className='ml-2 mb-2'>
            {bulletText}
          </li>
        );
      } else {
        // Regular paragraph
        return (
          <p key={index} className='mb-3 last:mb-0'>
            {line}
          </p>
        );
      }
    });
  };

  return (
    <Card className='overflow-hidden border border-purple-100 bg-gradient-to-br from-white to-purple-50'>
      <CardContent className='p-6'>
        <div className='flex items-center justify-between mb-4'>
          <div className='flex items-center gap-2'>
            <div className='h-8 w-1 bg-gradient-to-b from-purple-600 to-purple-400 rounded-full'></div>
            <h2 className='text-xl font-semibold text-gray-800'>
              AI Summary Report
            </h2>
          </div>

          {!isLoading && report && (
            <Button
              onClick={onViewDetailedReport}
              variant='outline'
              className='flex items-center gap-1 border-purple-200 hover:bg-purple-50 hover:text-purple-600 transition-colors'>
              <FileText className='h-4 w-4' />
              <span>View Detailed Report</span>
            </Button>
          )}
        </div>

        <div className='mt-4'>
          {isLoading ? (
            <div className='flex justify-center items-center h-40'>
              <div className='flex flex-col items-center gap-3'>
                <Loader className='h-10 w-10 animate-spin text-purple-500' />
                <p className='text-sm text-gray-500'>Generating AI report...</p>
              </div>
            </div>
          ) : error ? (
            <div className='flex items-start gap-3 p-4 bg-red-50 rounded-lg text-red-600'>
              <AlertCircle className='h-5 w-5 mt-0.5 flex-shrink-0' />
              <div>
                <h3 className='font-medium'>Error generating report</h3>
                <p className='text-sm mt-1 text-red-500'>{error}</p>
              </div>
            </div>
          ) : report ? (
            <div className='prose prose-purple max-w-none'>
              <ul className='pl-5 list-disc mt-2 space-y-1 marker:text-purple-500'>
                {formatReport(report)}
              </ul>
            </div>
          ) : (
            <div className='text-center py-10 text-gray-500'>
              No report generated yet. Click "Quick Summary Report" to generate.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AISummaryReportCard;
