import React from "react";
import { Fingerprint, AlertCircle, CheckCircle2, Info } from "lucide-react";

interface RecommendationCardsProps {
  recommendations: {
    title: { priority: string; message: string }[];
    description: { priority: string; message: string }[];
  };
}

const RecommendationCards: React.FC<RecommendationCardsProps> = ({
  recommendations,
}) => {
  // Combine title and description recommendations and sort by priority
  const allRecommendations = [
    ...recommendations.title.map((rec) => ({ ...rec, type: "title" })),
    ...recommendations.description.map((rec) => ({
      ...rec,
      type: "description",
    })),
  ].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return (
      priorityOrder[a.priority as keyof typeof priorityOrder] -
      priorityOrder[b.priority as keyof typeof priorityOrder]
    );
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className='h-4 w-4 text-red-600' />;
      case "medium":
        return <Info className='h-4 w-4 text-yellow-600' />;
      case "low":
        return <CheckCircle2 className='h-4 w-4 text-blue-600' />;
      default:
        return null;
    }
  };

  const getPriorityColor = (
    priority: string,
    element: "bg" | "text" | "border",
  ) => {
    switch (priority) {
      case "high":
        return element === "bg"
          ? "from-red-50 to-pink-50"
          : element === "text"
          ? "text-red-600"
          : "border-red-200";
      case "medium":
        return element === "bg"
          ? "from-yellow-50 to-amber-50"
          : element === "text"
          ? "text-yellow-600"
          : "border-yellow-200";
      case "low":
        return element === "bg"
          ? "from-blue-50 to-indigo-50"
          : element === "text"
          ? "text-blue-600"
          : "border-blue-200";
      default:
        return "";
    }
  };

  return (
    <div className='space-y-4 mb-6'>
      <div className='flex items-center gap-2 mb-2'>
        <Fingerprint className='h-5 w-5 text-gray-700' />
        <h2 className='text-lg font-bold text-gray-700'>
          Improvement Suggestions
        </h2>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {allRecommendations.map((rec, index) => (
          <div
            key={index}
            className={`rounded-xl shadow-md overflow-hidden border ${getPriorityColor(
              rec.priority,
              "border",
            )} bg-gradient-to-br ${getPriorityColor(rec.priority, "bg")}`}>
            <div className='p-4'>
              <div className='flex justify-between items-start mb-3'>
                <div className='flex items-center'>
                  {getPriorityIcon(rec.priority)}
                  <span
                    className={`ml-2 text-sm font-medium uppercase ${getPriorityColor(
                      rec.priority,
                      "text",
                    )}`}>
                    {rec.priority} priority
                  </span>
                </div>
                <span className='text-xs font-medium text-gray-500 px-2 py-1 bg-white rounded-full'>
                  {rec.type === "title" ? "Title" : "Description"}
                </span>
              </div>

              <p className='text-gray-700'>{rec.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendationCards;
