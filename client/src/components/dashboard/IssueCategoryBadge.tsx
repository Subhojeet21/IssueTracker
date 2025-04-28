import { getCategoryIcon } from "@/lib/utils";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Category } from "@shared/schema";

interface IssueCategoryBadgeProps {
    category: Category;
}

const IssueCategoryBadge = ({ category }: IssueCategoryBadgeProps) => {
  const colorClass = getCategoryIcon(category);
  const label = CATEGORY_LABELS[category];

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
};

export default IssueCategoryBadge;
