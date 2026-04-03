import React from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { 
  Stethoscope, 
  Microscope, 
  Settings2, 
  ShieldCheck, 
  Home,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    title: "Clinical Consultation",
    desc: "A comprehensive assessment of your medical history and current conditions by Dr. Kanagaraj.",
    icon: <Stethoscope className="w-6 h-6" />,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Diagnostic Micro-Analysis",
    desc: "Utilizing advanced diagnostic tools to analyze skin layers and hair follicle health at a microscopic level.",
    icon: <Microscope className="w-6 h-6" />,
    color: "bg-teal-100 text-teal-600"
  },
  {
    title: "Personalized Roadmap",
    desc: "Designing a data-driven treatment plan tailored to your specific physiological needs and aesthetic goals.",
    icon: <Settings2 className="w-6 h-6" />,
    color: "bg-amber-100 text-amber-600"
  },
  {
    title: "Precision Execution",
    desc: "Implementation of the therapy using globally recognized, US FDA approved clinical technology.",
    icon: <ShieldCheck className="w-6 h-6" />,
    color: "bg-primary/10 text-primary"
  },
  {
    title: "Transformation Support",
    desc: "Ongoing post-treatment care and essential guidance to maximize and maintain clinical results.",
    icon: <Home className="w-6 h-6" />,
    color: "bg-rose-100 text-rose-600"
  }
];

const TreatmentFlowModal = ({ isOpen, onClose, serviceTitle }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card rounded-[2.5rem] border-border p-0 overflow-hidden shadow-2xl">
        <div className="relative">
          {/* Header Image/Background */}
          <div className="h-32 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/5 flex items-center px-8 border-b border-border">
             <div className="flex items-center gap-4">
               <div className="bg-white p-3 rounded-2xl shadow-xl">
                 <ShieldCheck className="w-8 h-8 text-primary" />
               </div>
               <div>
                 <DialogTitle className="text-2xl font-extrabold text-foreground leading-none mb-1">
                   {serviceTitle} Therapy Flow
                 </DialogTitle>
                 <DialogDescription className="text-xs font-bold text-muted-foreground uppercase tracking-widest italic">
                   Professional Clinical Protocol
                 </DialogDescription>
               </div>
             </div>
          </div>

          <div className="p-8 lg:p-10 relative">
            <div className="relative space-y-8">
              {/* Vertical line connecting steps */}
              <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-border -z-0" />

              {steps.map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-6 relative z-10"
                >
                  <div className={`flex-shrink-0 w-14 h-14 rounded-2xl ${step.color} flex items-center justify-center shadow-lg border-4 border-background group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  <div className="pt-2">
                    <h4 className="text-lg font-bold text-foreground mb-1 flex items-center gap-2">
                      {step.title}
                      {index === 3 && <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-tighter">US FDA Technology</span>}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                      {step.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 p-6 bg-muted/50 rounded-[2rem] border border-border flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="bg-green-100 p-2 rounded-full">
                   <CheckCircle2 className="w-5 h-5 text-green-600" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-foreground">Initial Assessment Completed</p>
                   <p className="text-xs text-muted-foreground font-medium">Ready to start journey?</p>
                 </div>
              </div>
              <Button onClick={onClose} className="rounded-full px-6 bg-primary shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                Close Flow
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TreatmentFlowModal;
