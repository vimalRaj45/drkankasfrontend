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

    // Standard Heart Path2D SVG definition (24x24 viewBox)
    const heartPath = new Path2D(
      "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
    );

    // Medical particles configuration (30 ultra-subtle, slow floating medical crosses & sparkles)
    const particleCount = 30;
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
        size: Math.random() * 8 + 8,                      // Size 8px to 16px
        speedY: Math.random() * 0.4 + 0.2,                // Super slow, gentle downward drift (0.2 to 0.6 px/s)
        swaySpeed: Math.random() * 0.01 + 0.003,
        swayAmount: Math.random() * 1.0 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005,
        opacity: Math.random() * 0.08 + 0.04,             // Whisper-soft opacity (0.04 to 0.12)
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

      const armWidth = size * 0.28;
      const armLength = size;
      const radius = armWidth / 3;

      ctx.beginPath();
      ctx.roundRect(-armLength / 2, -armWidth / 2, armLength, armWidth, radius);
      ctx.fill();

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
        const currentX = p.x + Math.sin(p.phase) * p.swayAmount * 8;

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
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full opacity-70"
    />
  );
};

export default AmbientBackground;
