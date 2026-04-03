import React, { useEffect } from "react";
import Contact from "../components/Contact";
import { motion } from "framer-motion";

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 pb-20"
    >
      <div className="container mx-auto px-4 pt-12">
        <h1 className="text-4xl md:text-6xl font-black text-center mb-4 tracking-tight text-foreground">
          Reach <span className="text-primary italic">Dr. Kanak's</span>_
        </h1>
        <p className="text-center text-muted-foreground font-medium mb-12">
          We're here to assist you with your clinical health and aesthetic journey.
        </p>
      </div>
      <Contact />
    </motion.main>
  );
};

export default ContactPage;
