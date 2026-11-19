import Image from "next/image";

/* Screenshots of the shipped app, the same ones on the Melange site. */
const SHOTS = [
  { src: "/melange/explore.webp", alt: "Melange Explore tab: shoots people made together" },
  { src: "/melange/discover.webp", alt: "Melange Discover: a creative's card with pass and heart" },
  { src: "/melange/showcase.webp", alt: "Melange showcase page crediting everyone on a shoot" },
];

export function PhoneRow({ priority = false }: { priority?: boolean }) {
  return (
    <div className="fig overflow-hidden bg-paper-2 px-5 pt-7 sm:px-8 sm:pt-9">
      <div className="mx-auto flex max-w-[460px] items-start justify-center gap-3 sm:gap-4">
        {SHOTS.map((s, i) => (
          <div
            key={s.src}
            className={`relative w-1/3 overflow-hidden rounded-t-[18px] border-[4px] border-b-0 border-[var(--color-ink)] bg-black sm:rounded-t-[22px] ${
              i === 1 ? "" : "mt-7 sm:mt-9"
            }`}
            style={{ aspectRatio: i === 1 ? "603 / 1180" : "603 / 1090" }}
          >
            <Image
              src={s.src}
              alt={s.alt}
              fill
              sizes="(max-width: 640px) 30vw, 150px"
              priority={priority}
              className="object-cover object-top"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
