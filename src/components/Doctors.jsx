import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Instagram, 
  Linkedin, 
  Twitter, 
  ExternalLink,
  Award,
  BookOpen,
  CalendarCheck,
  Star,
  Users,
  ShieldCheck
} from "lucide-react";

const doctors = [
  {
    name: "Dr. Kanak S.",
    specialization: "Dermatologist & Hair Restoration",
    experience: "10+ Years Experience",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=2070&auto=format&fit=crop",
    rating: "4.9",
    reviews: "2.5k+",
    clinics: "Mumbai, Bangalore",
    bio: "Pioneering minimally invasive hair restoration and advanced clinical dermatology treatments."
  },
  {
    name: "Dr. A. Verma",
    specialization: "Cosmetic Surgeon",
    experience: "12+ Years Experience",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=2070&auto=format&fit=crop",
    rating: "4.8",
    reviews: "1.8k+",
    clinics: "Mumbai Only",
    bio: "Excellence in facial aesthetics, body contouring and post-hair restoration aesthetic management."
  }
];

const Doctors = () => {
  return (
    <section id="doctors" className="py-14 sm:py-24 bg-background overflow-hidden scroll-mt-20 transition-colors duration-500">
      <div className="container mx-auto px-4">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-4 sm:gap-6">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-4"
            >
              <Award className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest leading-none">Global Certified Experts</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-6"
            >
              Meet Our Board-Certified <br />
              <span className="text-secondary">Medical Specialists</span>
            </motion.h2>
          </div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Button variant="outline" className="rounded-full shadow-lg border-2 border-primary/20 text-primary font-bold hover:bg-primary/5 h-auto py-4 px-8">
              View Entire Medical Board
            </Button>
          </motion.div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12 items-start">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Card className="border border-border shadow-2xl shadow-slate-200/50 dark:shadow-none rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-card/50 backdrop-blur-sm group-hover:shadow-primary/10 transition-shadow">
                <div className="grid md:grid-cols-5 h-full">
                  {/* Doctor Image Header */}
                  <div className="md:col-span-2 relative aspect-[4/5] md:aspect-auto overflow-hidden">
                    <img 
                      src={doctor.image} 
                      alt={doctor.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Social Overlay */}
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                      <Button size="icon" variant="ghost" className="rounded-full bg-white text-primary ring-offset-primary hover:bg-primary hover:text-white transform scale-0 group-hover:scale-100 transition-all delay-75">
                        <Instagram className="w-5 h-5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="rounded-full bg-white text-secondary ring-offset-secondary hover:bg-secondary hover:text-white transform scale-0 group-hover:scale-100 transition-all delay-150">
                        <Linkedin className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {/* Doctor Content */}
                  <div className="md:col-span-3 p-5 sm:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-secondary border-secondary/20 font-bold bg-secondary/5">
                          {doctor.specialization}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
                          <Star className="w-4 h-4 fill-amber-500" />
                          {doctor.rating}
                        </div>
                      </div>
                      
                      <CardTitle className="text-xl sm:text-3xl font-extrabold text-foreground mb-2 leading-tight">
                        {doctor.name}
                      </CardTitle>
                      
                      <CardDescription className="flex items-center gap-2 mb-6 text-muted-foreground font-bold uppercase tracking-tighter text-xs">
                        <Award className="w-4 h-4 text-primary" />
                        {doctor.experience}
                      </CardDescription>

                      <p className="text-muted-foreground mb-6 text-sm font-medium leading-relaxed italic">
                        "{doctor.bio}"
                      </p>

                      <div className="space-y-3 mb-8">
                        <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                          <Users className="w-5 h-5 text-primary/60" />
                          <span>{doctor.reviews} Successful Recoveries</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-bold text-foreground">
                          <CalendarCheck className="w-5 h-5 text-secondary/60" />
                          <span>Available Mon - Sat (10 AM - 7 PM)</span>
                        </div>
                      </div>
                    </div>

                    <CardFooter className="p-0 pt-4 sm:pt-6 border-t border-border flex gap-3">
                      <Button className="flex-grow rounded-xl sm:rounded-2xl py-4 sm:py-6 font-bold group/btn shadow-lg shadow-primary/20 bg-primary h-auto text-sm" asChild>
                        <a href="#appointment">
                          Book Appointment
                          <CalendarCheck className="ml-2 w-5 h-5 opacity-50 group-hover/btn:opacity-100" />
                        </a>
                      </Button>
                      <Button variant="ghost" size="icon" className="rounded-2xl p-6 border border-border hover:bg-primary/5 transition-colors h-auto w-auto">
                        <ExternalLink className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Doctors;
