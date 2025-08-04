import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Transcript from "./Pages/Transcript";
import Navbars from "./Components/Navbars";
import Footer from "./Components/Footer";
import Ranklist from "./Pages/Ranklists";
import StudentProfile from "./Pages/StudentProfile";
import About from "./Pages/About";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"
import NotFound from "./Pages/NotFound";


const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout =
    location.pathname === "/" || "/ranklist" 
    location.pathname.startsWith("/studentLogin");

  return (
    <>
      {hideLayout && <Navbars />}
      {children}
      {!hideLayout && <Footer />}
      <Analytics />
      <SpeedInsights />
    </>
  );
};

const App = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/transcriptgenerate"
        element={
          <Layout>
            <Transcript />
          </Layout>
        }
      />
      <Route
        path="/studentProfile"
        element={
          <Layout>
            <StudentProfile />
          </Layout>
        }
      />
      <Route
        path="/studentProfile/:enrollmentNo"
        element={
          <Layout>
            <StudentProfile />
          </Layout>
        }
      />
      <Route
        path="/Ranklist"
        element={
          <Layout>
            <Ranklist />
          </Layout>
        }
      />
      <Route
        path="/About"
        element={
          <Layout>
            <About />
          </Layout>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;