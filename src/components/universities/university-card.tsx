"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type UniversityCardProps = {
  image: string;
  name: string;
};

export function UniversityCard({ image, name }: UniversityCardProps) {
  const errorCaptured = useRef(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="relative mx-2 block h-60 w-44 shrink-0 overflow-hidden rounded-[1.25rem] border border-[rgb(255_255_255/0.10)] bg-hope-midnight sm:h-72 sm:w-54">
      {failed ? null : (
        <Image
          src={image}
          alt=""
          fill
          sizes="(max-width: 640px) 176px, 216px"
          className="object-cover"
          onErrorCapture={() => {
            if (errorCaptured.current) return;
            errorCaptured.current = true;
            setFailed(true);
          }}
        />
      )}
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_top,var(--hope-midnight),rgb(var(--hope-midnight-rgb)/0.72)_38%,rgb(var(--hope-midnight-rgb)/0.15)_70%,transparent)]"
      />
      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
        <span className="min-w-0 font-display text-sm font-bold leading-snug tracking-[0.08em] break-words uppercase text-hope-white">
          {name}
        </span>
      </span>
    </div>
  );
}