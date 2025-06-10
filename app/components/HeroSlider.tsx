import { useState, useEffect, useRef } from 'react';

const slides = [
  { id: 1, title: 'Slide One', image: 'app/assets/HerosliderImage/desktopslide1.webp' },
  { id: 2, title: 'Slide Two', image: 'app/assets/HerosliderImage/desktopslide2.webp' },
  { id: 3, title: 'Slide Three', image: 'app/assets/HerosliderImage/desktopslide3.webp' },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<NodeJS.Timeout | null>(null);

  const SLIDE_DURATION = 4000;

  const startAutoSlide = () => {
    stopAutoSlide();

    setProgress(0);
    let startTime = Date.now();

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const percent = Math.min((elapsed / SLIDE_DURATION) * 100, 100);
      setProgress(percent);

      if (percent >= 100) {
        setCurrent((prev) => (prev + 1) % slides.length);
        startAutoSlide();
      }
    }, 50);
  };

  const stopAutoSlide = () => {
    if (progressRef.current) clearInterval(progressRef.current);
  };

  useEffect(() => {
    startAutoSlide();
    return () => stopAutoSlide();
  }, []);

  const goToSlide = (index: number) => {
    setCurrent(index);
    startAutoSlide();
  };

  return (
    <div className="relative w-full h-[600px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === current ? 'opacity-100 z-20 pointer-events-auto' : 'opacity-0 z-10 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        </div>
      ))}

      {/* Long Dot Progress Bars */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 w-[200px] z-[99]">
        {slides.map((_, index) => (
          <div
            key={index}
            onClick={() => goToSlide(index)}
            className="relative w-full h-1 bg-white/30 rounded cursor-pointer overflow-hidden"
          >
            {/* Progress Fill */}
            <div
              className={`absolute top-0 left-0 h-full bg-red-600 ${
                index === current ? 'w-full' : 'w-0' // Only active dot fills
              }`}
              style={{
                width: index === current ? `${progress}%` : '0%', // Active dot progresses
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
