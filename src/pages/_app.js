import React from "react";
import { AppProvider } from "../context/AppContext";
import Navbar from "../components/Navbar";
import "../styles/globalS.css";
import Footer from "@/components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";

function MyApp({ Component, pageProps }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <AppProvider>
          <Navbar />
          <Component {...pageProps} />
          <Footer />
          <ToastContainer />
        </AppProvider>
      </GoogleOAuthProvider>
    </>
  );
}

export default MyApp;
