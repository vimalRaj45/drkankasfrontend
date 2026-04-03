import React from "react";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import WhyChooseUs from "../components/WhyChooseUs";
import Blog from "../components/Blog";
import PatientCare from "../components/PatientCare";
import Testimonials from "../components/Testimonials";
import Contact from "../components/Contact";

const Landing = () => {
  return (
    <main className="relative z-10 w-full overflow-x-hidden">
      <Hero />
      <About />
      <Services />
      <WhyChooseUs />
      <Blog />
      <PatientCare />
      <Testimonials />
      <Contact />
    </main>
  );
};

export default Landing;
