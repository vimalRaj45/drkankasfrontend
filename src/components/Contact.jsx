import React from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Instagram, 
  Facebook, 
  Twitter, 
  Clock, 
  Send,
  MessageSquare,
  ArrowUpRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const contactDetails = [
  {
    title: "Clinic Address",
    content: "10/18, 1st Floor, Lakshmi complex, Swarnapuri, Salem, TN 636004",
    icon: <MapPin className="w-4 h-4" />,
    color: "bg-blue-100 text-blue-600"
  },
  {
    title: "Phone Support",
    content: "+91 97504 51176",
    icon: <Phone className="w-4 h-4" />,
    color: "bg-primary/10 text-primary"
  },
  {
    title: "Official Website",
    content: "www.drkanaksskinandhairclinic.com",
    icon: <Mail className="w-4 h-4" />,
    color: "bg-secondary/10 text-secondary"
  },
  {
    title: "Working Hours",
    content: "Mon – Sat: 10:30 AM – 8:30 PM (Sunday Closed)",
    icon: <Clock className="w-4 h-4" />,
    color: "bg-amber-100 text-amber-600"
  }
];

const Contact = () => {
  const navigationUrl = "https://www.google.com/maps/dir//Dr+Kanaks+Skin+Hair+And+Cosmetology+Clinic+Swarnapuri+Salem+Tamil+Nadu+636004/@11.66858,78.14083,15z";

  return (
    <section id="contact" className="py-12 sm:py-24 bg-background scroll-mt-20 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-14 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full mb-3">
              <MessageSquare className="w-3.5 h-3.5 text-primary" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Get In Touch</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-5xl font-extrabold text-foreground leading-tight">
              Reach Out For Any{" "}
              <span className="text-primary italic">Medical Consultation</span>
            </h2>
          </div>
          <Button
            size="sm"
            className="rounded-full shadow-lg shadow-secondary/20 bg-secondary hover:bg-secondary/90 font-bold shrink-0 self-start sm:self-auto"
            onClick={() => window.open(navigationUrl, '_blank')}
          >
            Get Directions
            <ArrowUpRight className="ml-1.5 w-4 h-4" />
          </Button>
        </div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-5 gap-6 lg:gap-14">

          {/* Left: Contact Info Cards */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {contactDetails.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08, duration: 0.5 }}
                className="flex items-start gap-3 p-4 sm:p-5 bg-muted/50 rounded-2xl border border-border hover:bg-card hover:shadow-lg transition-all group"
              >
                <div className={`p-2.5 rounded-xl w-fit shrink-0 ${item.color} group-hover:bg-primary group-hover:text-white transition-colors`}>
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-foreground mb-0.5 leading-tight">{item.title}</h4>
                  <p className="text-xs text-muted-foreground font-medium leading-relaxed break-words">{item.content}</p>
                </div>
              </motion.div>
            ))}

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <Button size="icon" className="rounded-xl h-10 w-10 bg-foreground text-background shadow-md hover:bg-primary transition-colors">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="icon" className="rounded-xl h-10 w-10 bg-foreground text-background shadow-md hover:bg-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button size="icon" className="rounded-xl h-10 w-10 bg-foreground text-background shadow-md hover:bg-sky-500 transition-colors">
                <Twitter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-card p-5 sm:p-8 lg:p-10 rounded-2xl sm:rounded-3xl shadow-xl border border-border relative overflow-hidden"
            >
              {/* Constrained blob — stays inside card */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10">
                <h3 className="text-lg sm:text-2xl font-extrabold text-foreground mb-1.5">Send a Message</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-5 leading-relaxed">
                  Fill out the form — our team responds within 2 hours.
                </p>

                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Your Name</Label>
                      <Input placeholder="Enter Full Name" className="h-10 sm:h-11 rounded-xl border-border bg-muted/50 pl-4 focus:bg-background" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Email</Label>
                      <Input type="email" placeholder="info@domain.com" className="h-10 sm:h-11 rounded-xl border-border bg-muted/50 pl-4 focus:bg-background" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subject</Label>
                    <Input placeholder="E.g. Hair restoration inquiry" className="h-10 sm:h-11 rounded-xl border-border bg-muted/50 pl-4 focus:bg-background" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Message</Label>
                    <Textarea placeholder="How can we assist you today?" className="min-h-[100px] rounded-xl border-border bg-muted/50 p-4 focus:bg-background" />
                  </div>
                  <Button className="w-full rounded-xl h-11 font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 group">
                    Send Message
                    <Send className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Google Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 sm:mt-16 rounded-2xl sm:rounded-[2rem] overflow-hidden shadow-xl border-2 border-muted grayscale hover:grayscale-0 transition-all duration-700 aspect-[16/9] md:aspect-[21/7] relative"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31258.70835677063!2d78.125!3d11.66!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3babf0c3d9b49b49%3A0x6bba847683a48e77!2sDr%20Kanaks%20Skin%20Hair%20%26%20Cosmetology%20Clinic!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>

          <div className="absolute bottom-4 left-4 hidden md:block">
            <div className="bg-card/90 backdrop-blur-md p-3 rounded-xl shadow-lg flex items-center gap-3 max-w-xs border border-border">
              <div className="bg-primary/20 p-2 rounded-lg text-primary shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs leading-none mb-0.5 text-foreground">Clinical HQ Verified</h4>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Google Verified Provider</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default Contact;
