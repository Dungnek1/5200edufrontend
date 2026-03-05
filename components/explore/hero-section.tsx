import { ArrowRight } from "lucide-react";
import Image from "next/image";

/**
 * HeroSection - Explore page hero with 2 large banners
 *
 * Design from Figma:
 * - Left banner: n8n Automation (Frame 21472272142.png)
 * - Right banner: OpenAI/AI (Frame 21472272231.png)
 */
export function HeroSection() {
  return (
    <div className="w-full">
      {/* Mobile: Single banner, Desktop: 2 banners side by side */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 items-stretch w-full">
        {/* Left Banner - n8n Automation - Always visible */}
        <div className="w-full sm:flex-1 aspect-[16/9] sm:aspect-[2/1] overflow-hidden relative rounded-lg sm:rounded-[8px]">
          <Image
            src="/images/placeholder-n8n-automation-banner.png.svg"
            alt="n8n Automation"
            fill
            className="object-cover rounded-lg sm:rounded-[8px]"
            sizes="(max-width: 640px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Right Banner - OpenAI/AI - Hidden on mobile, visible on tablet+ */}
        <div className="hidden sm:block sm:flex-1 aspect-[16/9] sm:aspect-[2/1] overflow-hidden relative rounded-lg sm:rounded-[8px]">
          <Image
            src="/images/placeholder-openai-blue-banner.png.svg"
            alt="OpenAI"
            fill
            className="object-cover rounded-lg sm:rounded-[8px]"
            sizes="(max-width: 640px) 100vw, 50vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}
