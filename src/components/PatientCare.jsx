// components/PatientCare.jsx
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading.jsx";
import { Calendar, Phone, MessageCircle, MapPin, Clock, Shield, CheckCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const carePoints = [
  {
    icon: Calendar,
    title: "Easy Appointments",
    desc: "Book online or call us for same-day appointments"
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    desc: "Convenient timings including weekends for your ease"
  },
  {
    icon: Shield,
    title: "Confidential Care",
    desc: "Your privacy and comfort are our top priorities"
  },
  {
    icon: CheckCircle,
    title: "Follow-up Support",
    desc: "Regular check-ins to ensure optimal results"
  }
];

const PatientCare = () => {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Patient-Centered Care" 
          subtitle="Your comfort and satisfaction are at the heart of everything we do" 
        />
        
        <div className="grid lg:grid-cols-2 gap-12 mt-12">
          {/* Care Points Grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {carePoints.map((point, i) => (
              <motion.div
                key={point.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="bg-card/80 dark:bg-card/50 backdrop-blur-sm rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-lg border border-border"
              >
                <point.icon size={32} className="text-primary mb-4" />
                <h3 className="font-display font-bold text-lg mb-2 text-foreground">{point.title}</h3>
                <p className="text-muted-foreground text-sm">{point.desc}</p>
              </motion.div>
            ))}
          </div>
          
          {/* Contact & Booking Card */}
          <motion.div
            {...fadeUp}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-3xl p-8 border border-primary/20"
          >
            <h3 className="font-display font-bold text-2xl mb-4 text-foreground">Ready to Begin Your Journey?</h3>
            <p className="text-muted-foreground mb-6">
              Take the first step towards healthier, more confident skin. Our team is here to help you.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-primary" />
                <span className="text-sm text-foreground">+91 97504 51176</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-primary" />
                <span className="text-sm text-foreground">contact@skinglowclinic.com</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-primary" />
                <span className="text-sm text-foreground">Salem, Tamil Nadu, India</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-primary" />
                <span className="text-sm text-foreground">Available on WhatsApp</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Link
                to="/appointment"
                className="flex-1 px-6 py-3 rounded-full bg-primary text-primary-foreground font-bold text-center hover:shadow-lg transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                <Calendar size={18} />
                Book Appointment
              </Link>
              <Link
                to="/contact"
                className="flex-1 px-6 py-3 rounded-full border border-primary/30 text-primary font-bold text-center hover:bg-primary/5 dark:hover:bg-primary/10 transition-all inline-flex items-center justify-center gap-2"
              >
                <MessageCircle size={18} />
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
        
        {/* Trust Indicators */}
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 text-center"
        >
          <div className="p-4 bg-card/50 dark:bg-card/30 rounded-xl border border-border">
            <div className="text-2xl font-display font-bold text-primary">24/7</div>
            <div className="text-xs text-muted-foreground">Emergency Support</div>
          </div>
          <div className="p-4 bg-card/50 dark:bg-card/30 rounded-xl border border-border">
            <div className="text-2xl font-display font-bold text-primary">100%</div>
            <div className="text-xs text-muted-foreground">Sterile Environment</div>
          </div>
          <div className="p-4 bg-card/50 dark:bg-card/30 rounded-xl border border-border">
            <div className="text-2xl font-display font-bold text-primary">0%</div>
            <div className="text-xs text-muted-foreground">Hidden Charges</div>
          </div>
          <div className="p-4 bg-card/50 dark:bg-card/30 rounded-xl border border-border">
            <div className="text-2xl font-display font-bold text-primary">FDA</div>
            <div className="text-xs text-muted-foreground">Approved Treatments</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PatientCare;