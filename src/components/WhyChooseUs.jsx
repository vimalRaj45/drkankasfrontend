// components/WhyChooseUs.jsx
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading.jsx";
import { Shield, Clock, Award, Users, ThumbsUp, Sparkles, Heart, Star } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const reasons = [
  {
    icon: Shield,
    title: "Expert Care",
    desc: "15+ years of specialized dermatology experience with proven results"
  },
  {
    icon: Sparkles,
    title: "Advanced Technology",
    desc: "State-of-the-art equipment and FDA-approved treatments"
  },
  {
    icon: Heart,
    title: "Personalized Approach",
    desc: "Custom treatment plans tailored to your unique skin needs"
  },
  {
    icon: Users,
    title: "Patient First",
    desc: "Compassionate care with focus on your comfort and satisfaction"
  },
  {
    icon: Clock,
    title: "Timely Results",
    desc: "Efficient treatments with minimal downtime and lasting outcomes"
  },
  {
    icon: Award,
    title: "Trusted Expertise",
    desc: "Recognized by peers and trusted by over 10,000 patients"
  }
];

const WhyChooseUs = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-background dark:from-primary/10 dark:via-background dark:to-background">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Why Choose Us" 
          subtitle="Experience the difference of expert dermatological care" 
        />
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {reasons.map((reason, i) => (
            <motion.div
              key={reason.title}
              {...fadeUp}
              transition={{ delay: i * 0.1 }}
              className="bg-card/80 dark:bg-card/50 backdrop-blur-sm rounded-2xl p-6 text-center transition-all hover:-translate-y-2 hover:shadow-lg cursor-pointer border border-border"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                <reason.icon size={28} className="text-primary" />
              </div>
              <h3 className="font-display font-bold text-xl mb-2 text-foreground">{reason.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{reason.desc}</p>
            </motion.div>
          ))}
        </div>
        
        {/* Trust Badge */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.5 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/5 dark:bg-primary/10 border border-primary/20">
            <Star size={18} className="text-primary fill-primary" />
            <span className="text-sm font-semibold text-foreground">Trusted by 10,000+ Happy Patients</span>
            <Star size={18} className="text-primary fill-primary" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;