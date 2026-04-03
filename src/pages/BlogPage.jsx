// pages/BlogPage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useParams, useNavigate } from "react-router-dom";
import { 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  Search,
  ChevronRight,
  ChevronLeft,
  TrendingUp,
  Sparkles,
  Droplets,
  Scissors,
  Heart as HeartIcon,
  Shield,
  Award,
  Eye,
  Bookmark,
  Share2,
  ThumbsUp,
  Filter,
  X,
  Facebook,
  Twitter,
  Linkedin,
  Link as LinkIcon,
  Check,
  MessageCircle,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/SectionHeading";
import Testimonials from "../components/Testimonials";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
};

// Complete Blog Posts Data with Full Content
const blogPostsData = {
  1: {
    id: 1,
    title: "The Complete Guide to Hair Transplant: What You Need to Know",
    excerpt: "Everything from consultation to recovery - understand the entire hair transplant journey with expert insights from our leading dermatologists.",
    content: `
      <p>Hair transplant surgery has become one of the most effective solutions for hair loss, offering permanent, natural-looking results. In this comprehensive guide, we'll walk you through everything you need to know about the procedure, from initial consultation to full recovery.</p>
      
      <h2>Understanding Hair Loss</h2>
      <p>Before considering a hair transplant, it's important to understand the root cause of your hair loss. Male and female pattern baldness (androgenetic alopecia) is the most common cause, affecting millions worldwide. Other factors include stress, hormonal changes, nutritional deficiencies, and certain medical conditions.</p>
      
      <h2>The Consultation Process</h2>
      <p>Your hair transplant journey begins with a thorough consultation. During this visit, Dr. Kanagaraj will:</p>
      <ul>
        <li>Evaluate your hair loss pattern and donor area quality</li>
        <li>Discuss your medical history and any underlying conditions</li>
        <li>Set realistic expectations for results</li>
        <li>Create a customized treatment plan tailored to your needs</li>
      </ul>
      
      <h2>Types of Hair Transplant Procedures</h2>
      <p>There are two primary techniques used in modern hair transplantation:</p>
      
      <h3>FUE (Follicular Unit Extraction)</h3>
      <p>FUE involves extracting individual hair follicles from the donor area (typically the back of the scalp) and implanting them into the recipient area. This technique offers minimal scarring, faster recovery, and is ideal for patients who prefer shorter hairstyles.</p>
      
      <h3>FUT (Follicular Unit Transplantation)</h3>
      <p>FUT involves removing a strip of skin from the donor area, from which individual follicular units are dissected and implanted. This method can yield a higher number of grafts in a single session and is often more cost-effective for larger procedures.</p>
      
      <h2>The Procedure Day</h2>
      <p>On the day of your procedure, you can expect:</p>
      <ul>
        <li>Local anesthesia to ensure your comfort throughout</li>
        <li>The procedure typically takes 4-8 hours depending on graft count</li>
        <li>You'll be awake and can relax, watch TV, or listen to music</li>
        <li>Our team ensures you're comfortable throughout the process</li>
      </ul>
      
      <h2>Recovery and Results Timeline</h2>
      <p>Understanding your recovery timeline helps set proper expectations:</p>
      <ul>
        <li><strong>Days 1-10:</strong> Scabbing and initial healing phase</li>
        <li><strong>Weeks 2-4:</strong> Transplanted hair sheds (this is normal!)</li>
        <li><strong>Months 3-6:</strong> New growth begins to appear</li>
        <li><strong>Months 6-12:</strong> Full results become visible</li>
        <li><strong>12-18 months:</strong> Final density and maturity of results</li>
      </ul>
      
      <h2>Why Choose Our Clinic</h2>
      <p>At our clinic, we pride ourselves on:</p>
      <ul>
        <li>Board-certified dermatologists with years of specialized experience</li>
        <li>State-of-the-art facilities with advanced technology</li>
        <li>Personalized care from consultation to post-procedure follow-up</li>
        <li>Natural-looking results that blend seamlessly with your existing hair</li>
      </ul>
      
      <p>Ready to take the first step toward restoring your hair and confidence? Schedule a consultation with Dr. Kanagaraj today to discuss your hair restoration goals.</p>
    `,
    image: "/haire2.jpg",
    category: "Hair Transplant",
    author: "Dr. Kanagaraj",
    date: "March 15, 2024",
    readTime: "8 min read",
    views: "12.5k",
    tags: ["Hair Transplant", "Surgery", "Recovery", "FUE", "FUT"]
  },
  
  2: {
    id: 2,
    title: "5 Signs You Might Be Losing Hair and When to See a Doctor",
    excerpt: "Early intervention is key to preventing permanent hair loss. Learn the warning signs that require professional attention.",
    content: `
      <p>Hair loss can be distressing, but early intervention often makes all the difference. Here are five signs that indicate it might be time to consult a dermatologist about your hair health.</p>
      
      <h2>1. Excessive Shedding in the Shower or on Your Pillow</h2>
      <p>Losing 50-100 hairs per day is normal. However, if you notice clumps of hair in your shower drain or your pillow looks like a shedding zone, it's time to pay attention. Excessive shedding could indicate telogen effluvium, a temporary condition often triggered by stress, illness, or hormonal changes.</p>
      
      <h2>2. Noticeable Thinning at the Crown or Hairline</h2>
      <p>Male pattern baldness typically begins with a receding hairline or thinning at the crown. For women, thinning often presents as widening of the part line. If you notice these patterns, early intervention can help slow progression.</p>
      
      <h2>3. Changes in Hair Texture</h2>
      <p>If your hair suddenly becomes finer, brittle, or loses its natural luster, this could be a sign of underlying issues affecting hair health and growth cycles.</p>
      
      <h2>4. Itching, Burning, or Scalp Irritation</h2>
      <p>These symptoms may indicate inflammation or conditions like seborrheic dermatitis, which can interfere with healthy hair growth if left untreated.</p>
      
      <h2>5. Family History of Hair Loss</h2>
      <p>Genetics play a significant role in hair loss. If your parents or grandparents experienced pattern baldness, you're at higher risk. Proactive monitoring and early treatment can help preserve your hair longer.</p>
      
      <h2>When to See a Doctor</h2>
      <p>Don't wait until you've lost significant hair. The best time to consult a dermatologist is at the first sign of unusual shedding or thinning. Early diagnosis can identify reversible causes and start treatments that can slow or stop progression.</p>
    `,
    image: "/hairloss2222.jpg",
    category: "Hair Care",
    author: "Dr. Kanagaraj",
    date: "March 10, 2024",
    readTime: "5 min read",
    views: "8.2k",
    tags: ["Hair Loss", "Prevention", "Early Signs", "Warning Signs"]
  },
  
  3: {
    id: 3,
    title: "PRP Therapy for Hair: Does It Really Work?",
    excerpt: "Exploring the science behind Platelet-Rich Plasma therapy and its effectiveness in treating hair thinning and baldness.",
    content: `
      <p>Platelet-Rich Plasma (PRP) therapy has gained significant attention as a non-surgical option for hair restoration. But does it really work? Let's explore the science, process, and results of this increasingly popular treatment.</p>
      
      <h2>What is PRP Therapy?</h2>
      <p>PRP therapy harnesses your body's natural healing abilities to stimulate hair growth. The process involves drawing a small amount of your blood, processing it to concentrate the platelets and growth factors, and then injecting this concentrated solution into areas of thinning hair.</p>
      
      <h2>The Science Behind PRP</h2>
      <p>Platelets contain powerful growth factors that play a crucial role in wound healing and tissue regeneration. When injected into the scalp, these growth factors can stimulate dormant hair follicles, increase blood supply, reduce inflammation, and strengthen existing hair shafts.</p>
      
      <h2>Treatment Protocol</h2>
      <p>A typical PRP treatment protocol involves an initial series of 3-4 sessions spaced 4-6 weeks apart, followed by maintenance sessions every 4-6 months. Each session takes approximately 60-90 minutes.</p>
      
      <h2>Results and Expectations</h2>
      <p>Results vary by individual, but most patients begin to notice improvement after 3-4 months. Optimal results are typically visible around 6-9 months. Clinical studies show that 70-80% of patients experience positive results with PRP therapy when used appropriately.</p>
    `,
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?q=80&w=2070&auto=format&fit=crop",
    category: "Treatments",
    author: "Dr. Kanagaraj",
    date: "March 5, 2024",
    readTime: "6 min read",
    views: "9.4k",
    tags: ["PRP", "Hair Treatment", "Non-Surgical", "Growth Factors"]
  },
  
  4: {
    id: 4,
    title: "Natural Remedies for Acne: What Science Says",
    excerpt: "Separating myths from facts - evidence-based natural approaches to managing acne breakouts effectively.",
    content: `
      <p>Acne affects millions of people worldwide, and many turn to natural remedies in search of gentler alternatives to conventional treatments. But which natural approaches actually work? Let's examine the evidence behind popular natural acne remedies.</p>
      
      <h2>Tea Tree Oil</h2>
      <p>Studies have shown that tea tree oil has antimicrobial properties that can help fight acne-causing bacteria. A 5% tea tree oil gel has been shown to be as effective as 5% benzoyl peroxide with fewer side effects like dryness and irritation.</p>
      
      <h2>Green Tea Extract</h2>
      <p>Green tea contains powerful antioxidants called catechins that reduce inflammation and sebum production. Topical application of green tea extract can help calm active breakouts and prevent new ones.</p>
      
      <h2>Honey and Cinnamon Mask</h2>
      <p>Both honey and cinnamon have antibacterial and anti-inflammatory properties. When combined, they can help reduce bacterial growth and calm inflamed acne lesions.</p>
      
      <h2>Aloe Vera</h2>
      <p>Aloe vera is well-known for its soothing properties. It can help reduce inflammation, promote healing, and when combined with other treatments, may help reduce acne severity.</p>
      
      <h2>What to Avoid</h2>
      <p>Some popular "natural" remedies can actually make acne worse: coconut oil (clogs pores), lemon juice (causes photosensitivity), toothpaste (harsh ingredients), and undiluted essential oils (can cause reactions).</p>
    `,
    image: "/nature2.jpg",
    category: "Skin Care",
    author: "Dr. Kanagaraj",
    date: "February 28, 2024",
    readTime: "7 min read",
    views: "15.3k",
    tags: ["Acne", "Natural Remedies", "Skincare"]
  },
  
  5: {
    id: 5,
    title: "FUE vs FUT Hair Transplant: Which One Is Right for You?",
    excerpt: "Understanding the difference between Follicular Unit Extraction and Follicular Unit Transplantation techniques.",
    content: `
      <p>When considering a hair transplant, one of the first decisions you'll make is choosing between FUE (Follicular Unit Extraction) and FUT (Follicular Unit Transplantation). Each technique has its own advantages, and the best choice depends on your individual needs and goals.</p>
      
      <h2>FUE (Follicular Unit Extraction)</h2>
      <p>FUE involves extracting individual hair follicles directly from the donor area using a specialized punch tool. Benefits include:</p>
      <ul>
        <li>Minimal scarring - tiny dots that heal to be nearly invisible</li>
        <li>Faster recovery time - typically 5-7 days</li>
        <li>Ability to wear very short hairstyles</li>
        <li>Less post-operative discomfort</li>
      </ul>
      
      <h2>FUT (Follicular Unit Transplantation)</h2>
      <p>FUT involves removing a strip of skin from the donor area, from which follicular units are dissected. Benefits include:</p>
      <ul>
        <li>Higher graft yield in a single session</li>
        <li>Often more cost-effective for larger procedures</li>
        <li>Preserves donor area for future sessions if needed</li>
        <li>Surgeon has better control over graft quality</li>
      </ul>
      
      <h2>Which Is Right for You?</h2>
      <p>Your surgeon will help determine the best approach based on your hair loss pattern, donor hair characteristics, and personal preferences. Many patients achieve excellent results with either technique when performed by an experienced surgeon.</p>
    `,
    image: "/follicle.jpg",
    category: "Hair Transplant",
    author: "Dr. Kanagaraj",
    date: "February 20, 2024",
    readTime: "10 min read",
    views: "11.7k",
    tags: ["FUE", "FUT", "Hair Transplant", "Comparison"]
  },
  
  6: {
    id: 6,
    title: "Post-Transplant Care: Essential Tips for Optimal Results",
    excerpt: "Proper aftercare is crucial for successful hair transplant results. Follow these expert guidelines for the best outcome.",
    content: `
      <p>The success of your hair transplant doesn't end when you leave the operating room. Proper aftercare is essential for achieving the best possible results. Here's what you need to know about post-transplant care.</p>
      
      <h2>First 10 Days: Critical Healing Phase</h2>
      <ul>
        <li>Avoid touching or scratching the transplanted area</li>
        <li>Sleep with your head elevated for the first week</li>
        <li>Follow washing instructions carefully - gentle rinsing only</li>
        <li>Avoid strenuous exercise and heavy lifting</li>
        <li>Stay away from direct sunlight</li>
      </ul>
      
      <h2>Weeks 2-4: Shedding Phase</h2>
      <p>Don't panic when transplanted hairs begin to shed - this is completely normal! The follicles are simply entering a resting phase before new growth begins. Continue gentle care and avoid harsh hair products.</p>
      
      <h2>Months 1-6: Early Growth</h2>
      <p>New hair growth typically begins around the 3-4 month mark. You'll notice fine, wispy hairs that gradually thicken and darken over time. Continue using any prescribed medications and attend follow-up appointments.</p>
      
      <h2>Months 6-12: Full Results</h2>
      <p>By month 6, you'll see significant improvement, with full results visible around 12-18 months. Continue good hair care habits to maintain your results long-term.</p>
    `,
    image: "/haircare.jpg",
    category: "Aftercare",
    author: "Dr. Kanagaraj",
    date: "February 15, 2024",
    readTime: "6 min read",
    views: "7.8k",
    tags: ["Aftercare", "Recovery", "Hair Transplant", "Healing"]
  },
  
  7: {
    id: 7,
    title: "Understanding Pigmentation: Causes and Treatment Options",
    excerpt: "Comprehensive guide to different types of skin pigmentation and modern treatment approaches.",
    content: `
      <p>Skin pigmentation issues affect millions of people worldwide, causing uneven skin tone and often affecting self-confidence. Understanding the causes and available treatments is the first step toward achieving clear, even-toned skin.</p>
      
      <h2>Types of Pigmentation</h2>
      <ul>
        <li><strong>Melasma:</strong> Brown patches often triggered by hormonal changes</li>
        <li><strong>Post-inflammatory hyperpigmentation:</strong> Dark spots following acne or injury</li>
        <li><strong>Sun spots:</strong> Caused by cumulative sun exposure</li>
        <li><strong>Freckles:</strong> Genetic and sun-related pigmentation</li>
      </ul>
      
      <h2>Treatment Options</h2>
      <p>Modern dermatology offers several effective treatments for pigmentation:</p>
      <ul>
        <li>Topical treatments with ingredients like hydroquinone, kojic acid, and vitamin C</li>
        <li>Chemical peels to exfoliate and lighten pigmented areas</li>
        <li>Laser therapy for targeted pigmentation removal</li>
        <li>Microneedling combined with brightening serums</li>
      </ul>
      
      <h2>Prevention is Key</h2>
      <p>Daily sun protection is the most important factor in preventing and treating pigmentation. Use broad-spectrum SPF 50+ sunscreen year-round, even on cloudy days.</p>
    `,
    image: "/pigmen.jpg",
    category: "Skin Care",
    author: "Dr. Kanagaraj",
    date: "February 10, 2024",
    readTime: "7 min read",
    views: "10.2k",
    tags: ["Pigmentation", "Skin Care", "Treatment", "Melasma"]
  },
  
  8: {
    id: 8,
    title: "Hair Care Routine for Post-Transplant Patients",
    excerpt: "Essential hair care tips and products to use after your hair transplant procedure.",
    content: `
      <p>After investing in a hair transplant, protecting your investment with proper hair care is essential. Here's a comprehensive guide to maintaining healthy, thriving hair post-transplant.</p>
      
      <h2>Gentle Cleansing</h2>
      <p>Use sulfate-free, gentle shampoos that won't strip natural oils. Avoid harsh scrubbing and let water flow gently over the scalp rather than directing spray at high pressure.</p>
      
      <h2>Nourishing Treatments</h2>
      <p>After the initial healing period, incorporate nourishing hair masks and serums that support healthy growth. Look for ingredients like biotin, keratin, and natural oils that strengthen hair shafts.</p>
      
      <h2>Scalp Health</h2>
      <p>Keep your scalp healthy with regular gentle exfoliation (after healing) to remove dead skin cells and promote circulation. Consider PRP therapy as a maintenance treatment to support ongoing growth.</p>
      
      <h2>Long-term Maintenance</h2>
      <p>Continue using any prescribed medications like minoxidil as directed. Schedule regular follow-ups with your surgeon to monitor progress and address any concerns promptly.</p>
    `,
    image: "/routine.jpg",
    category: "Aftercare",
    author: "Dr. Kanagaraj",
    date: "February 5, 2024",
    readTime: "5 min read",
    views: "6.9k",
    tags: ["Aftercare", "Hair Care", "Transplant", "Maintenance"]
  },
  
  9: {
    id: 9,
    title: "Top 10 Skincare Myths Debunked by Dermatologists",
    excerpt: "We separate fact from fiction when it comes to popular skincare advice and trends.",
    content: `
      <p>Skincare misinformation is everywhere. Let's separate fact from fiction with these 10 common skincare myths, debunked by our expert dermatologists.</p>
      
      <h2>Myth 1: You Don't Need Sunscreen on Cloudy Days</h2>
      <p>False! Up to 80% of UV rays can penetrate clouds. Daily sunscreen is essential regardless of weather.</p>
      
      <h2>Myth 2: Expensive Products Are Always Better</h2>
      <p>Not necessarily. Effective skincare depends on ingredients, not price tag. Many affordable products contain the same active ingredients as luxury brands.</p>
      
      <h2>Myth 3: Natural Ingredients Are Always Safe</h2>
      <p>Natural doesn't automatically mean safe. Many natural ingredients can cause allergic reactions or irritation.</p>
      
      <h2>Myth 4: You Can Shrink Your Pores</h2>
      <p>Pore size is genetically determined. While you can minimize their appearance, you cannot permanently shrink pores.</p>
      
      <h2>Myth 5: Oily Skin Doesn't Need Moisturizer</h2>
      <p>Even oily skin needs hydration. Skipping moisturizer can lead to increased oil production as your skin tries to compensate.</p>
      
      <h2>Myth 6: Toothpaste Dries Out Pimples</h2>
      <p>This can cause skin irritation, burns, and even scarring. Use proper acne treatments instead.</p>
      
      <h2>Myth 7: Anti-Aging Products Work Instantly</h2>
      <p>Results take time. Most active ingredients need 4-12 weeks of consistent use to show visible results.</p>
      
      <h2>Myth 8: You Don't Need to Moisturize Oily Skin</h2>
      <p>All skin types need hydration. Choose oil-free, non-comedogenic formulas.</p>
      
      <h2>Myth 9: Face Oils Make You Break Out</h2>
      <p>Non-comedogenic face oils can actually balance oil production and provide essential nutrients.</p>
      
      <h2>Myth 10: Tanning Beds Are Safer Than Sun</h2>
      <p>No! Tanning beds emit UV radiation that can cause skin cancer and premature aging.</p>
    `,
    image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop",
    category: "Skin Care",
    author: "Dr. Kanagaraj",
    date: "January 28, 2024",
    readTime: "8 min read",
    views: "18.4k",
    tags: ["Skincare", "Myths", "Education", "Dermatology"]
  }
};

// Get all posts as array
const allPosts = Object.values(blogPostsData);
const featuredPost = allPosts.find(post => post.id === 1);

// Categories with counts
const categories = [
  { name: "All", count: allPosts.length, icon: Sparkles },
  { name: "Hair Transplant", count: allPosts.filter(p => p.category === "Hair Transplant").length, icon: Scissors },
  { name: "Hair Care", count: allPosts.filter(p => p.category === "Hair Care").length, icon: Droplets },
  { name: "Skin Care", count: allPosts.filter(p => p.category === "Skin Care").length, icon: Sparkles },
  { name: "Treatments", count: allPosts.filter(p => p.category === "Treatments").length, icon: HeartIcon },
  { name: "Aftercare", count: allPosts.filter(p => p.category === "Aftercare").length, icon: Shield }
];

// Popular Tags
const popularTags = [
  "Hair Transplant", "PRP", "FUE", "FUT", "Acne Treatment", 
  "Pigmentation", "Hair Loss", "Skin Care Routine", 
  "Anti-Aging", "Scalp Health", "Aftercare", "Recovery"
];

// Blog Post Detail Component
const BlogPostDetail = ({ post, onBack }) => {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Get related posts (same category, different id)
  const relatedPosts = allPosts
    .filter(p => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto"
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to all articles
      </button>

      {/* Post Header */}
      <div className="mb-8">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
          {post.category}
        </Badge>
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-6">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <User className="w-4 h-4" />
            {post.author}
          </span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {post.date}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {post.readTime}
          </span>
          <span className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            {post.views} views
          </span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="rounded-3xl overflow-hidden mb-8">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-auto max-h-[500px] object-cover"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLiked(!liked)}
            className="rounded-full"
          >
            <ThumbsUp className={`w-4 h-4 mr-2 ${liked ? 'fill-primary text-primary' : ''}`} />
            {liked ? 'Liked' : 'Like'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSaved(!saved)}
            className="rounded-full"
          >
            <Bookmark className={`w-4 h-4 mr-2 ${saved ? 'fill-primary text-primary' : ''}`} />
            {saved ? 'Saved' : 'Save'}
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Share:</span>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-blue-500/10"
            onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${shareUrl}`)}
          >
            <Twitter className="w-4 h-4 text-blue-400" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-blue-700/10"
            onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`)}
          >
            <Facebook className="w-4 h-4 text-blue-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-blue-600/10"
            onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${shareUrl}&title=${encodeURIComponent(post.title)}`)}
          >
            <Linkedin className="w-4 h-4 text-blue-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={handleCopyLink}
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <LinkIcon className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Post Content */}
      <div 
        className="prose prose-lg dark:prose-invert max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      <div className="mb-12">
        <h3 className="font-display font-bold text-lg mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="text-sm">
              #{tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Author Bio */}
      <div className="bg-card rounded-2xl p-6 mb-12 border border-border">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h4 className="font-display font-bold text-lg mb-1">{post.author}</h4>
            <p className="text-sm text-primary mb-2">MBBS., MD (DVL) | Dermatologist & Hair Transplant Specialist</p>
            <p className="text-muted-foreground text-sm">
              With over 15 years of experience in dermatology and hair restoration, Dr. Kanagaraj has helped thousands of patients achieve their hair and skin goals.
            </p>
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mb-12">
          <h3 className="font-display font-bold text-2xl mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {relatedPosts.map((relatedPost) => (
              <div
                key={relatedPost.id}
                onClick={() => onBack(relatedPost.id)}
                className="group cursor-pointer"
              >
                <div className="rounded-xl overflow-hidden mb-3">
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {relatedPost.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">{relatedPost.date}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
        <h3 className="font-display font-bold text-2xl mb-2">Ready to Transform Your Skin or Hair?</h3>
        <p className="text-muted-foreground mb-6">Book a consultation with Dr. Kanagaraj today</p>
        <Link to="/appointment">
          <Button className="rounded-full px-8 py-6 h-auto">
            Book Appointment
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>

      <style>{`
        .prose h2 {
          font-size: 1.8rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: var(--foreground);
        }
        .prose h3 {
          font-size: 1.4rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
        }
        .prose p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .prose ul {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
      `}</style>
    </motion.div>
  );
};

// Main Blog Page Component
const BlogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showSidebar, setShowSidebar] = useState(true);
  const [savedPosts, setSavedPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Filter posts based on search and category
  const filteredPosts = allPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleSavePost = (postId) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
    } else {
      setSavedPosts([...savedPosts, postId]);
    }
  };

  // If a post is selected, show the detail view
  if (selectedPost) {
    return (
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-20 pb-20 bg-background"
      >
        <div className="container mx-auto px-4">
          <BlogPostDetail 
            post={selectedPost} 
            onBack={(newId) => {
              if (newId && typeof newId === 'number') {
                setSelectedPost(blogPostsData[newId]);
                window.scrollTo(0, 0);
              } else {
                setSelectedPost(null);
              }
            }} 
          />
        </div>
      </motion.main>
    );
  }

  // Main blog listing view
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="pt-20 pb-20 bg-background"
    >
      {/* Blog Header */}
      <div className="container mx-auto px-4 pt-8 md:pt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 px-4 py-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            Expert Insights
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-foreground">
            Skin & Hair <span className="text-gradient">Wellness Blog</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Expert advice, treatment insights, and wellness tips from India's leading dermatologists
          </p>
        </motion.div>
      </div>

      {/* Search and Filter Bar */}
      <div className="container mx-auto px-4 mb-12">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-6 rounded-full bg-card border-border focus:ring-primary"
            />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowSidebar(!showSidebar)}
            className="md:hidden rounded-full"
          >
            <Filter className="w-4 h-4 mr-2" />
            {showSidebar ? "Hide Filters" : "Show Filters"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className={`lg:w-80 ${showSidebar ? 'block' : 'hidden lg:block'} space-y-8`}>
            {/* Categories */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
              <h3 className="font-display font-bold text-xl mb-4 text-foreground">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-all ${
                      selectedCategory === category.name
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary/10 text-muted-foreground"
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <category.icon className="w-4 h-4" />
                      {category.name}
                    </span>
                    <span className="text-xs">{category.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Tags */}
            <div className="bg-card/50 backdrop-blur-sm rounded-2xl p-6 border border-border">
              <h3 className="font-display font-bold text-xl mb-4 text-foreground">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary/10 hover:border-primary/30 transition-all"
                    onClick={() => setSearchTerm(tag)}
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20">
              <h3 className="font-display font-bold text-xl mb-2 text-foreground">Subscribe to Newsletter</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get the latest skincare tips and treatment updates directly in your inbox.
              </p>
              <div className="flex gap-2">
                <Input placeholder="Your email" className="rounded-full" />
                <Button className="rounded-full">Subscribe</Button>
              </div>
            </div>
          </aside>

          {/* Blog Posts Grid */}
          <div className="flex-1">
            {/* Featured Post */}
            {selectedCategory === "All" && searchTerm === "" && featuredPost && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12 cursor-pointer"
                onClick={() => setSelectedPost(featuredPost)}
              >
                <div className="relative rounded-3xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                  <img
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    className="w-full h-[400px] md:h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <Badge className="mb-4 bg-primary text-white">{featuredPost.category}</Badge>
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-white/90 mb-6 max-w-2xl">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-6 text-sm text-white/80">
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" /> {featuredPost.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {featuredPost.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {featuredPost.readTime}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Posts Grid */}
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-xl transition-all hover:-translate-y-1 cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <div className="relative overflow-hidden h-48">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <Badge className="absolute top-4 left-4 bg-primary/90 text-white">
                        {post.category}
                      </Badge>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSavePost(post.id);
                        }}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center hover:bg-primary transition-colors"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${savedPosts.includes(post.id) ? 'fill-primary text-primary' : 'text-white'}`}
                        />
                      </button>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {post.readTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" /> {post.views}
                        </span>
                      </div>
                      
                      <h3 className="font-display font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.slice(0, 2).map((tag) => (
                          <span key={tag} className="text-xs text-primary/70">#{tag}</span>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <User className="w-4 h-4 text-primary" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{post.author}</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="rounded-full group/btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedPost(post);
                          }}
                        >
                          Read More
                          <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No articles found matching your criteria.</p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="mt-20">
        <Testimonials />
      </div>

      <style>{`
        .text-gradient {
          background: linear-gradient(135deg, #1795B4 0%, #0f6e6b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </motion.main>
  );
};

export default BlogPage;