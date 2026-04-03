import React from "react";
import { motion } from "framer-motion";

export const SectionHeading = ({ title, subtitle, centered = true }) => {
  return (
    <div className={`mb-12 sm:mb-20 ${centered ? "text-center" : "text-left"}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className={`inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4 ${centered ? "mx-auto" : ""}`}>
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{subtitle}</span>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
          {title.split(' ').map((word, i) => (
            <span key={i}>
              {i === title.split(' ').length - 1 ? (
                <span className="text-primary italic underline decoration-primary/10 underline-offset-8">
                  {word}
                </span>
              ) : (
                word + ' '
              )}
            </span>
          ))}
        </h2>
        
        <div className={`mt-6 h-1.5 w-24 bg-gradient-to-r from-primary to-secondary rounded-full ${centered ? "mx-auto" : ""}`} />
      </motion.div>
    </div>
  );
};

export default SectionHeading;
