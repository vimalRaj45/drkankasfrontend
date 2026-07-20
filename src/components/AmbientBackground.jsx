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

    // Green Hearts configuration (32 floating green hearts 💚)
    const heartCount = 32;
    const hearts = [];

    const greenColors = [
      'rgba(16, 185, 129, opacity)',  // Clinical Emerald Green
      'rgba(34, 197, 94, opacity)',   // Bright Jade Green
      'rgba(13, 148, 136, opacity)',  // Medical Teal-Green
      'rgba(5, 150, 105, opacity)',   // Soft Mint Health Green
    ];

    for (let i = 0; i < heartCount; i++) {
      hearts.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 10 + 12,            // Size between 12px and 22px
        speedY: Math.random() * 0.35 + 0.2,       // Gentle downward drift speed
        swaySpeed: Math.random() * 0.01 + 0.004,  // Sway speed
        beatSpeed: Math.random() * 0.04 + 0.02,   // Heartbeat pulse speed
        swayAmount: Math.random() * 1.0 + 0.4,    // Sway amplitude
        opacity: Math.random() * 0.08 + 0.04,     // Subtle opacity (0.04 to 0.12) for light theme
        colorTemplate: greenColors[Math.floor(Math.random() * greenColors.length)],
        phase: Math.random() * Math.PI * 2,
        beatPhase: Math.random() * Math.PI * 2,
      });
    }

    // Draw Beating Green Heart using Path2D
    const drawGreenHeart = (ctx, x, y, size, opacity, pulseScale, colorTemplate) => {
      ctx.save();
      ctx.translate(x, y);
      const scale = (size / 24) * pulseScale;
      ctx.scale(scale, scale);
      ctx.translate(-12, -12); // Center scale origin

      const fillColor = colorTemplate.replace('opacity', opacity.toFixed(2));
      ctx.fillStyle = fillColor;
      ctx.shadowColor = fillColor;
      ctx.shadowBlur = 6;
      ctx.fill(heartPath);
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Animate and draw Beating Green Hearts smoothly
      hearts.forEach((heart) => {
        // Fall down smoothly
        heart.y += heart.speedY;

        // Sway gently side to side
        heart.phase += heart.swaySpeed;
        const currentX = heart.x + Math.sin(heart.phase) * heart.swayAmount * 8;

        // Heartbeat pulse animation
        heart.beatPhase += heart.beatSpeed;
        const pulseScale = 1 + Math.sin(heart.beatPhase * 3) * 0.12;

        // Reset to top when falling past bottom
        if (heart.y > height + 25) {
          heart.y = -25;
          heart.x = Math.random() * width;
        }

        drawGreenHeart(ctx, currentX, heart.y, heart.size, heart.opacity, pulseScale, heart.colorTemplate);
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
      className="fixed inset-0 pointer-events-none z-[99] w-full h-full opacity-100"
    />
  );
};

export default AmbientBackground;
