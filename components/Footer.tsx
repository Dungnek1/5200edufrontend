"use client";
import { useParams } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { getDashboardPath } from "@/lib/navigation-config";
import { useTranslations } from "next-intl";


const socialLinks = [
    {
        name: "Facebook",
        icon: Facebook,
        href: "https://www.facebook.com/5200ai",
    },
    // {
    //     name: "Twitter",
    //     icon: Twitter,
    //     href: "https://www.twitter.com/share/17csf7hejm/",
    // },
    // {
    //     name: "Instagram",
    //     icon: Instagram,
    //     href: "https://www.instagram.com/share/17csf7hejm/",
    // },
    // {
    //     name: "LinkedIn",
    //     icon: Linkedin,
    //     href: "https://www.linkedin.com/share/17csf7hejm/",
    // },
    // {
    //     name: "YouTube",
    //     icon: Youtube,
    //     href: "https://www.youtube.com/share/17csf7hejm/",
    // },
];

const footerLinks = {
    about: [
        { label: "aboutUs", href: "/about" },
        { label: "careers", href: "/careers" },
        { label: "press", href: "/press" },
        { label: "contact", href: "/contact" },
    ],
    support: [
        { label: "help", href: "/help" },
        { label: "safety", href: "/safety" },
        { label: "community", href: "/community" },
        { label: "faq", href: "/faq" },
    ],
    courses: [
        { label: "dev", href: "/courses/dev" },
        { label: "business", href: "/courses/business" },
        { label: "design", href: "/courses/design" },
        { label: "marketing", href: "/courses/marketing" },
    ],
    legal: [
        { label: "terms", href: "/terms" },
        { label: "privacy", href: "/privacy" },
        { label: "cookies", href: "/cookies" },
        { label: "accessibility", href: "/accessibility" },
    ],
};

export function Footer() {
    const params = useParams();
    const locale = (params.locale as string) || "vi";
    const { user } = useAuth();
    const t = useTranslations();


    const logoHref = getDashboardPath(user?.role, locale);

    return (
        <footer className="bg-white pb-8">
            <div className="max-w-full py-[32px] px-6 sm:px-8 lg:px-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-12 lg:gap-16 mb-12">

                    <div className="lg:col-span-2 flex flex-col items-start">
                        <div className="mb-4">
                            <Logo
                                href={logoHref}
                                size={120}
                                className="h-auto w-auto"
                            />
                        </div>
                        <p className="text-[#1B2961] font-semibold mb-6 text-sm" style={{ fontFamily: "Roboto, sans-serif" }}>
                            {t("footer.slogan")}
                        </p>
                        <div className="flex gap-3">
                            {socialLinks.map((social) => {
                                const IconComponent = social.icon;
                                return (
                                    <a
                                        key={social.name}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="transition-opacity hover:opacity-80 flex items-center justify-center w-10 h-10 rounded-lg border-2 border-[#4162e7]"
                                        aria-label={social.name}
                                    >
                                        <IconComponent className="w-5 h-5 text-[#4162e7]" />
                                    </a>
                                );
                            })}
                        </div>
                    </div>


                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12 lg:col-span-4">
                        <FooterColumn
                            title={t("footer.about")}
                            links={footerLinks.about}
                            locale={locale}
                        />
                        <FooterColumn
                            title={t("footer.support")}
                            links={footerLinks.support}
                            locale={locale}
                        />
                        <FooterColumn
                            title={t("footer.courses")}
                            links={footerLinks.courses}
                            locale={locale}
                        />
                        <FooterColumn
                            title={t("footer.legal")}
                            links={footerLinks.legal}
                            locale={locale}
                        />
                    </div>
                </div>


                <div className="border-t-[0.5px] border-[#CACDD9] pt-8 mt-4 flex flex-col md:flex-row justify-center items-center">
                    <p className="text-xs text-gray-400" style={{ fontFamily: "Roboto, sans-serif" }}>
                        {t("footer.copyright")}
                    </p>
                </div>
            </div>
        </footer>
    );
}

interface FooterColumnProps {
    title: string;
    links: { label: string; href: string }[];
    locale: string;
}

function FooterColumn({ title, links, locale }: FooterColumnProps) {
    const t = useTranslations();
    return (
        <div>
            <h4 className="font-bold text-gray-900 mb-4 text-sm" style={{ fontFamily: "Roboto, sans-serif", fontSize: "14px", lineHeight: "20px" }}>
                {title}
            </h4>
            <ul className="space-y-2.5">
                {links.map((link) => (
                    <li key={link.label}>
                        <span
                            className="text-sm text-gray-500"
                            style={{
                                fontFamily: "Roboto, sans-serif",
                                fontSize: "14px",
                                lineHeight: "20px"
                            }}
                        >
                            {t(`footer.links.${link.label}`)}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
