import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Missing Supabase credentials. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.",
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for user sessions
export interface SessionHistory {
  id: string;
  user_id: string;
  title: string;
  description: string;
  analysis_result: any; // Analysis results
  report: string | null; // Generated report
  created_at: string;
}

// Function to save session to Supabase
export const saveSession = async (
  userId: string,
  title: string,
  description: string,
  analysisResult: any,
  report: string | null,
) => {
  try {
    const { data, error } = await supabase
      .from("session_history")
      .insert([
        {
          user_id: userId,
          title,
          description,
          analysis_result: analysisResult,
          report,
        },
      ])
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error saving session:", error);
    throw error;
  }
};

// Function to get user's session history
export const getUserSessions = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("session_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data as SessionHistory[];
  } catch (error) {
    console.error("Error fetching sessions:", error);
    return [];
  }
};

// Function to get a specific session
export const getSession = async (sessionId: string) => {
  try {
    const { data, error } = await supabase
      .from("session_history")
      .select("*")
      .eq("id", sessionId)
      .single();

    if (error) throw error;
    return data as SessionHistory;
  } catch (error) {
    console.error("Error fetching session:", error);
    throw error;
  }
};
