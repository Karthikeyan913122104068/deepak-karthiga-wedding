import React, { useEffect, useRef } from 'react';

export default function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles = [];
    const particleCount = 26;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * (canvas.width || 400);
        this.y = Math.random() * (canvas.height || 700);
        this.size = Math.random() * 2.2 + 0.8;
        this.speedY = Math.random() * 0.5 + 0.2;
        this.opacity = Math.random() * 0.6 + 0.2;
        this.type = Math.random() > 0.75 ? 'petal' : 'gold';
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.02;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.02) * 0.3;
        this.rotation += this.rotSpeed;

        if (this.y > canvas.height + 10) {
          this.y = -10;
          this.x = Math.random() * canvas.width;
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.opacity;

        if (this.type === 'gold') {
          ctx.fillStyle = '#D4AF37';
          ctx.shadowBlur = 5;
          ctx.shadowColor = '#FFF2C6';
          ctx.beginPath();
          ctx.arc(0, 0, this.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = '#A31C2D';
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size * 2, this.size * 3.2, Math.PI / 4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animId;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
}
