import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Home from "./Home";
import About from "./About";

const App = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          exact
          path="/"
          element={
            <RouteContainer>
              <Home />
            </RouteContainer>
          }
        />
        <Route
          exact
          path="/about"
          element={
            <RouteContainer>
              <About />
            </RouteContainer>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

const pageVariants = {
  initial: {
    opacity: 0,
    y: "100%",
  },
  enter: {
    opacity: 1,
    y: "0%",
  },
  exit: {
    opacity: 0,
    y: "-100%",
  },
};

const RouteContainer = ({ children }) => (
  <motion.div
    initial="initial"
    animate="enter"
    exit="exit"
    variants={pageVariants}
  >
    {children}
  </motion.div>
);

export default App;
