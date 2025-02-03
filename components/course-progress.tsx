import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CourseProgressProps {
    variant: "success" | "default";
    value: number;
    size?: "sm" | "default";
}

const colorByVariant = {
    success: "text-emerald-700",
    default: "text-sky-700",
}

const sizeBySize = {
    sm: "text-xs",
    default: "text-sm",
}

export const CourseProgress = ({
    variant,
    value,
    size,
}: CourseProgressProps) => {
    return (
        <div>
            <Progress
                className="h-2 bg-slate-300"
                value={value}
                variant={variant}
            />
            <p className={cn(
                "font-medium mt-2 text-sky-700",
                colorByVariant[variant || "default"],
                sizeBySize[size || "default"],
            )}>
                {Math.round(value)}% Complete
            </p>
        </div>
    )
}
