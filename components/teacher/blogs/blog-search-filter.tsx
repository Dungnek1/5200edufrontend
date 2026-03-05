import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

interface BlogSearchFilterProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    statusFilter: string;
    onStatusChange: (value: string) => void;
}

export function BlogSearchFilter({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
}: BlogSearchFilterProps) {
    const t = useTranslations();

    return (
        <div className="flex gap-[8px] items-center justify-end">
            <div className="w-[380px] cursor-pointer">
                <div className="bg-[#fafafa] h-[40px] rounded-[8px] px-[12px] py-[4px] flex gap-[8px] items-center">
                    <Search className="h-6 w-6 text-[#7f859d] shrink-0" />
                    <Input
                        placeholder={t("blog.search.placeholder")}
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="flex-1 h-auto p-0 border-0 text-[14px] text-[#7f859d] placeholder:text-[#7f859d] focus-visible:ring-0 cursor-pointer"
                    />
                </div>
            </div>

            <Select value={statusFilter} onValueChange={onStatusChange}>
                <SelectTrigger className="w-[180px] h-[40px] bg-[#fafafa] border-0 rounded-[8px] cursor-pointer">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all" className="cursor-pointer">{t("blog.filter.all")}</SelectItem>
                    <SelectItem value="PUBLISHED" className="cursor-pointer">{t("blog.filter.published")}</SelectItem>
                    <SelectItem value="DRAFT" className="cursor-pointer">{t("blog.filter.draft")}</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}
