// components/About.jsx - Fixed spacing
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading.jsx";
import { Award, BookOpen, Heart, Users, GraduationCap, Microscope, BadgeCheck, Stethoscope, TrendingUp } from "lucide-react";
const doctorImg = "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const timeline = [
  { year: "2005", title: "MBBS Degree", desc: "Graduated with honors in Medicine" },
  { year: "2009", title: "MD in DVL", desc: "Specialized in Dermatology, Venereology & Leprology" },
  { year: "2010", title: "Clinical Practice", desc: "Began independent practice in dermatology" },
  { year: "2015", title: "Advanced Cosmetology", desc: "Certified in laser treatments & cosmetic procedures" },
  { year: "2018", title: "SkinGlow Clinic", desc: "Founded the premium skin care clinic" },
  { year: "2024", title: "10K+ Patients", desc: "Milestone of trusted patient care" },
];

const stats = [
  { icon: Users, value: "10,000+", label: "Happy Patients" },
  { icon: Award, value: "15+", label: "Years Experience" },
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
              Dr. Kanakaraj <span className="text-gradient">MBBS., MD (DVL)</span>
            </h1>
            <p className="text-muted-foreground leading-relaxed mb-6">
              With over 15 years of dedicated experience in dermatology, Dr. Kanakaraj is one of India's most trusted skin, hair, and cosmetology specialists. His patient-first approach combines cutting-edge treatments with compassionate care.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Specializing in both medical and cosmetic dermatology, he has helped thousands of patients achieve healthier, more confident skin through personalized treatment plans.
            </p>
            
            {/* Qualifications Grid */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {qualifications.map((qual, i) => (
                <motion.div
                  key={qual.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2 p-2 rounded-lg bg-primary/5 dark:bg-primary/10 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                >
                  <qual.icon size={16} className="text-primary shrink-0" />
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
            <div className="bg-card/80 dark:bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-border relative">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
              <img 
                src={doctorImg} 
                alt="Dr. Kanakaraj" 
                className="w-80 rounded-2xl mx-auto relative z-10" 
                width={512} 
                height={640} 
                loading="lazy" 
              />
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-background/90 dark:bg-background/95 backdrop-blur-md rounded-full px-4 py-2 text-primary font-bold text-xs shadow-lg whitespace-nowrap border border-border">
                <BadgeCheck size={12} className="inline mr-1" /> Board Certified
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div 
              key={s.label} 
              {...fadeUp} 
              transition={{ delay: i * 0.1 }} 
              className="bg-card/80 dark:bg-card/50 backdrop-blur-sm rounded-2xl p-6 text-center transition-all hover:-translate-y-1 hover:shadow-lg border border-border"
            >
              <s.icon size={28} className="text-primary mx-auto mb-3" />
              <div className="text-2xl font-display font-bold text-foreground">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Personal Message */}
    <section className="py-20 bg-muted/30 dark:bg-muted/20">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <SectionHeading title="A Message From Dr. Kanakaraj" />
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

    {/* Timeline */}
    <section className="py-20 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        <SectionHeading title="Career Journey" subtitle="A timeline of dedication and excellence" />
        <div className="relative mt-12">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/30 via-primary to-primary/30" />
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className={`relative flex items-start gap-6 mb-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
            >
              <div className="hidden md:block md:w-1/2" />
              <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary border-2 border-background z-10 mt-2" />
              <div className="ml-10 md:ml-0 md:w-1/2 bg-card/80 dark:bg-card/50 backdrop-blur-sm rounded-xl p-5 transition-all hover:-translate-y-1 hover:shadow-lg border border-border">
                <span className="text-xs text-primary font-semibold">{item.year}</span>
                <h3 className="font-display font-semibold mt-1 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
                {i === timeline.length - 1 && (
                  <div className="mt-2 flex items-center gap-1 text-primary text-[10px] font-semibold">
                    <TrendingUp size={10} />
                    Milestone Achieved
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
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