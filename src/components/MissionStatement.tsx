import { useReveal } from "../hooks/useReveal";

export default function MissionStatement() {
  const paraRef = useReveal<HTMLParagraphElement>();
  const headRef = useReveal<HTMLHeadingElement>(150);

  return (
    <section className="bg-white py-28 sm:py-36 lg:py-44">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-16">
          {/* Label */}
          <div>
            <span className="text-sm font-semibold tracking-[0.2em] uppercase">
              <span className="text-[#1a4a47]">/</span>{" "}
              <span className="text-gray-900">About Us</span>
            </span>
          </div>

          {/* Content */}
          <div>
            <p
              ref={paraRef}
              className="text-gray-600 text-lg sm:text-xl leading-relaxed font-light max-w-2xl"
            >
              Consider a world where rape doesn't exist. Envision being a woman not having to
              carry safety tools like pepper spray. Imagine a survivor, after enduring immense
              trauma alone, discovering a hub that provides access to mental health services,
              peer support, legal aid, financial assistance, mentorship, and, if necessary,
              accommodation.
            </p>

            <h2
              ref={headRef}
              className="mt-20 lg:mt-28 font-display font-black leading-[0.95] text-[clamp(3rem,9vw,7.5rem)]"
              style={{ letterSpacing: "-0.02em" }}
            >
              <span className="text-gray-900">At </span>
              <span className="text-[#1a4a47]">Ìsinmi,</span>
              <br />
              <span className="text-gray-900">
                We are that
                <br />
                Refuge.
              </span>
            </h2>
          </div>
        </div>
      </div>
    </section>
  );
}
