import React, { createContext, useContext } from "react";
import KeywordAnalyzer from "./components/KeywordAnalyzer";

interface ApiKeys {
  youtubeApiKey: string;
  groqApiKey: string;
}

const ApiKeysContext = createContext<ApiKeys>({
  youtubeApiKey: "",
  groqApiKey: "",
});

export const useApiKeys = () => useContext(ApiKeysContext);

const ApiKeysProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const apiKeys: ApiKeys = {
    youtubeApiKey: import.meta.env.VITE_YOUTUBE_API_KEY || "",
    groqApiKey: import.meta.env.VITE_GROQ_API_KEY || "",
  };

  return (
    <ApiKeysContext.Provider value={apiKeys}>
      {children}
    </ApiKeysContext.Provider>
  );
};

function App() {
  return (
    <div className='min-h-screen bg-gray-100'>
      <ApiKeysProvider>
        <KeywordAnalyzer />
      </ApiKeysProvider>
    </div>
  );
}

export default App;
