import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/courses-list";
import { CheckCircle, Clock } from "lucide-react";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/info-card";
import { headers } from "next/headers";
import { auth } from "@/auth";


async function Dashboard() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) {
        return redirect("/login");
    }

    const {
        completedCourses,
        coursesInProgress,
    } = await getDashboardCourses(session.user.id);

    return (
        <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoCard
                    icon={Clock}
                    label="Courses in progress"
                    numberOfItems={coursesInProgress.length}
                    variant="default"
                />
                <InfoCard
                    icon={CheckCircle}
                    label="Courses completed"
                    numberOfItems={completedCourses.length}
                    variant="success"
                />
            </div>
            <CoursesList
                items={[...coursesInProgress, ...completedCourses]}
            />
        </div>
    )
}

export default Dashboard