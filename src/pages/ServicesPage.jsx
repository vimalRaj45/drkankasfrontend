import React, { useEffect } from "react";
import Services from "../components/Services";
import { motion } from "framer-motion";

const ServicesPage = () => {
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
        <h1 className="text-4xl md:text-6xl font-black text-center mb-12 tracking-tight text-foreground">
          Our Speciality <span className="text-primary italic">Services</span>_
        </h1>
      </div>
      <Services />
    </motion.main>
  );
};

export default ServicesPage;
