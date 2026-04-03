import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Star, 
  ShieldCheck, 
  ThumbsUp, 
  ThumbsDown,
  X,
  ExternalLink,
  Send,
  Sparkles,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Quote,
  Heart
} from "lucide-react";

// PrimeReact Components
import { Dialog } from 'primereact/dialog';
import { Rating } from 'primereact/rating';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Tag } from 'primereact/tag';
import toast from 'react-hot-toast';
import { submitGoogleFeedback } from '../services/api';

import 'primereact/resources/themes/lara-dark-blue/theme.css';
import 'primereact/resources/primereact.min.css';

const Testimonials = () => {
  const primeToast = useRef(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackName, setFeedbackName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1); // 1: Rating, 2: Feedback/Redirect
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Sync with global theme
    const checkTheme = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };
    checkTheme();
    
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Ensure Common Ninja re-triggers if needed (some versions of the SDK require this)
    if (window.CommonNinja && typeof window.CommonNinja.reload === 'function') {
      window.CommonNinja.reload();
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handlePositiveFeedback = () => {
    const googleReviewUrl = "https://www.google.com/maps/place/Dr+Kanaks+Skin+Hair+%26+Cosmetology+Clinic/@11.6756687,78.1375675,359m/data=!3m1!1e3!4m8!3m7!1s0x3babf05ad2d9eac9:0x5837334bf668c2d8!8m2!3d11.6755833!4d78.1367078!9m1!1b1!16s%2Fg%2F11gjv748y_?hl=en-IN&entry=ttu&g_ep=EgoyMDI2MDMzMC4wIKXMDSoASAFQAw%3D%3D";

    toast.success('Amazing! Your support means the world to us! ❤️ Please help us grow by sharing your experience on Google.', {
      duration: 4000,
      position: 'top-center',
      className: 'font-bold text-sm bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-primary/20 shadow-2xl rounded-2xl p-6 text-center max-w-md'
    });

    setTimeout(() => {
      window.open(googleReviewUrl, '_blank');
      setShowFeedbackModal(false);
      resetForm();
    }, 3000);
  };

  const handleNegativeFeedback = async () => {
    if (!feedbackText.trim()) {
      toast('Please share your thoughts! ❤️', {
        icon: '📝',
        className: 'font-bold text-sm rounded-2xl'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitGoogleFeedback(feedbackRating, feedbackText, feedbackName);
      
      if (response.success) {
        toast.success('Feedback received safely. Thank you for helping us improve!', {
          duration: 4000,
          position: 'bottom-center',
          className: 'font-bold text-sm rounded-2xl'
        });
        
        setTimeout(() => {
          setShowFeedbackModal(false);
          resetForm();
        }, 2000);
      } else {
        toast.error('System synchronization error. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Connection failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFeedbackRating(null);
    setFeedbackText("");
    setFeedbackName("");
    setIsSubmitting(false);
    setStep(1);
  };

  const handleRatingSelect = (e) => {
    const rating = e.value;
    if (!rating) return;
    
    setFeedbackRating(rating);
    if (rating >= 4) {
      handlePositiveFeedback();
    } else {
      setStep(2);
      setShowFeedbackModal(true);
    }
  };

  return (
    <section id="testimonials" className="py-24 sm:py-40 bg-white dark:bg-slate-950 overflow-hidden relative transition-colors duration-500">
      <Toast ref={primeToast} position="bottom-center" />
      
      {/* Premium Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-40 transition-opacity">
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[5%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[160px] animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] mix-blend-overlay dark:opacity-100 opacity-20" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        
        {/* Floating Header */}
        <div className="flex flex-col items-center text-center mb-16 sm:mb-32">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-6 sm:mb-8"
          >
            <Tag className="bg-primary/20 text-primary border-primary/30 px-6 py-2 rounded-full text-[10px] sm:text-xs font-black tracking-[0.4em] uppercase" value="Verified Clinical Outcomes" />
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-4xl sm:text-7xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter mb-8 sm:mb-10"
          >
            Heartfelt <span className="text-transparent bg-clip-text bg-gradient-to-br from-primary via-blue-500 to-primary italic">Journeys</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl max-w-xl font-medium leading-relaxed px-4"
          >
            Discover why Dr. Kanak is the preferred choice for skincare and hair restoration excellence across Salem.
          </motion.p>
        </div>

        {/* Action Grid - Now at the Top */}
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-10 items-stretch mb-20 sm:mb-32">
          
          {/* Page Card: Left */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group bg-slate-50 dark:bg-slate-900/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-[2rem] sm:rounded-[3.5rem] p-8 sm:p-20 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-12 opacity-5 hidden sm:block">
               <Quote className="w-60 h-60 text-slate-900 dark:text-white" />
            </div>
            
            <div className="relative z-10">
              <div className="bg-primary/20 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center mb-8 sm:mb-12 group-hover:scale-110 transition-transform shadow-lg shadow-primary/10">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 text-primary fill-primary" />
              </div>
              <h3 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-4 sm:mb-6">Let's Hear Your Voice</h3>
              <p className="text-slate-500 dark:text-slate-400 text-lg sm:text-xl font-medium leading-relaxed mb-8 sm:mb-12">
                Your experience helps us maintain the highest standards of safety and efficacy in our Swarnapuri clinic.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-4 mt-auto relative z-10">
               <span className="flex items-center gap-2 text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest bg-white dark:bg-white/5 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                 <ShieldCheck className="w-4 h-4 text-primary" />
                 ISO 9001
               </span>
               <span className="flex items-center gap-2 text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest bg-white dark:bg-white/5 px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm">
                 <CheckCircle2 className="w-4 h-4 text-blue-500" />
                 Certified
               </span>
            </div>
          </motion.div>

          {/* Page Card: Right (Interactive) */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-tr from-primary/10 via-blue-500/5 to-primary/10 backdrop-blur-2xl border border-primary/20 rounded-[2rem] sm:rounded-[3.5rem] p-8 sm:p-20 relative overflow-hidden flex flex-col items-center justify-center text-center group shadow-xl"
          >
            <Sparkles className="absolute top-10 right-10 w-8 h-8 text-yellow-500 opacity-20 group-hover:animate-spin-slow transition-all" />
            
            <h4 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-8 sm:mb-10 tracking-widest uppercase">Quick Clinical Rating</h4>
            
            <div className="flex justify-center items-center py-6 sm:py-10">
              <Rating 
                value={feedbackRating} 
                onChange={handleRatingSelect} 
                cancel={false}
                pt={{
                  onIcon: { className: 'text-yellow-500 fill-yellow-500 text-5xl sm:text-8xl drop-shadow-2xl transition-all' },
                  offIcon: { className: 'text-slate-900 dark:text-white/20 text-5xl sm:text-8xl transition-all' },
                  item: { className: 'mx-1.5 sm:mx-5 hover:scale-110 active:scale-95 transition-all cursor-pointer' }
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Common Ninja Integration - Follows Action Grid */}
        <div className="mb-20 sm:mb-32 relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[2.5rem] sm:rounded-[4rem] blur-3xl opacity-20 pointer-events-none" />
          <div className="relative bg-slate-50 dark:bg-slate-900/60 backdrop-blur-3xl border border-slate-200 dark:border-white/5 rounded-[2rem] sm:rounded-[3.5rem] p-4 sm:p-12 shadow-xl min-h-[400px] overflow-x-hidden">
             <div className="commonninja_component pid-46e44528-7b7e-4e9d-9070-79d0dffba4d4"></div>
          </div>
        </div>

        {/* Immersive Milestone Section */}
        <div className="mt-24 sm:mt-40 pt-20 border-t border-slate-200 dark:border-white/5 flex flex-wrap justify-between gap-12 text-center md:text-left transition-all">
           {[
             { label: "Successful Procedures", val: "25k+", col: "text-primary" },
             { label: "Patient Satisfaction", val: "99.2%", col: "text-blue-500" },
             { label: "Years of Practice", val: "14+", col: "text-slate-900 dark:text-white" },
             { label: "Award Wins", val: "50+", col: "text-primary" }
           ].map((m, i) => (
             <div key={i} className="flex-1 min-w-[200px]">
                <h6 className={`text-5xl sm:text-7xl font-black tracking-tighter ${m.col} mb-2`}>{m.val}</h6>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">{m.label}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Advanced Custom Dialog using requested template structure */}
      <Dialog
        visible={showFeedbackModal}
        modal
        onHide={() => { if (!showFeedbackModal) return; setShowFeedbackModal(false); resetForm(); }}
        content={({ hide }) => (
          <div 
            className="flex flex-col px-8 py-10 gap-6 relative shadow-3xl border border-slate-200 dark:border-white/10 overflow-hidden" 
            style={{ 
              borderRadius: '24px', 
              backgroundImage: isDarkMode 
                ? 'radial-gradient(circle at left top, #0f172a, #1e293b, #020617)' 
                : 'radial-gradient(circle at left top, #ffffff, #f8fafc, #f1f5f9)',
              minWidth: '320px',
              maxWidth: '540px',
              width: '90vw'
            }}
          >
            {/* Floating Glow Effect */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            
            {/* Custom Close Button */}
            <button 
              onClick={(e) => { hide(e); resetForm(); }}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all hover:bg-slate-200 dark:hover:bg-white/10 group z-10"
            >
              <X className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            </button>

            {step === 1 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-6 relative z-0"
              >
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center rotate-6 border border-primary/20 shadow-lg shadow-primary/5">
                   <Star className="w-10 h-10 text-primary fill-primary/20" />
                </div>
                
                <div className="text-center space-y-2">
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Your Experience?</h3>
                  <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed max-w-[280px]">
                    Share your clinical journey with Dr. Kanak's expert team.
                  </p>
                </div>

                <div className="mb-6 sm:mb-10 flex justify-center items-center">
                  <Rating 
                    value={feedbackRating} 
                    onChange={handleRatingSelect} 
                    cancel={false}
                    pt={{
                      onIcon: { className: 'text-yellow-500 fill-yellow-500 text-4xl sm:text-6xl' },
                      offIcon: { className: 'text-slate-900 dark:text-white/20 text-4xl sm:text-6xl' },
                      item: { className: 'mx-1 sm:mx-3 hover:scale-110 transition-transform' }
                    }}
                  />
                </div>
                
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col gap-8 relative z-0"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/5 pb-6">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Tell Us More</h3>
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Confidential Feedback</p>
                  </div>
                  <Tag severity="info" value={`${feedbackRating} Stars`} className="bg-primary/20 text-primary border-none font-black px-4 py-1" />
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest ml-1">Patient Name</label>
                    <InputText 
                      value={feedbackName} 
                      onChange={(e) => setFeedbackName(e.target.value)} 
                      placeholder="Optional name..." 
                      className={`w-full border rounded-2xl h-14 px-6 text-sm font-semibold transition-all outline-none shadow-sm ${isDarkMode ? 'dark:!bg-black/40 border-white/5 !text-white placeholder:text-slate-600' : '!bg-white border-slate-300 !text-slate-900 placeholder:text-slate-400'}`}
                      style={{ 
                        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.4)' : '#ffffff', 
                        color: isDarkMode ? '#ffffff' : '#0f172a' 
                      }}
                    />
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] sm:text-xs font-black text-slate-500 dark:text-slate-500 uppercase tracking-widest ml-1">Comments</label>
                    <InputTextarea 
                      value={feedbackText} 
                      onChange={(e) => setFeedbackText(e.target.value)} 
                      placeholder="Share your experience here..." 
                      rows={5} 
                      className={`w-full border rounded-2xl p-6 text-sm font-semibold transition-all resize-none leading-relaxed outline-none shadow-sm ${isDarkMode ? 'dark:!bg-black/40 border-white/5 !text-white placeholder:text-slate-600' : '!bg-white border-slate-300 !text-slate-900 placeholder:text-slate-400'}`}
                      style={{ 
                        backgroundColor: isDarkMode ? 'rgba(0,0,0,0.4)' : '#ffffff', 
                        color: isDarkMode ? '#ffffff' : '#0f172a' 
                      }}
                    />
                  </div>

                  <div className="flex flex-col gap-4 mt-2">
                    <Button 
                      label={isSubmitting ? "Syncing Patient Data..." : "Submit Review"} 
                      icon={isSubmitting ? "pi pi-spin pi-spinner" : "pi pi-send"}
                      disabled={isSubmitting || !feedbackText.trim()}
                      onClick={handleNegativeFeedback}
                      className="w-full h-16 bg-primary dark:bg-gradient-to-r dark:from-primary dark:to-blue-600 border-none rounded-2xl font-black text-white uppercase text-xs tracking-widest shadow-2xl transition-all hover:scale-[1.01] active:scale-95"
                    />
                    
                    <button 
                      onClick={() => setStep(1)} 
                      className="text-[10px] font-black text-slate-500 dark:text-slate-600 uppercase tracking-widest hover:text-primary dark:hover:text-white transition-colors py-2 flex items-center justify-center gap-2"
                    >
                      <ArrowRight className="w-3 h-3 rotate-180" /> Back to Stars
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      ></Dialog>

      {/* Standard Style Inject (React 18+) */}
      <style dangerouslySetInnerHTML={{ __html: `
        .p-inputtext:enabled:focus {
           box-shadow: 0 0 0 1px var(--primary);
        }
        /* Forced Star Visibility */
        .p-rating .p-rating-item .p-rating-icon {
           color: #000000 !important;
           transition: transform 0.2s ease;
        }
        .dark .p-rating .p-rating-item .p-rating-icon {
           color: rgba(255, 255, 255, 0.2) !important;
        }
        .p-rating .p-rating-item.p-rating-item-active .p-rating-icon {
           color: #eab308 !important;
        }
        .p-dialog-mask {
           backdrop-filter: blur(8px);
        }
      `}} />
    </section>
  );
};

export default Testimonials;