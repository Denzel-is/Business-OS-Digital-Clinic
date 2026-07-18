import Image from "next/image";
import { Film } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function HeroMedia() {
  return (
    <figure className="relative min-h-[28rem] overflow-hidden rounded-panel border border-line bg-surface lg:min-h-[42rem]">
      <Image
        alt=""
        className="object-cover"
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 48vw"
        src="/media/hero-poster.svg"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-canvas/35" />
      <div
        aria-hidden="true"
        className="media-scan-line absolute inset-x-0 top-0 h-px bg-accent/60"
      />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-4 border-b border-white/10 p-5">
        <Badge tone="stable">Media slot / ready</Badge>
        <span className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-white/55">
          16:9 / poster
        </span>
      </div>
      <figcaption className="absolute inset-x-5 bottom-5 rounded-control border border-white/10 bg-canvas/90 p-5 sm:inset-x-auto sm:right-5 sm:max-w-sm">
        <div className="flex items-start gap-3">
          <Film aria-hidden="true" className="mt-1 size-5 shrink-0 text-accent" />
          <div>
            <p className="text-sm font-semibold text-ink">
              Подготовлен безопасный media placeholder
            </p>
            <p className="mt-1 text-xs leading-5 text-ink-muted">
              Реальное лицензированное видео будет подключено без AI-генерации на motion-этапе.
            </p>
          </div>
        </div>
      </figcaption>
    </figure>
  );
}
