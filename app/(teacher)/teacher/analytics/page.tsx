import { getAnalytics } from "@/actions/get-analytics";
import { redirect } from "next/navigation";
import { DataCard } from "./_components/data-card";
import { Chart } from "./_components/chart";

import { auth } from "@/auth";
import { headers } from "next/headers";

async function Analytics() {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session) {
    return redirect("/login");
  }

  const {
    data,
    totalRevenue,
    totalSales,
  } = await getAnalytics(session.user.id);


  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <DataCard
          label="Total revenue"
          value={totalRevenue}
          shouldFormat
        />
        <DataCard
          label="Total sales"
          value={totalSales}
        />
      </div>
      <Chart
        data={data}
      />
    </div>
  )
}

export default Analytics