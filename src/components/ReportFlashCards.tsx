import React from "react";
import { Card, CardContent } from "./ui/card";

interface ReportFlashCardsProps {
  report: string;
}

const ReportFlashCards: React.FC<ReportFlashCardsProps> = ({ report }) => {
  if (!report) return null;

  // Parse the report content into sections/paragraphs
  const createFlashCards = (content: string) => {
    // Split by headings or double line breaks
    const sections = content
      .split(/(?:\r?\n){2,}|(?:(?:\d+\.|#{1,3})\s.+\r?\n)/)
      .filter((section) => section.trim().length > 0);

    // If we have too few sections, try to split by sentences or bullet points
    let cards = sections;
    if (sections.length < 3) {
      cards = [];
      sections.forEach((section) => {
        // Split by bullet points or numbered lists
        const bulletPoints = section
          .split(/\r?\n(?:-|\*|\d+\.)\s/)
          .filter(Boolean);

        if (bulletPoints.length > 1) {
          cards.push(...bulletPoints);
        } else {
          // Split by sentences for paragraph text
          const sentences = section.split(/(?<=[.!?])\s+/).filter(Boolean);

          // Group sentences into digestible chunks
          for (let i = 0; i < sentences.length; i += 2) {
            const chunk = sentences.slice(i, i + 2).join(" ");
            if (chunk.trim()) cards.push(chunk);
          }
        }
      });
    }

    return cards.filter((card) => card.trim().length > 20);
  };

  const flashCards = createFlashCards(report);

  return (
    <div className='space-y-6 pb-6'>
      <div className='flex items-center gap-3 mb-2'>
        <div className='h-1 w-10 bg-gradient-to-r from-purple-500 to-purple-400 rounded'></div>
        <h2 className='text-xl font-semibold text-gray-800'>Key Insights</h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {flashCards.map((content, index) => (
          <Card
            key={index}
            className='overflow-hidden transition-all hover:shadow-md border-l-4 border-l-purple-500 bg-white hover:translate-y-[-2px]'>
            <CardContent className='p-0'>
              <div className='relative p-5'>
                <div className='absolute -top-1 -right-1 w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-400 rounded-bl-lg flex items-center justify-center text-white font-medium shadow-sm'>
                  {index + 1}
                </div>
                <div className='pt-6 pb-2'>
                  <p className='text-gray-700 leading-relaxed'>{content}</p>
                </div>
                <div className='mt-3 pt-3 border-t border-gray-100 flex justify-end'>
                  <span className='text-xs text-purple-300 italic'>
                    Insight {index + 1}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {flashCards.length === 0 && (
        <div className='text-center py-12 text-gray-500'>
          No insights generated yet. Please run the report first.
        </div>
      )}
    </div>
  );
};

export default ReportFlashCards;
