import React, { createContext, useContext } from "react";
import KeywordAnalyzer from "./components/KeywordAnalyzer";
import { AuthProvider, useAuth } from "./components/AuthProvider";
import AuthForm from "./components/AuthForm";
import BgGradient from "./components/ui/BgGradient";

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

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
      </div>
    );
  }

  return user ? <KeywordAnalyzer /> : <AuthForm />;
};

function App() {
  return (
    <BgGradient>
      <AuthProvider>
        <ApiKeysProvider>
          <AppContent />
        </ApiKeysProvider>
      </AuthProvider>
    </BgGradient>
  );
}

export default App;
