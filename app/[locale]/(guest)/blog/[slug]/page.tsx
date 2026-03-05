import { redirect } from "next/navigation";

interface BlogLegacyDetailPageProps {
  params: { locale: string; slug: string };
}

export default function BlogLegacyDetailPage({
  params,
}: BlogLegacyDetailPageProps) {
  redirect(`/${params.locale}/events`);
}


