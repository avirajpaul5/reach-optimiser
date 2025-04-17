import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { AlertCircle } from "lucide-react";

interface ProfessionalReportProps {
  report: string;
  isLoading: boolean;
  error: string | null;
}

const ProfessionalReport: React.FC<ProfessionalReportProps> = ({
  report,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <Card className='mt-4'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <span className='animate-pulse'>
              Generating Professional Report...
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-40 flex items-center justify-center'>
            <div className='w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='mt-4 border-red-300'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-red-600'>
            <AlertCircle className='w-5 h-5' />
            <span>Report Generation Failed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-red-500'>{error}</p>
          <p className='mt-2'>
            Please try again later or contact support if the issue persists.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return null;
  }

  // Split report by line breaks and transform into paragraphs and headings
  const formattedReport = report.split("\n").map((line, index) => {
    // Check if the line is a heading (contains # or is all caps or ends with :)
    if (
      line.startsWith("#") ||
      /^[A-Z0-9\s]{5,}$/.test(line) ||
      line.endsWith(":")
    ) {
      return (
        <h3 key={index} className='font-bold text-lg mt-4 mb-2'>
          {line.replace(/^#+\s*/, "")}
        </h3>
      );
    }

    // Check if line is a list item
    if (line.trim().startsWith("-") || line.trim().match(/^\d+\./)) {
      return (
        <li key={index} className='ml-6 mb-1'>
          {line.replace(/^-\s*|^\d+\.\s*/, "")}
        </li>
      );
    }

    // Empty line, render a small gap
    if (!line.trim()) {
      return <div key={index} className='h-2'></div>;
    }

    // Regular paragraph
    return (
      <p key={index} className='mb-2'>
        {line}
      </p>
    );
  });

  return (
    <Card className='mt-4'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          Professional Improvement Report
        </CardTitle>
      </CardHeader>
      <CardContent className='prose max-w-none'>{formattedReport}</CardContent>
    </Card>
  );
};

export default ProfessionalReport;
