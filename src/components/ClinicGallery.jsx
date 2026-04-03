import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ClinicGallery = () => {
  const sectionRef = useRef(null);

  const images = [
    {
      url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Modern Reception',
      delay: 0
    },
    {
      url: 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Advanced Consultation Rooms',
      delay: 0.1
    },
    {
      url: 'https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'State-of-the-Art Equipment',
      delay: 0.2
    },
    {
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Sterile Treatment Areas',
      delay: 0.3
    },
    {
      url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Comfortable Waiting Lounge',
      delay: 0.4
    },
    {
      url: 'https://images.unsplash.com/photo-1629904853263-54cd4db44517?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      title: 'Laser & Aesthetic Suites',
      delay: 0.5
    }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current.querySelectorAll('.gallery-item');
      
      gsap.fromTo(
        items,
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="gallery-section section-padding" id="gallery" ref={sectionRef}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <div className="section-title" data-aos="fade-up">
          <h2>Our World-Class Clinic</h2>
          <p className="lead">
            Experience premium care in a highly sterile, exceptionally comfortable environment
          </p>
        </div>

        <div className="gallery-grid">
          {images.map((img, index) => (
            <div className="gallery-item" key={index}>
              <div className="gallery-img-wrapper">
                <img src={img.url} alt={img.title} loading="lazy" />
                <div className="gallery-overlay">
                  <h4>{img.title}</h4>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ClinicGallery;
