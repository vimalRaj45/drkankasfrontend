import React, { useEffect } from "react";
import Profile from "../components/Profile";
import { motion } from "framer-motion";

const ProfilePage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="pt-20 min-h-screen bg-slate-50/50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Profile />
      </motion.div>
    </div>
  );
};

export default ProfilePage;
