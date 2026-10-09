import { Marquee } from "@/components/motion/marquee";
import { UniversityCard } from "@/components/universities/university-card";
import { resolveUniversityMedia } from "@/lib/university-media";

export function UniversityMarquee() {
  const universities = resolveUniversityMedia();

  if (universities.length === 0) return null;

  return (
    <Marquee
      className="border-y border-[rgb(255_255_255/0.10)] bg-hope-midnight py-6"
      duration={60}
    >
      {universities.map((university) => (
        <UniversityCard
          key={university.src}
          image={university.src}
          name={university.name}
        />
      ))}
    </Marquee>
  );
}