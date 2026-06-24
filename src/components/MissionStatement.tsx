import { useReveal } from "../hooks/useReveal";

export default function MissionStatement() {
  const introRef = useReveal();
  const ref = useReveal();

  return (
    <section className="bg-white py-24 sm:py-36 px-6 sm:px-12 lg:px-20">
      <div className="max-w-5xl mx-auto">
        {/* Editorial intro paragraph */}
        <div ref={introRef} className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-10 lg:gap-20 mb-20">
          <div />
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-light max-w-xl">
            Consider a world where rape doesn't exist. Envision being a woman not having to carry
            safety tools like pepper spray. Imagine a survivor, after enduring immense trauma
            alone, discovering a hub that provides access to mental health services, peer support,
            legal aid, financial assistance, mentorship, and if necessary, accommodation.
          </p>
        </div>

        {/* Statement */}
        <div ref={ref}>
          <h2
            className="font-display font-black leading-[0.95] text-[clamp(3rem,8vw,7rem)] text-gray-900"
            style={{ letterSpacing: "-0.02em" }}
          >
            At{" "}
            <em className="text-[#1a4a47] not-italic">Isinmi,</em>
            <br />
            We are that
            <br />
            Refuge.
          </h2>
        </div>
      </div>
    </section>
  );
}
