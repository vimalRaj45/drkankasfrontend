import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  Scissors, 
  Sparkles, 
  Microscope, 
  Stethoscope, 
  Flower2, 
  ArrowRight,
  ShieldCheck,
  Dna,
  Beaker
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const services = [
  {
    title: "Carbon Laser Peel",
    description: "Effective for pigmentation and skin rejuvenation with immediate visible results.",
    icon: <Zap className="w-8 h-8" />,
    color: "bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-900/30",
    gradient: "from-teal-600 to-teal-400"
  },
  {
    title: "Hair PRP Therapy",
    description: "Advanced Bio-stimulation therapy using growth factors to halt hair loss and boost density.",
    icon: <Dna className="w-8 h-8" />,
    color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30",
    gradient: "from-blue-600 to-blue-400"
  },
  {
    title: "Advanced Hair Transplant",
    description: "Specialized hair restoration techniques for natural and permanent hairline results.",
    icon: <Scissors className="w-8 h-8" />,
    color: "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30",
    gradient: "from-amber-600 to-amber-400"
  },
  {
    title: "Acne & Scar Treatment",
    description: "Complete clinical approach to clear active acne and smooth out deep scars.",
    icon: <Sparkles className="w-8 h-8" />,
    color: "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-900/30",
    gradient: "from-rose-600 to-rose-400"
  },
  {
    title: "Skin Pigmentation",
    description: "Safe laser and medical treatments for melasma, tanning, and dark spots.",
    icon: <Beaker className="w-8 h-8" />,
    color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-900/30",
    gradient: "from-purple-600 to-purple-400"
  },
  {
    title: "Laser Hair Removal",
    description: "US FDA approved pain-free technology for smooth, permanent hair reduction.",
    icon: <Zap className="w-8 h-8" />,
    color: "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30",
    gradient: "from-indigo-600 to-indigo-400"
  }
];

const Services = () => {
  const navigate = useNavigate();

  const handleOpenFlow = (title) => {
    navigate(`/treatment-flow/${encodeURIComponent(title)}`);
  };
  return (
    <section id="services" className="py-14 sm:py-24 bg-background overflow-hidden relative transition-colors duration-500">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-3 sm:mb-4"
          >
            <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Premium Clinical Care</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-4 sm:mb-6"
          >
            Specialized Healthcare <br />
            <span className="text-primary">Services We Provide</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Combining medical expertise with cutting-edge technology to deliver precise, effective results tailored to your unique skin and hair needs.
          </motion.p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="h-full border border-border shadow-xl shadow-slate-200/50 dark:shadow-none bg-card rounded-[2rem] overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-primary/10">
                <CardHeader className="pt-6 sm:pt-10 px-5 sm:px-8 pb-3 sm:pb-4">
                  <div className={`p-3 sm:p-4 rounded-2xl sm:rounded-3xl w-fit mb-4 sm:mb-6 ${service.color} group-hover:scale-110 transition-transform`}>
                    {React.cloneElement(service.icon, { className: "w-6 h-6 sm:w-8 sm:h-8" })}
                  </div>
                  <CardTitle className="text-lg sm:text-2xl font-bold text-foreground mb-2 sm:mb-3 group-hover:text-primary transition-colors">
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 sm:px-8 pb-6 sm:pb-8 flex-grow">
                  <CardDescription className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 font-medium">
                    {service.description}
                  </CardDescription>
                  <Button 
                    variant="link" 
                    className="p-0 h-auto text-primary font-bold gap-2 group/btn decoration-none text-sm"
                    onClick={() => handleOpenFlow(service.title)}
                  >
                    Discovery Therapy
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </CardContent>
                
                {/* Bottom Gradient Accent */}
                <div className={`h-1 w-full bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity ${service.gradient}`} />
              </Card>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="mt-10 sm:mt-16 text-center"
        >
          <Button size="sm" variant="ghost" className="rounded-full text-slate-600 font-bold hover:text-primary hover:bg-white group transition-all text-sm">
            Explore All 15+ Advanced Treatments
            <ArrowRight className="ml-2 w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
          </Button>
        </motion.div>
      </div>

      {/* Background Shapes */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-1/2 bg-[radial-gradient(circle_at_left,rgba(2,132,199,0.03),transparent_40%)] -z-0" />
    </section>
  );
};

export default Services;
