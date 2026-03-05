import { FileText, PlayCircle } from "lucide-react";

const getIcon = (mimeType: string) => {
    if (mimeType?.startsWith('video/')) return <PlayCircle className="w-5 h-5 text-[#4162e7]" />;
    return <FileText className="w-5 h-5 text-[#4162e7]" />;
};
export default getIcon;