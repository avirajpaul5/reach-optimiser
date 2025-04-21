# REACH OPTIMIZER

A tool to analyze and optimize YouTube video metadata (titles and descriptions) for better SEO and discoverability.

## Features

- Analyze YouTube video titles and descriptions
- Get detailed scoring on SEO factors
- Generate AI-powered optimization recommendations
- View both summary and detailed professional reports
- User authentication with Supabase
- Session history tracking
- Modern UI with flash card report display

## Running the Project

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- YouTube Data API key
- Groq API key
- Supabase account

### Setup and Installation

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

3. Configure environment variables:

   - Copy `.env.example` to `.env` in the root directory
   - Fill in the required API keys and credentials (see below)

4. Start the development server:

```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# YouTube API key - required for fetching related video metadata
# Get one at: https://console.cloud.google.com/apis/dashboard
VITE_YOUTUBE_API_KEY=your_youtube_api_key_here

# Groq API key - required for AI-generated reports
# Get one at: https://console.groq.com/keys
VITE_GROQ_API_KEY=your_groq_api_key_here

# Supabase credentials - required for authentication and storing user data
# Get them at: https://supabase.com/dashboard
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

## Supabase Setup

1. Create a new project:

   - Go to [Supabase](https://supabase.com) and sign up/log in
   - Click "New project" and follow the setup wizard
   - Take note of your project URL and anon key (visible under Project Settings → API)

2. Enable Authentication:

   - Navigate to Authentication → Providers in your Supabase dashboard
   - Enable Email/Password authentication (and any other providers you wish to use)
   - Configure any additional settings like email templates if desired

3. Set up the database:
   - Go to the SQL Editor in your Supabase dashboard
   - Create a new query and paste the following SQL:

```sql
create table public.session_history (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text not null,
  analysis_result jsonb not null,
  report text,
  created_at timestamp with time zone default now() not null
);

-- Set up RLS (Row Level Security)
alter table public.session_history enable row level security;

-- Create policy to allow users to read only their own sessions
create policy "Users can view their own sessions"
  on public.session_history
  for select
  using (auth.uid() = user_id);

-- Create policy to allow users to insert their own sessions
create policy "Users can insert their own sessions"
  on public.session_history
  for insert
  with check (auth.uid() = user_id);
```

4. Update your environment variables:
   - Add your Supabase URL and anon key to your `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

### Building for Production

```bash
npm run build
```

The output will be in the `dist` directory, which can be deployed to any static hosting service.

## Getting API Keys

### YouTube API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the YouTube Data API v3
4. Create credentials for an API key
5. Copy the key to your `.env` file

### Groq API Key

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

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Authentication & Database**: Supabase
- **API Integration**:
  - YouTube Data API v3 for competitive analysis
  - Groq AI API with Llama 3.1 70B for intelligent report generation
- **Build Tool**: Vite

## Project Structure

```
youtube-metadata-optimizer/
├── public/               # Static assets
├── src/                  # Source files
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
├── .env                  # Environment variables (not committed)
├── .env.example          # Example environment variables
├── package.json          # Project dependencies
└── README.md             # Project documentation
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

## Troubleshooting

- **Authentication Issues**: Ensure your Supabase credentials are correct and that you've enabled the Email/Password provider
- **API Errors**: Verify that your YouTube and Groq API keys are valid and have the necessary permissions
- **Database Errors**: Check that you've created the `session_history` table with the correct schema and RLS policies

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [YouTube Data API](https://developers.google.com/youtube/v3)
- [Groq AI](https://groq.com/)
- [Supabase](https://supabase.com/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
