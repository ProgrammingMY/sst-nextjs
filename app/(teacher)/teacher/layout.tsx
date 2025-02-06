import Navbar from "@/components/navbar";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { SidebarProvider } from "@/components/ui/sidebar";

const TeacherLayout = async ({
    children,
}: { children: React.ReactNode }) => {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session) {
        return redirect("/login");
    }

    // if (!isTeacher(session.user.id)) {
    //     return redirect("/user");
    // }

    return (
        <SidebarProvider>
            <div className="h-[80px] fixed w-full top-0 z-40 block md:hidden">
                <Navbar />
            </div>
            <DashboardSidebar user={session.user} />
            <main className="h-full w-full mt-6 pt-[80px] md:pt-0">
                {children}
            </main>
        </SidebarProvider>
    );
}

export default TeacherLayout;