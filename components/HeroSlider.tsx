"use client";

import { useState, useEffect } from "react";

const SLIDES = [
  {
    title: "Aprendé poker como un verdadero estratega",
    description:
      "Más de 100 clases grabadas en video a tu disposicion para que aprendas en tu vibe, tablas y muchos recursos más.",
  },
  {
    title: "Habla con nosotros, te asesoramos para que tomes decisiones.",
    description:
      "En ATR Poker nos gusta ser sinceros y directos, charlamos, conocemos tu forma de juego y te recomendamos tu mejor opcion. Tu tomas la decision.",
  },
] as const;

const SLIDE_DURATION = 5500; // 3.5 segundos
const TRANSITION_DURATION = 1200; // 1.2 segundos

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
        setIsTransitioning(false);
      }, TRANSITION_DURATION);
    }, SLIDE_DURATION);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = SLIDES[currentIndex];

  return (
    <div className="relative">
      <h1
        className={`mb-6 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-foreground text-center transition-all ${
          isTransitioning
            ? "opacity-0 translate-x-8 blur-sm"
            : "opacity-100 translate-x-0 blur-0"
        }`}
        style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
      >
        {currentSlide.title.includes("estratega") ? (
          <>
            Aprendé poker como un{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
              verdadero estratega
            </span>
          </>
        ) : (
          <>
            <span className="bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">
              Habla con nosotros
            </span>
            , te asesoramos para que tomes decisiones.
          </>
        )}
      </h1>

      <p
        className={`mx-auto mb-8 max-w-2xl text-base sm:text-lg lg:text-xl text-muted-foreground text-center transition-all ${
          isTransitioning
            ? "opacity-0 -translate-x-8 blur-sm"
            : "opacity-100 translate-x-0 blur-0"
        }`}
        style={{ transitionDuration: `${TRANSITION_DURATION}ms` }}
      >
        {currentSlide.description}
      </p>

      {/* Dots de navegación */}
      <div className="flex items-center justify-center gap-2 mb-10">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setCurrentIndex(index);
                setIsTransitioning(false);
              }, TRANSITION_DURATION);
            }}
            className={`relative h-2 rounded-full transition-all duration-500 before:absolute before:inset-0 before:-m-4 before:content-[''] ${
              index === currentIndex
                ? "w-8 bg-amber-500"
                : "w-2 bg-zinc-600 hover:bg-zinc-500"
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
