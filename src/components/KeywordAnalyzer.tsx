import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { AlertCircle, Loader, Hash, Type, BarChart2, Fingerprint, Award } from "lucide-react"
import { analyzeMetadata } from "../utils/keywordAnalyzer"
import { useYouTubeData } from '../hooks/useYouTubeData'

type UserInput = {
  title: string
  description: string
}

const KeywordAnalyzer: React.FC = () => {
  const [userInput, setUserInput] = useState<UserInput>({
    title: "",
    description: "",
  })

  const [analysis, setAnalysis] = useState<any>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Initialize YouTube data hook
  const { fetchData, isLoading: isLoadingYT, error: ytError } =
    useYouTubeData(import.meta.env.VITE_YOUTUBE_API_KEY || '');

  const simulateProgress = () => {
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 20
      })
    }, 300)
    return interval
  }

  const handleAnalyze = async () => {
    setIsProcessing(true)
    const progressInterval = simulateProgress()

    try {
      // Fetch YouTube data
      const youtubeData = await fetchData(userInput.title, userInput.description);

      // Use the fetched data for analysis
      const result = await analyzeMetadata(userInput, youtubeData)
      setAnalysis(result)
    } catch (error) {
      console.error('Analysis failed:', error)
      // You might want to show an error message to the user here
    } finally {
      clearInterval(progressInterval)
      setProgress(100)
      setTimeout(() => {
        setIsProcessing(false)
        setProgress(0)
      }, 300)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  // Show error message if YouTube API fails
  if (ytError) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <span>Failed to connect to YouTube API. Please check your API key and try again.</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>YouTube Metadata Optimizer v1</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="block font-medium">Video Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              value={userInput.title}
              onChange={(e) => setUserInput((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your video title"
            />
          </div>

          <div className="space-y-2">
            <label className="block font-medium">Video Description</label>
            <textarea
              className="w-full p-2 border rounded h-32"
              value={userInput.description}
              onChange={(e) => setUserInput((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Enter your video description"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={isProcessing || isLoadingYT || !userInput.title.trim() || !userInput.description.trim()}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {(isProcessing || isLoadingYT) ? (
              <div className="flex items-center justify-center gap-2">
                <Loader className="w-4 h-4 animate-spin" />
                <span>Processing... {progress}%</span>
              </div>
            ) : (
              "Analyze Metadata"
            )}
          </button>

          {(isProcessing || isLoadingYT) && (
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {analysis && (
        <>
          {/* Overall Scores Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                Overall Performance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.scores.title)}`}>
                    {analysis.scores.title.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Title Score</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.scores.description)}`}>
                    {analysis.scores.description.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Description Score</div>
                </div>
                <div className="text-center">
                  <div className={`text-3xl font-bold ${getScoreColor(analysis.scores.overall)}`}>
                    {analysis.scores.overall.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600">Overall Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Title Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Title Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Keyword Relevance</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${analysis.factors.title.keywordRelevance}%` }}
                      />
                    </div>
                    <span className="text-sm">{analysis.factors.title.keywordRelevance.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Keyword Placement</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${analysis.factors.title.keywordPlacement}%` }}
                      />
                    </div>
                    <span className="text-sm">{analysis.factors.title.keywordPlacement.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Length Score</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${analysis.factors.title.lengthScore}%` }}
                      />
                    </div>
                    <span className="text-sm">{analysis.factors.title.lengthScore.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Uniqueness Score</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${analysis.factors.title.uniquenessScore}%` }}
                      />
                    </div>
                    <span className="text-sm">{analysis.factors.title.uniquenessScore.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Description Analysis Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5" />
                Description Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Keyword Coverage</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${analysis.factors.description.keywordCoverage}%` }}
                      />
                    </div>
                    <span className="text-sm">{analysis.factors.description.keywordCoverage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Keyword Placement</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${analysis.factors.description.keywordPlacement}%` }}
                      />
                    </div>
                    <span className="text-sm">{analysis.factors.description.keywordPlacement.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Length Score</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${analysis.factors.description.lengthScore}%` }}
                      />
                    </div>
                    <span className="text-sm">{analysis.factors.description.lengthScore.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">CTA Score</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${analysis.factors.description.ctaScore}%` }}
                      />
                    </div>
                    <span className="text-sm">{analysis.factors.description.ctaScore.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Hashtag Usage</div>
                  <div className="flex items-center gap-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${analysis.factors.description.hashtagScore}%` }}
                      />
                    </div>
                    <span className="text-sm">{analysis.factors.description.hashtagScore.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Fingerprint className="w-5 h-5" />
                Optimization Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Title Improvements</h3>
                  <div className="space-y-2">
                    {analysis.recommendations.title.map((rec: any, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <AlertCircle className={`w-4 h-4 mt-0.5 ${rec.priority === 'high' ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                        <span>{rec.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Description Improvements</h3>
                  <div className="space-y-2">
                    {analysis.recommendations.description.map((rec: any, index: number) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <AlertCircle className={`w-4 h-4 mt-0.5 ${rec.priority === 'high' ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                        <span>{rec.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Trending Keywords Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="w-5 h-5" />
                Trending Keywords
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.topKeywords.map((keyword: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default KeywordAnalyzer