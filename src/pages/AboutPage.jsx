// pages/AboutPage.jsx - Removed extra pt-20 since header already has spacing
import React, { useEffect } from "react";
import About from "../components/About";
import WhyChooseUs from "../components/WhyChooseUs";
import PatientCare from "../components/PatientCare";
import { motion } from "framer-motion";

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      // Removed pt-20 to eliminate double spacing
    >
      <About />
      <WhyChooseUs />
      <PatientCare />
    </motion.main>
  );
};

export default AboutPage