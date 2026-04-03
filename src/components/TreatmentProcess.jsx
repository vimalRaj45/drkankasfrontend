import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const TreatmentProcess = () => {
  const sectionRef = useRef(null);

  const processes = [
    {
      step: 1,
      title: 'Consultation & Diagnosis',
      desc: 'Our journey begins with a thorough understanding of your concerns. We utilize advanced dermatoscopes and skin/hair analyzers to pinpoint the exact root cause of your condition.',
      icon: 'bi-clipboard2-pulse',
      color: '#0ea5e9', // Blue
    },
    {
      step: 2,
      title: 'Customized Treatment Plan',
      desc: 'Based on your diagnosis, Dr. Kanagaraj crafts a bespoke, evidence-based plan. You get full transparency regarding the procedure, timeline, expected outcomes, and post-care.',
      icon: 'bi-card-checklist',
      color: '#f59e0b', // Amber/Yellow
    },
    {
      step: 3,
      title: 'Advanced Procedure Execution',
      desc: 'Using exclusively FDA-approved, cutting-edge equipment (like our Triple Wavelength Diode or Q-Switch lasers), treatments are performed with ultimate precision and minimal discomfort.',
      icon: 'bi-magic',
      color: '#14b8a6', // Teal/Mint (our accent)
    },
    {
      step: 4,
      title: 'Ongoing Monitoring & Care',
      desc: 'We follow up meticulously to track your progress and adjust plans if necessary, ensuring a lasting, naturally transformative result.',
      icon: 'bi-arrow-clockwise',
      color: '#8b5cf6', // Purple
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll('.process-step');
      
      gsap.fromTo(
        items,
        { opacity: 0, x: -60 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="process-section section-padding" id="process" ref={sectionRef}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div className="section-title" data-aos="fade-up">
          <h2>How We Achieve Results</h2>
          <p className="lead">
            A transparent, patient-first approach combining technology with deep medical expertise
          </p>
        </div>

        <div className="process-timeline">
          {processes.map((proc, index) => (
            <div className="process-step" key={index}>
              <div
                className="process-icon-container"
                style={{
                  background: `linear-gradient(135deg, ${proc.color}22, ${proc.color}11)`,
                  boxShadow: `0 10px 30px ${proc.color}33`,
                  border: `1px solid ${proc.color}55`,
                }}
              >
                <i className={`bi ${proc.icon}`} style={{ color: proc.color }}></i>
                <div className="process-number" style={{ backgroundColor: proc.color }}>
                  {proc.step}
                </div>
              </div>
              <div className="process-content">
                <h4>{proc.title}</h4>
                <p>{proc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TreatmentProcess;
