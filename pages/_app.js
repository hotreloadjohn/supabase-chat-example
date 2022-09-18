import "../styles/globals.css";
import { UserProvider } from "@supabase/auth-helpers-react";
import { supabaseClient } from "@supabase/auth-helpers-nextjs";
import { Toaster } from "react-hot-toast";
import ChatContextProvider from "../context/ChatContext";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider supabaseClient={supabaseClient}>
      <ChatContextProvider>
        <Toaster />
        <Component {...pageProps} />
      </ChatContextProvider>
    </UserProvider>
  );
}

export default MyApp;
