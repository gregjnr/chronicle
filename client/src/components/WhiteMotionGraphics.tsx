import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  type: 'circle' | 'square' | 'cross' | 'ring';
  opacity: number;
  baseOpacity: number;
  rotation: number;
  vRot: number;
}

export const WhiteMotionGraphics: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Mouse coordinates for subtle interactive reaction
    let mouse = { x: width / 2, y: height / 2, active: false };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Initialize motion graphics particles
    const particleCount = Math.min(Math.floor((width * height) / 22000), 55);
    const particles: Particle[] = [];
    const types: Particle['type'][] = ['circle', 'square', 'cross', 'ring'];

    for (let i = 0; i < particleCount; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const baseOpacity = 0.12 + Math.random() * 0.22;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        size: type === 'cross' ? 4 + Math.random() * 3 : 2 + Math.random() * 3.5,
        type,
        opacity: baseOpacity,
        baseOpacity,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.02,
      });
    }

    // Floating architectural geometric grid rings
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.003;

      // 1. Draw subtle floating architectural rings in background
      ctx.save();
      ctx.strokeStyle = '#FFFFFF';

      // Ring 1 (Top Right quadrant)
      ctx.globalAlpha = 0.035;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width * 0.82 + Math.cos(angle) * 30, height * 0.22 + Math.sin(angle) * 20, 160, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([4, 12]);
      ctx.beginPath();
      ctx.arc(width * 0.82 + Math.cos(angle) * 30, height * 0.22 + Math.sin(angle) * 20, 190, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ring 2 (Bottom Left quadrant)
      ctx.beginPath();
      ctx.arc(width * 0.15 + Math.sin(angle * 0.8) * 25, height * 0.78 + Math.cos(angle * 0.8) * 25, 220, 0, Math.PI * 2);
      ctx.stroke();

      ctx.setLineDash([6, 14]);
      ctx.beginPath();
      ctx.arc(width * 0.15 + Math.sin(angle * 0.8) * 25, height * 0.78 + Math.cos(angle * 0.8) * 25, 250, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();

      // 2. Connect nearby particles with solid white lines
      const maxDistance = 140;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * 0.12;
            ctx.strokeStyle = '#FFFFFF';
            ctx.globalAlpha = alpha;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Update & render each particle
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion physics
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.vRot;

        // Subtle mouse push if mouse is nearby
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 120 && mdist > 0) {
            const force = (120 - mdist) / 120;
            p.x += (mdx / mdist) * force * 0.8;
            p.y += (mdy / mdist) * force * 0.8;
          }
        }

        // Screen boundary wrap
        if (p.x < -20) p.x = width + 20;
        else if (p.x > width + 20) p.x = -20;
        if (p.y < -20) p.y = height + 20;
        else if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = '#FFFFFF';
        ctx.strokeStyle = '#FFFFFF';
        ctx.globalAlpha = p.opacity;

        // Draw shape based on type
        if (p.type === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.type === 'ring') {
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 1.5, 0, Math.PI * 2);
          ctx.stroke();
        } else if (p.type === 'square') {
          ctx.lineWidth = 1;
          ctx.strokeRect(-p.size, -p.size, p.size * 2, p.size * 2);
        } else if (p.type === 'cross') {
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);
          ctx.lineTo(p.size, 0);
          ctx.moveTo(0, -p.size);
          ctx.lineTo(0, p.size);
          ctx.stroke();
        }

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 w-full h-full"
      style={{ opacity: 0.85 }}
      aria-hidden="true"
    />
  );
};
