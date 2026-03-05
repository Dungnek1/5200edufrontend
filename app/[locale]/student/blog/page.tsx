import { redirect } from "next/navigation";

interface BlogLegacyPageProps {
  params: { locale: string };
}

export default function BlogLegacyPage({ params }: BlogLegacyPageProps) {
  redirect(`/${params.locale}/events`);
}


