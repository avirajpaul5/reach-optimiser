import React from "react";
import { Card, CardContent } from "./ui/card";
import { Copy, FileText } from "lucide-react";
import { Button } from "./ui/button";
import { useToast } from "../components/ui/use-toast";

interface ImprovementReportCardProps {
  report: string;
  isLoading: boolean;
  error: string | null;
}

const ImprovementReportCard: React.FC<ImprovementReportCardProps> = ({
  report,
  isLoading,
  error,
}) => {
  const { toast } = useToast();

  // Parse the report to extract title and description options
  const parseReport = (reportText: string) => {
    const options = [];

    try {
      // Simple split approach based on the "**Option" pattern
      if (reportText.includes("**Option")) {
        const optionSections = reportText
          .split(/\*\*Option \d+\*\*/g)
          .filter((s) => s.trim());

        // The first part might contain intro text
        let startIndex = 0;
        if (optionSections[0].includes("Here are two optimized")) {
          startIndex = 1;
        }

        for (let i = startIndex; i < optionSections.length; i++) {
          const section = optionSections[i];

          // Try to find Title and Description
          const titleMatch = section.match(/Title Option \d+: (.*?)$/m);
          const descMatch = section.match(/Description Option \d+: ([\s\S]+)$/);

          if (titleMatch && descMatch) {
            options.push({
              number: i + 1 - startIndex,
              title: titleMatch[1].trim(),
              description: descMatch[1].trim(),
            });
          }
        }
      }

      // If that approach fails, try to look for the pattern in the image
      if (options.length === 0) {
        // Handle the format seen in the image
        if (
          reportText.includes("Title Option 1:") &&
          reportText.includes("Description Option 1:")
        ) {
          const lines = reportText.split("\n");
          let currentOption = null;
          let currentSection = null;

          for (const line of lines) {
            if (line.startsWith("Title Option")) {
              // Extract option number
              const optionMatch = line.match(/Title Option (\d+):/);
              if (optionMatch) {
                const optionNumber = optionMatch[1];
                const titleContent = line
                  .replace(/Title Option \d+:/, "")
                  .trim();

                currentOption = {
                  number: optionNumber,
                  title: titleContent,
                  description: "",
                };
                currentSection = "title";
              }
            } else if (line.startsWith("Description Option") && currentOption) {
              // Start of description
              currentSection = "description";
              currentOption.description = line
                .replace(/Description Option \d+:/, "")
                .trim();
            } else if (currentOption && currentSection === "description") {
              // Continue appending to description
              currentOption.description += "\n" + line;
            }

            // When we hit the next title or end, add the current option
            if (
              (line.startsWith("Title Option") || line === "") &&
              currentOption &&
              currentOption.title &&
              currentOption.number
            ) {
              if (currentOption.description) {
                options.push({ ...currentOption });
                if (line === "") {
                  currentOption = null;
                }
              }
            }
          }

          // Add the last option if it exists
          if (
            currentOption &&
            currentOption.title &&
            currentOption.description
          ) {
            options.push(currentOption);
          }
        }
      }

      // Special handling for the format in the image
      if (options.length === 0) {
        console.log("Trying special handling for image format");
        // This tries to match the exact format shown in the screenshot
        if (
          reportText.includes("**Option 1**") &&
          reportText.includes("Title Option 1:")
        ) {
          const optionSections = reportText
            .split(/\*\*Option \d+\*\*/g)
            .filter((s) => s.trim());

          for (let i = 0; i < optionSections.length; i++) {
            const section = optionSections[i];
            if (!section.includes("Title Option")) continue;

            const lines = section.split("\n").filter((l) => l.trim());
            let titleLine = "";
            let descLine = "";

            for (const line of lines) {
              if (line.includes("Title Option")) {
                titleLine = line
                  .replace("Title Option", "")
                  .replace(/\d+:/, "")
                  .trim();
              } else if (line.includes("Description Option")) {
                descLine = line
                  .replace("Description Option", "")
                  .replace(/\d+:/, "")
                  .trim();
                // For multi-line descriptions, include the rest
                const descIndex = lines.indexOf(line);
                if (descIndex < lines.length - 1) {
                  descLine += "\n" + lines.slice(descIndex + 1).join("\n");
                }
                break;
              }
            }

            if (titleLine && descLine) {
              options.push({
                number: i + 1,
                title: titleLine,
                description: descLine,
              });
            }
          }
        }
      }

      // Last resort: Just display the whole text as one option
      if (options.length === 0 && reportText.trim()) {
        options.push({
          number: "1",
          title: "Generated Title",
          description: reportText.trim(),
        });
      }
    } catch (error) {
      console.error("Error parsing report:", error);
      // Fallback to showing the whole report
      if (reportText.trim()) {
        options.push({
          number: "1",
          title: "Error parsing report",
          description: reportText.trim(),
        });
      }
    }

    return options;
  };

  const handleCopy = async (text: string, type: string) => {
    try {
      // Try the modern Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        toast({
          title: `${type} copied to clipboard`,
          description: "You can now paste it wherever you need",
          duration: 3000,
        });
      } else {
        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);

        if (successful) {
          toast({
            title: `${type} copied to clipboard`,
            description: "You can now paste it wherever you need",
            duration: 3000,
          });
        } else {
          console.error("Fallback clipboard copy failed");
          toast({
            title: "Copy failed",
            description: "Please try selecting and copying the text manually",
            duration: 5000,
          });
        }
      }
    } catch (err) {
      console.error("Error copying to clipboard:", err);
      toast({
        title: "Copy failed",
        description: "Please try selecting and copying the text manually",
        duration: 5000,
      });
    }
  };

  if (!report) return null;

  const options = parseReport(report);

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-2 mb-2'>
        <FileText className='w-5 h-5 text-orange-600' />
        <h2 className='text-xl font-semibold text-gray-800'>
          Improvement Report
        </h2>
      </div>

      {options.length > 0 ? (
        <>
          <p className='text-gray-700 mb-4 text-left'>
            Here are optimized title and description pairs that incorporate all
            the provided recommendations, keywords, and best practices:
          </p>

          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {options.map((option, index) => (
              <Card
                key={index}
                className='overflow-hidden border-orange-100 bg-gradient-to-br from-orange-50 to-white shadow-sm hover:shadow-md transition-all'>
                <CardContent className='p-0'>
                  <div className='p-4 border-b border-orange-100'>
                    <div className='flex justify-between items-center mb-1'>
                      <span className='text-sm font-medium text-orange-700'>
                        Option {option.number}
                      </span>
                    </div>

                    <div className='mt-3 space-y-4'>
                      <div className='space-y-2'>
                        <div className='flex justify-between items-start'>
                          <h3 className='font-semibold text-gray-700 text-left'>
                            Title
                          </h3>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 px-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                            onClick={() => handleCopy(option.title, "Title")}>
                            <Copy className='h-4 w-4 mr-1' />
                            <span>Copy</span>
                          </Button>
                        </div>
                        <p className='text-gray-800 text-left'>
                          {option.title}
                        </p>
                      </div>

                      <div className='space-y-2'>
                        <div className='flex justify-between items-start'>
                          <h3 className='font-semibold text-gray-700 text-left'>
                            Description
                          </h3>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='h-8 px-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                            onClick={() =>
                              handleCopy(option.description, "Description")
                            }>
                            <Copy className='h-4 w-4 mr-1' />
                            <span>Copy</span>
                          </Button>
                        </div>
                        <p className='text-gray-800 text-left whitespace-pre-line'>
                          {option.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <div className='space-y-4'>
          <div className='p-4 bg-yellow-50 rounded-lg text-center border border-yellow-200'>
            <p className='text-yellow-700 mb-2'>
              Unable to parse the report into title and description sections.
            </p>
            <p className='text-yellow-600 text-sm'>
              Showing raw report content below:
            </p>
          </div>

          <Card className='overflow-hidden border-orange-100 shadow-sm'>
            <CardContent className='p-4'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='font-semibold text-gray-700'>
                  Raw Report Content
                </h3>
                <Button
                  variant='ghost'
                  size='sm'
                  className='h-8 px-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50'
                  onClick={() => handleCopy(report, "Report")}>
                  <Copy className='h-4 w-4 mr-1' />
                  <span>Copy All</span>
                </Button>
              </div>
              <div className='p-4 bg-gray-50 rounded-lg whitespace-pre-line text-left text-gray-800'>
                {report}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ImprovementReportCard;
