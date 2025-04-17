# YouTube Metadata Optimizer

A powerful web application that helps content creators optimize their YouTube video metadata for better discoverability and engagement. The application analyzes your title and description, provides insights and scores, and offers AI-generated improvement reports.

## Features

- **Metadata Analysis**: Analyzes your video title and description for SEO optimization
- **Performance Scoring**: Provides detailed scores on various aspects of your metadata
- **AI-Generated Reports**:
  - Quick Summary: Concise, single-paragraph assessment of content quality with key improvements
  - Detailed Report: Comprehensive analysis with structured sections and professional recommendations
- **YouTube Data Integration**: Compares your metadata against trending content in your niche

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **API Integration**:
  - YouTube Data API v3 for competitive analysis
  - Groq AI API with Llama 3.1 70B for intelligent report generation

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- YouTube Data API key
- Groq API key

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/youtube-metadata-optimizer.git
cd youtube-metadata-optimizer
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory based on `.env.example`:

```
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here
VITE_GROQ_API_KEY=your_groq_api_key_here
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Getting API Keys

#### YouTube API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the YouTube Data API v3
4. Create credentials for an API key
5. Copy the key to your `.env` file

#### Groq API Key

1. Sign up for an account at [Groq](https://console.groq.com/)
2. Navigate to the API keys section
3. Create a new API key
4. Copy the key to your `.env` file

## Usage

1. Enter your video title and description in the input fields
2. Click "Analyze Metadata" to get detailed insights
3. View your performance scores across various factors
4. Generate a quick summary or detailed professional report using AI
5. Implement the recommendations to improve your video's discoverability

## Project Structure

```
youtube-metadata-optimizer/
├── public/
├── src/
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── .env                    # Environment variables (not committed)
├── .env.example            # Example environment variables
├── package.json            # Project dependencies
└── README.md               # Project documentation
```

## Optimization Factors

The application analyzes several factors to determine the quality of your metadata:

### Title Factors

- **Keyword Relevance**: How well your title incorporates important keywords
- **Keyword Placement**: Strategic placement of keywords in your title
- **Length Score**: Optimal title length for YouTube search and display
- **Uniqueness Score**: How your title stands out from similar content

### Description Factors

- **Keyword Coverage**: Inclusion of relevant keywords in your description
- **Keyword Placement**: Strategic placement of keywords in the first 150 characters
- **Length Score**: Optimal description length for engagement
- **CTA Score**: Inclusion of effective calls-to-action
- **Hashtag Score**: Strategic use of hashtags for discoverability

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Groq AI](https://groq.com/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
