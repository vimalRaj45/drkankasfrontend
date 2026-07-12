import React, { useState } from "react";

const LazyImage = ({ 
  src, 
  alt = "", 
  className = "", 
  imgClassName = "", 
  loading = "lazy", 
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden w-full h-full ${className}`}>
      {/* Skeleton Loading Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 animate-pulse" />
      )}
      
      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setIsLoaded(true)}
        className={`transition-opacity duration-500 ease-in-out ${imgClassName} ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        {...props}
      />
    </div>
  );
};

export default LazyImage;
