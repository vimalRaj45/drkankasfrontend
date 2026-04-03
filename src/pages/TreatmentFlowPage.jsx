import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Stethoscope, 
  Microscope, 
  Settings2, 
  ShieldCheck, 
  Home,
  CheckCircle2,
  Sparkles,
  Zap,
  Scissors, // For Hair Transplant
  Dna,     // For PRP
  Beaker   // For Pigmentation
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Clinical Consultation",
    desc: "A comprehensive assessment of your medical history and current conditions by Dr. Kanagaraj.",
    icon: <Stethoscope className="w-8 h-8" />,
    color: "bg-blue-100 text-blue-600 border-blue-200"
  },
  {
    title: "Diagnostic Micro-Analysis",
    desc: "Utilizing advanced diagnostic tools to analyze skin layers and hair follicle health at a microscopic level.",
    icon: <Microscope className="w-8 h-8" />,
    color: "bg-teal-100 text-teal-600 border-teal-200"
  },
  {
    title: "Personalized Roadmap",
    desc: "Designing a data-driven treatment plan tailored to your specific physiological needs and aesthetic goals.",
    icon: <Settings2 className="w-8 h-8" />,
    color: "bg-amber-100 text-amber-600 border-amber-200"
  },
  {
    title: "Precision Execution",
    desc: "Implementation of the therapy using globally recognized, US FDA approved clinical technology.",
    icon: <ShieldCheck className="w-8 h-8" />,
    color: "bg-primary/10 text-primary border-primary/20"
  },
  {
    title: "Transformation Support",
    desc: "Ongoing post-treatment care and essential guidance to maximize and maintain clinical results.",
    icon: <Home className="w-8 h-8" />,
    color: "bg-rose-100 text-rose-600 border-rose-200"
  }
];

const TreatmentFlowPage = () => {
  const { serviceName } = useParams();
  const navigate = useNavigate();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const decodedServiceName = decodeURIComponent(serviceName || "Clinical");

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header Section */}
      <section className="relative pt-32 pb-20 bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.1),transparent_50%)]" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Button 
                variant="ghost" 
                className="text-white hover:text-primary mb-8 rounded-full border border-white/10 hover:bg-white/5 pr-6"
                onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 w-5 h-5" />
              Back to Services
            </Button>
          </motion.div>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 bg-primary/20 text-primary rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-primary/30">
                Patient Clinical Journey
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
                Discovery Therapy: <br />
                <span className="text-primary italic underline underline-offset-8 decoration-primary/20">{decodedServiceName}</span>
              </h1>
              <p className="text-xl text-slate-400 max-w-2xl font-medium leading-relaxed italic">
                Experience a scientifically-driven clinical protocol designed for maximum transparency and results.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Flow Section */}
      <section className="py-24 container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-16 relative">
            
            {/* Left side: Flow Visualization */}
            <div className="lg:col-span-12 space-y-12 relative">
               {/* Vertical desktop line */}
               <div className="absolute left-10 top-12 bottom-12 w-1 bg-muted rounded-full lg:block hidden" />

               {steps.map((step, index) => (
                 <motion.div
                   key={step.title}
                   initial={{ opacity: 0, y: 40 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: index * 0.15, duration: 0.8 }}
                   className="flex flex-col md:flex-row gap-8 md:gap-16 items-start group"
                 >
                   {/* Step Number/Icon Circle */}
                   <div className="relative z-10 flex-shrink-0">
                      <div className={`w-20 h-20 rounded-[2.5rem] ${step.color} shadow-2xl flex items-center justify-center border-4 border-background transition-transform group-hover:scale-110 duration-500`}>
                        {step.icon}
                      </div>
                      <div className="absolute -top-3 -right-3 w-10 h-10 bg-slate-900 border-4 border-background rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg">
                        0{index + 1}
                      </div>
                   </div>

                   {/* Step Content Card */}
                   <div className="flex-grow pt-4">
                      <div className="space-y-4 max-w-3xl">
                        <div className="flex items-center gap-3">
                          <h3 className="text-3xl font-extrabold text-foreground tracking-tight group-hover:text-primary transition-colors">
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-xl text-muted-foreground leading-relaxed font-medium">
                          {step.desc}
                        </p>
                        
                        {/* Phase Specific Tag */}
                        <div className="flex gap-4 pt-2">
                           {index === 0 && <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-blue-100 italic">Medical Intake</span>}
                           {index === 1 && <span className="text-[10px] bg-teal-50 text-teal-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-teal-100 italic">Micro-Visual Diagnostic</span>}
                           {index === 2 && <span className="text-[10px] bg-amber-50 text-amber-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-amber-100 italic">Protocol Finalization</span>}
                           {index === 3 && <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-primary/20 italic">Active Therapy Phase</span>}
                           {index === 4 && <span className="text-[10px] bg-rose-50 text-rose-600 px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-rose-100 italic">Result Preservation</span>}
                        </div>
                      </div>
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>

          {/* Call to Action Footer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-32 p-10 md:p-20 bg-primary rounded-[3.5rem] shadow-2xl shadow-primary/30 text-white relative overflow-hidden text-center group"
          >
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[80px] -z-0" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
               <Sparkles className="w-12 h-12 text-white/50 mx-auto mb-8 animate-pulse" />
               <h2 className="text-4xl md:text-5xl font-extrabold mb-8 leading-tight">Ready to Begin Your Transformation?</h2>
               <p className="text-white/80 text-lg font-medium mb-12 italic leading-relaxed">
                 Every great clinical outcome starts with the first step of consultation. Connect with Dr. Kanagaraj today.
               </p>
               <div className="flex flex-wrap justify-center gap-6">
                 <Button onClick={() => navigate('/book')} size="lg" className="h-16 px-10 rounded-2xl bg-white text-primary hover:bg-white/90 font-bold text-lg shadow-xl shadow-black/5">
                   Request Priority Booking
                 </Button>
                 <Button onClick={() => navigate(-1)} size="lg" variant="ghost" className="h-16 px-10 rounded-2xl border-2 border-white/20 text-white hover:bg-white/10 font-bold text-lg">
                   Explore More Services
                 </Button>
               </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default TreatmentFlowPage;
