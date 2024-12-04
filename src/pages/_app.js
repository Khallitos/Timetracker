import React from "react";
import { AppProvider } from "../context/AppContext";
import Navbar from "../components/Navbar";
import "../styles/globals.css";
import Footer from "@/components/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Ensure this import is correct
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID; // Ensure this is set in your .env file

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
