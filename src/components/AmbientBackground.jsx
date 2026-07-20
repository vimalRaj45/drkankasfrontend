import React, { useEffect, useRef } from 'react';

const AmbientBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Medical particles configuration (35 floating medical crosses & health sparkles)
    const particleCount = 40;
    const particles = [];

    const medicalColors = [
      'rgba(13, 148, 136, opacity)',  // Clinical Teal Primary
      'rgba(37, 99, 235, opacity)',   // Ocean Blue
      'rgba(14, 165, 233, opacity)',  // Soft Sky Blue
      'rgba(99, 102, 241, opacity)',  // Soft Indigo
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        type: Math.random() > 0.4 ? 'cross' : 'sparkle', // 60% Medical Crosses (+), 40% Sparkles
        size: Math.random() * 10 + 8,                     // Size 8px to 18px
        speedY: Math.random() * 1.0 + 0.5,                 // Downward speed
        swaySpeed: Math.random() * 0.015 + 0.005,
        swayAmount: Math.random() * 1.2 + 0.4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        opacity: Math.random() * 0.16 + 0.10,             // Subtle, non-distracting (0.10 to 0.26)
        colorTemplate: medicalColors[Math.floor(Math.random() * medicalColors.length)],
        phase: Math.random() * Math.PI * 2,
      });
    }

    // Draw Medical Cross (+)
    const drawMedicalCross = (ctx, x, y, size, rotation, opacity, colorTemplate) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      const color = colorTemplate.replace('opacity', opacity.toFixed(2));
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 4;

      const armWidth = size * 0.28;
      const armLength = size;

      // Rounded bar corners for medical icon aesthetic
      const radius = armWidth / 3;

      // Horizontal bar
      ctx.beginPath();
      ctx.roundRect(-armLength / 2, -armWidth / 2, armLength, armWidth, radius);
      ctx.fill();

      // Vertical bar
      ctx.beginPath();
      ctx.roundRect(-armWidth / 2, -armLength / 2, armWidth, armLength, radius);
      ctx.fill();

      ctx.restore();
    };

    // Draw Health Sparkle Dot
    const drawSparkle = (ctx, x, y, size, opacity, colorTemplate) => {
      ctx.save();
      ctx.translate(x, y);
      const color = colorTemplate.replace('opacity', opacity.toFixed(2));
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 5;

      ctx.beginPath();
      ctx.arc(0, 0, size / 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Animate & draw medical particles
      particles.forEach((p) => {
        // Downward drift
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Side-to-side sway
        p.phase += p.swaySpeed;
        const currentX = p.x + Math.sin(p.phase) * p.swayAmount * 10;

        // Reset to top when falling past bottom
        if (p.y > height + 25) {
          p.y = -25;
          p.x = Math.random() * width;
        }

        if (p.type === 'cross') {
          drawMedicalCross(ctx, currentX, p.y, p.size, p.rotation, p.opacity, p.colorTemplate);
        } else {
          drawSparkle(ctx, currentX, p.y, p.size, p.opacity, p.colorTemplate);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full opacity-80"
    />
  );
};

export default AmbientBackground;
