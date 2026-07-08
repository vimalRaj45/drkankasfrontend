// components/About.jsx - Fixed spacing
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading.jsx";
import { Award, BookOpen, Heart, Users, GraduationCap, Microscope, BadgeCheck, Stethoscope } from "lucide-react";
const doctorImg = "/dr_kanakaraj_crossed_arms.png";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Patients" },
  { icon: Award, value: "13+", label: "Years Experience" },
  { icon: BookOpen, value: "50+", label: "Publications" },
  { icon: Heart, value: "98%", label: "Patient Satisfaction" },
];

const qualifications = [
  { icon: GraduationCap, title: "MBBS", desc: "Bachelor of Medicine & Surgery" },
  { icon: Microscope, title: "MD (DVL)", desc: "Doctorate in Dermatology" },
  { icon: BadgeCheck, title: "Fellowship", desc: "Advanced Cosmetology" },
  { icon: Stethoscope, title: "Certified", desc: "Laser & Aesthetic Medicine" },
];

const About = () => (
  <div>
    {/* Hero - Removed pt-24, adjusted py spacing */}
    <section className="py-16 md:py-20 bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10 dark:via-background dark:to-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div {...fadeUp}>
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium mb-4">
              About the Doctor
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 text-foreground">
              Dr. (Major) R. Kanagaraj <span className="text-gradient">MBBS., MD (DVL)</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With over 13 years of dedicated experience in dermatology, Dr. (Major) R. Kanagaraj is one of India's most trusted skin, hair, and cosmetology specialists. His patient-first approach combines cutting-edge treatments with compassionate care.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Specializing in both medical and cosmetic dermatology, he has helped thousands of patients achieve healthier, more confident skin through personalized treatment plans.
            </p>
            
            {/* Qualifications Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4">
              {qualifications.map((qual, i) => (
                <motion.div
                  key={qual.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                >
                  <qual.icon size={18} className="text-primary shrink-0" />
                  <div>
                    <p className="font-semibold text-xs text-foreground">{qual.title}</p>
                    <p className="text-[10px] text-muted-foreground">{qual.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="bg-card/80 dark:bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-border relative w-full max-w-[340px]">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <img 
                src={doctorImg} 
                alt="Dr. Kanagaraj" 
                className="w-full max-w-[280px] sm:max-w-xs rounded-2xl mx-auto relative z-10" 
                width={512} 
                height={640} 
                loading="lazy" 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
    
    {/* Stats */}
    <section className="py-12 sm:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <motion.div 
              key={s.label} 
              {...fadeUp} 
              transition={{ delay: i * 0.1 }} 
              className="bg-card/80 dark:bg-card/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg border border-border"
            >
              <s.icon size={24} className="text-primary mx-auto mb-2 sm:mb-3" />
              <div className="text-xl sm:text-2xl font-display font-extrabold text-foreground">{s.value}</div>
              <div className="text-[10px] sm:text-sm text-muted-foreground font-medium">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Personal Message */}
    <section className="py-20 bg-muted/30 dark:bg-muted/20">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <SectionHeading title="A Message From Dr. (Major) R. Kanagaraj" />
        <motion.div {...fadeUp} className="relative">
          <div className="absolute -top-6 -left-6 text-primary/10 dark:text-primary/20">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H11.017C10.4647 13 10.017 13.4477 10.017 14V19C10.017 20.1046 10.9124 21 12.017 21H14.017Z" />
            </svg>
          </div>
          <blockquote className="bg-card/80 dark:bg-card/50 backdrop-blur-sm rounded-2xl p-8 text-lg italic text-foreground/80 leading-relaxed border border-border">
            "Every patient's skin tells a unique story. My mission is to listen carefully, understand your concerns, and craft a treatment plan that brings out your natural beauty and confidence. Your skin health is my passion."
          </blockquote>
          <div className="absolute -bottom-6 -right-6 text-primary/10 dark:text-primary/20 transform rotate-180">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
              <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H16.017C15.4647 8 15.017 8.44772 15.017 9V12C15.017 12.5523 14.5693 13 14.017 13H11.017C10.4647 13 10.017 13.4477 10.017 14V19C10.017 20.1046 10.9124 21 12.017 21H14.017Z" />
            </svg>
          </div>
        </motion.div>
      </div>
    </section>



    <style>{`
      .text-gradient {
        background: linear-gradient(135deg, #1795B4 0%, #0f6e6b 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    `}</style>
  </div>
);

export default About;