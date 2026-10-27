import Image from "next/image";

type LogoProps = {
  on: "light" | "navy";
};

export function Logo({ on }: LogoProps) {
  const src = on === "light" ? "/brand/shirma-light.svg" : "/brand/shirma-dark.svg";
  return (
    <Image
      className="logo-img"
      src={src}
      alt="Ширма"
      width={180}
      height={39}
      unoptimized
    />
  );
}
