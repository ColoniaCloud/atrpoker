import { Instagram, Facebook, Youtube, X as XIcon, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const SOCIAL_LINKS: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Instagram", href: "https://instagram.com/atrpoker", icon: Instagram },
  { label: "Facebook", href: "https://facebook.com/atrpoker", icon: Facebook },
  { label: "X (Twitter)", href: "https://x.com/atr_poker", icon: XIcon },
  { label: "YouTube", href: "https://www.youtube.com/@AcademiaATR", icon: Youtube },
];

export function SocialLinks({
  className,
  iconClassName,
}: {
  className?: string;
  iconClassName?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          <Icon className={cn("h-3.5 w-3.5", iconClassName)} />
        </a>
      ))}
    </div>
  );
}
