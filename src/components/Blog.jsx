// components/Blog.jsx
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ChevronRight, Calendar, User, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "./SectionHeading";

const blogPosts = [
  {
    id: 1,
    title: "The Complete Guide to Hair Transplant: What You Need to Know",
    excerpt: "Everything from consultation to recovery - understand the entire hair transplant journey with expert insights.",
    image: "/haire2.jpg",
    category: "Hair Transplant",
    author: "Dr. Kanagaraj",
    date: "March 15, 2024",
    readTime: "8 min read"
  },
  {
    id: 2,
    title: "5 Signs You Might Be Losing Hair and When to See a Doctor",
    excerpt: "Early intervention is key to preventing permanent hair loss. Learn the warning signs that require professional attention.",
    image: "/hairloss2222.jpg",
    category: "Hair Care",
    author: "Dr. Kanagaraj",
    date: "March 10, 2024",
    readTime: "5 min read"
  },
  {
    id: 4,
    title: "Natural Remedies for Acne: What Science Says",
    excerpt: "Separating myths from facts - evidence-based natural approaches to managing acne breakouts effectively.",
    image: "/nature2.jpg",
    category: "Skin Care",
    author: "Dr. Kanagaraj",
    date: "Feb 28, 2024",
    readTime: "7 min read"
  }
];

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

const Blog = () => {
  return (
    <section id="blog" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <SectionHeading 
              title="Latest from our Blog" 
              subtitle="Expert advice and insights for your skin and hair wellness journey" 
            />
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/doctors">
              <Button variant="outline" className="rounded-full group">
                View All Articles
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              {...fadeUp}
              transition={{ delay: index * 0.1 }}
              className="group bg-card rounded-3xl overflow-hidden border border-border hover:shadow-2xl transition-all hover:-translate-y-2"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-background/90 text-foreground backdrop-blur-md border-none uppercase text-[10px] font-bold tracking-wider px-3">
                    {post.category}
                  </Badge>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-primary" />
                    {post.readTime}
                  </span>
                </div>
                
                <h3 className="text-xl font-display font-bold mb-4 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <User size={16} className="text-primary" />
                    </div>
                    <span className="text-xs font-semibold text-foreground">{post.author}</span>
                  </div>
                  
                  <Link to="/doctors">
                    <Button variant="ghost" size="sm" className="p-0 h-auto hover:bg-transparent text-primary font-bold group/btn">
                      Read More
                      <ChevronRight size={14} className="ml-1 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
