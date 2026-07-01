import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

const paragraph1 =
  "Ìsinmi, a Yoruba word meaning “rest,” is dedicated to protecting children from sexual abuse through education, advocacy, and community action while providing safe spaces where survivors can heal.";

const paragraph2 =
  "We believe every child deserves to grow up safe, and every survivor deserves to be heard, supported, and empowered. Our mission is to build communities across Nigeria and Africa that prevent sexual abuse, protect children, and promote healing for survivors.";

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
      <div className="sticky top-0 h-screen flex flex-col justify-center px-6 sm:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto w-full">
          <span className="block mb-6 sm:mb-8 text-xs tracking-[0.3em] text-[#1a4a47] font-semibold uppercase">
            / About Us
          </span>
          <Paragraph
            words={words1}
            startIndex={0}
            progress={scrollYProgress}
            className="text-[1.6rem] sm:text-3xl lg:text-[2.9rem] leading-snug font-light mb-6 sm:mb-8"
          />
          <Paragraph
            words={words2}
            startIndex={words1.length}
            progress={scrollYProgress}
            className="text-[1.6rem] sm:text-3xl lg:text-[2.9rem] leading-snug font-light"
          />
        </div>
      </div>
    </section>
  );
}
