import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function TableIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...stroke} {...props}>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M9 9.5v10" />
    </svg>
  );
}

export function MaskIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...stroke} {...props}>
      <path d="M4 8.5h6.5M4 12h10M4 15.5h7" />
      <path d="M15.5 7.5h4v9h-4" />
    </svg>
  );
}

export function CloudIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...stroke} {...props}>
      <path d="M7.5 17.5h8.2a3.3 3.3 0 0 0 .4-6.6 4.6 4.6 0 0 0-8.8 1.3A2.8 2.8 0 0 0 7.5 17.5Z" />
    </svg>
  );
}

export function ReturnIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...stroke} {...props}>
      <path d="M8 8.5H5.5v-3" />
      <path d="M5.8 8.4A6.5 6.5 0 1 1 6.2 16" />
      <path d="M12 10.5v3.2l2 1.3" />
    </svg>
  );
}

export function LockIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" {...stroke} {...props}>
      <rect x="5.5" y="10.5" width="13" height="9" rx="1.5" />
      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
    </svg>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...stroke} {...props}>
      <path d="M5 12.5 9.2 17 19 7.5" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" {...stroke} {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}
