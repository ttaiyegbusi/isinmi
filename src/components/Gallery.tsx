import { useReveal } from "../hooks/useReveal";

const photos = [
  { src: "/gallery/g-2.jpg", alt: "A student holding an Ìsinmi affirmation card during an outreach" },
  { src: "/gallery/g-5.jpg", alt: "Ìsinmi team speaking with students in a school courtyard" },
  { src: "/gallery/g-3.jpg", alt: "Students smiling with their affirmation cards" },
  { src: "/gallery/g-1.jpg", alt: "Students speaking during a school outreach session" },
  { src: "/gallery/g-7.jpg", alt: "An Ìsinmi facilitator addressing a school assembly" },
  { src: "/gallery/g-4.jpg", alt: "Students holding 'You Got This' and 'My body, My rules' cards" },
  { src: "/gallery/g-heic-0045.jpg", alt: "Ìsinmi at the Isange One Stop Centre" },
  { src: "/gallery/g-6.jpg", alt: "Group photo after a school outreach" },
  { src: "/gallery/g-heic-0035.jpg", alt: "Partnership visit to the Isange One Stop Centre" },
];

export default function Gallery() {
  const headerRef = useReveal<HTMLDivElement>();

  return (
    <section id="gallery" className="bg-white py-[100px]">
      <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20">
        <div ref={headerRef} className="mb-12 lg:mb-16">
          <span className="text-sm font-semibold tracking-[0.2em] uppercase">
            <span className="text-[#1a4a47]">/</span>{" "}
            <span className="text-gray-900">Gallery</span>
          </span>
          <h2 className="mt-6 font-display text-gray-900 leading-[1.1] text-[clamp(2rem,4.2vw,3.25rem)] max-w-2xl">
            Moments from our <span className="text-[#1a4a47]">work</span> in the community.
          </h2>
        </div>

        {/* Masonry via CSS columns — handles the mixed portrait/landscape shots */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5">
          {photos.map((p) => (
            <div
              key={p.src}
              className="mb-4 sm:mb-5 break-inside-avoid overflow-hidden rounded-2xl bg-gray-100"
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
