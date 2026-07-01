import { useState } from "react";
import { useReveal } from "../hooks/useReveal";

const faqs = [
  {
    q: "Who does Ìsinmi support?",
    a: "Children, survivors of sexual abuse, schools, and communities committed to creating safer environments.",
  },
  {
    q: "How do your school outreaches work?",
    a: "We deliver interactive sessions using games, conversations, and age-appropriate learning to teach children about safety and abuse prevention.",
  },
  {
    q: "How can I support Ìsinmi?",
    a: "Volunteer, donate, partner with us, or help raise awareness in your community.",
  },
  {
    q: "How can my school or organization partner with Ìsinmi?",
    a: "Reach out to us, and we'll work together to design a program that meets your community's needs.",
  },
];

export default function Faq() {
  const headerRef = useReveal<HTMLDivElement>();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-white py-[30px] lg:py-12 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div
          ref={headerRef}
          className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-16"
        >
          {/* Header */}
          <div>
            <span className="text-sm font-semibold tracking-[0.2em] uppercase">
              <span className="text-[#1a4a47]">/</span>{" "}
              <span className="text-gray-900">FAQs</span>
            </span>
            <h2 className="mt-8 font-display text-gray-900 leading-[1.1] text-[clamp(2rem,4.2vw,3.25rem)]">
              Your Questions <span className="text-[#1a4a47]">Answered</span>
            </h2>
          </div>

          {/* Accordion */}
          <div className="border-t border-gray-200">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.q} className="border-b border-gray-200">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-6 py-6 sm:py-7 text-left"
                  >
                    <span className="text-lg sm:text-xl font-medium text-gray-900">
                      {item.q}
                    </span>
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 text-xl leading-none transition-transform duration-300"
                      style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                    >
                      +
                    </span>
                  </button>
                  <div
                    className="overflow-hidden transition-[max-height,opacity] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
                    style={{
                      maxHeight: isOpen ? 240 : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <p className="pb-7 pr-12 text-gray-600 text-base sm:text-lg leading-relaxed font-light max-w-2xl">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
