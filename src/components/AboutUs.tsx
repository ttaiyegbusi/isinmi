import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const paragraph1 =
  "A Yoruba word meaning REST. Ìsinmi aims to provide rest for survivors of sexual abuse in Nigeria by building a community that promotes peace and sanity for survivors by leveraging education as a powerful tool to enlighten and eradicate sexual abuse within the country and Africa at large.";

const paragraph2 =
  "Our long-term mission is to help eradicate sexual abuse in Nigeria and across Africa through education, advocacy, and community support. We believe every survivor deserves a safe space to heal, to be heard, and to rebuild.";

const words1 = paragraph1.split(" ");
const words2 = paragraph2.split(" ");
const totalWords = words1.length + words2.length;

function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const color = useTransform(progress, range, ["#9ca3af", "#111827"]);
  return (
    <motion.span style={{ color }} className="inline-block">
      {children}&nbsp;
    </motion.span>
  );
}

function Paragraph({
  words,
  startIndex,
  progress,
  className,
}: {
  words: string[];
  startIndex: number;
  progress: MotionValue<number>;
  className?: string;
}) {
  return (
    <p className={className}>
      {words.map((word, i) => {
        const idx = startIndex + i;
        return (
          <Word key={i} progress={progress} range={[idx / totalWords, (idx + 1) / totalWords]}>
            {word}
          </Word>
        );
      })}
    </p>
  );
}

export default function AboutUs() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  return (
    <section id="about" ref={wrapperRef} className="relative bg-white" style={{ height: "140vh" }}>
      <div className="sticky top-0 h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20 pb-24">
        <div className="max-w-4xl mx-auto w-full">
          <span className="block mb-8 text-xs tracking-[0.3em] text-[#1a4a47] font-semibold uppercase">
            / About Us
          </span>
          <Paragraph
            words={words1}
            startIndex={0}
            progress={scrollYProgress}
            className="text-xl sm:text-2xl lg:text-3xl leading-relaxed font-light mb-8"
          />
          <Paragraph
            words={words2}
            startIndex={words1.length}
            progress={scrollYProgress}
            className="text-xl sm:text-2xl lg:text-3xl leading-relaxed font-light"
          />
        </div>
      </div>
    </section>
  );
}
