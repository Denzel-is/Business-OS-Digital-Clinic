import { Badge } from "@/components/ui/badge";

interface SectionIntroProps {
  description: string;
  eyebrow: string;
  id?: string;
  title: string;
}

export function SectionIntro({ description, eyebrow, id, title }: SectionIntroProps) {
  return (
    <div className="max-w-4xl">
      <Badge>{eyebrow}</Badge>
      <h2
        className="text-balance mt-6 text-4xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl"
        id={id}
      >
        {title}
      </h2>
      <p className="mt-6 max-w-2xl text-base leading-7 text-ink-muted sm:text-lg">{description}</p>
    </div>
  );
}
