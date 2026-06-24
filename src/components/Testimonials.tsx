import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    name: "Amara O.",
    role: "Survivor, Lagos",
    initials: "AO",
    color: "#2a7a74",
    quote:
      "Isinmi gave me back something I thought I had lost forever — my sense of safety. I was able to speak my truth in a space that truly held me with care.",
  },
  {
    name: "Fatima B.",
    role: "Community Member, Abuja",
    initials: "FB",
    color: "#1a4a47",
    quote:
      "I came here broken, unsure if healing was even possible for me. The community showed me it was. I am not just surviving anymore — I am living.",
  },
  {
    name: "Ngozi E.",
    role: "Advocate, Port Harcourt",
    initials: "NE",
    color: "#3d9e96",
    quote:
      "As a community advocate, I have seen firsthand how Isinmi's approach to education and peer support changes lives. This work is necessary and it is urgent.",
  },
  {
    name: "Chisom A.",
    role: "Survivor, Enugu",
    initials: "CA",
    color: "#0d5c58",
    quote:
      "The mentorship I received through Isinmi helped me navigate the legal process. I didn't have to do it alone, and that made all the difference.",
  },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const go = (dir: 1 | -1) => {
    if (cardRef.current) {
      cardRef.current.style.opacity = "0";
      cardRef.current.style.transform = `translateX(${dir > 0 ? 40 : -40}px)`;
    }
    setTimeout(() => {
      setActive((prev) => (prev + dir + testimonials.length) % testimonials.length);
      if (cardRef.current) {
        cardRef.current.style.transition = "none";
        cardRef.current.style.opacity = "0";
        cardRef.current.style.transform = `translateX(${dir > 0 ? -40 : 40}px)`;
        setTimeout(() => {
          if (cardRef.current) {
            cardRef.current.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            cardRef.current.style.opacity = "1";
            cardRef.current.style.transform = "translateX(0)";
          }
        }, 20);
      }
    }, 250);
  };

  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    }
  }, []);



  return (
    <section id="testimonials" className="bg-white py-24 sm:py-32 px-6 sm:px-12 lg:px-20">
      <div className="max-w-6xl mx-auto">
        {/* Header row */}
        <div className="flex items-end justify-between mb-16 flex-wrap gap-6">
          <div>
            <span className="text-[#1a4a47] text-xs tracking-[0.3em] font-medium uppercase">
              / Testimonials
            </span>
            <h2 className="mt-4 font-display font-bold text-3xl sm:text-4xl text-gray-900 leading-tight max-w-sm">
              Let's see what people have to say about us.
            </h2>
          </div>
          {/* Nav buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => go(-1)}
              className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-[#1a4a47] hover:text-[#1a4a47] transition-all duration-200 group"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#1a4a47]" />
            </button>
            <button
              onClick={() => go(1)}
              className="w-12 h-12 rounded-full bg-[#1a4a47] flex items-center justify-center hover:bg-[#1f5c58] transition-colors duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {testimonials.map((testimonial, i) => (
            <div
              key={testimonial.name}
              onClick={() => setActive(i)}
              className={`rounded-2xl p-6 cursor-pointer transition-all duration-400 ${
                i === active
                  ? "bg-[#1a4a47] shadow-xl shadow-[#1a4a47]/20 scale-[1.02]"
                  : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold mb-4"
                style={{ backgroundColor: i === active ? "#3d9e96" : testimonial.color }}
              >
                {testimonial.initials}
              </div>
              <p
                className={`text-sm leading-relaxed mb-4 font-light ${
                  i === active ? "text-white/90" : "text-gray-600"
                }`}
              >
                "{testimonial.quote}"
              </p>
              <div>
                <div className={`font-semibold text-sm ${i === active ? "text-white" : "text-gray-900"}`}>
                  {testimonial.name}
                </div>
                <div className={`text-xs mt-0.5 ${i === active ? "text-white/60" : "text-gray-400"}`}>
                  {testimonial.role}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex gap-2 justify-center mt-8">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-6 bg-[#1a4a47]" : "w-1.5 bg-gray-300"
              }`}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
