import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  iconBgColor: string;
  change?: {
    value: number;
    isIncrease: boolean;
  };
  comparisonText?: string;
}

const StatCard = ({
  title,
  value,
  icon,
  iconBgColor,
  change,
  comparisonText = "vs last week",
}: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
        </div>
        <div className={cn("p-3 rounded-full", iconBgColor)}>
          <i className={`fas fa-${icon} text-xl`}></i>
        </div>
      </div>
      {change && (
        <div className="mt-2 flex items-center">
          <span
            className={cn(
              "text-sm font-medium flex items-center",
              change.isIncrease ? "text-success" : "text-error"
            )}
          >
            <i
              className={`fas fa-arrow-${
                change.isIncrease ? "up" : "down"
              } mr-1`}
            ></i>{" "}
            {Math.abs(change.value)}%
          </span>
          <span className="text-sm text-gray-500 ml-2">{comparisonText}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
