import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { AlertCircle, MessageSquare } from "lucide-react";

interface SummaryReportProps {
  report: string;
  isLoading: boolean;
  error: string | null;
}

const SummaryReport: React.FC<SummaryReportProps> = ({
  report,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <Card className='mb-4'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <span className='animate-pulse'>Generating Summary...</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='h-16 flex items-center justify-center'>
            <div className='w-6 h-6 border-3 border-blue-500 border-t-transparent rounded-full animate-spin'></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className='mb-4 border-red-300'>
        <CardHeader>
          <CardTitle className='flex items-center gap-2 text-red-600'>
            <AlertCircle className='w-5 h-5' />
            <span>Summary Generation Failed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className='text-red-500'>{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!report) {
    return null;
  }

  return (
    <Card className='mb-4 border-indigo-200 bg-indigo-50'>
      <CardHeader className='pb-2'>
        <CardTitle className='flex items-center gap-2 text-indigo-700'>
          <MessageSquare className='w-5 h-5' />
          Content Quality Assessment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className='text-gray-800 text-lg leading-relaxed'>{report}</p>
      </CardContent>
    </Card>
  );
};

export default SummaryReport;
