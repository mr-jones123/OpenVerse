import { DataTable } from "@/components/aral-table/data-table";
import { getAllResources } from "@/lib/db/queries";
import { columns } from "@/components/aral-table/columns";

async function getData(){
  try {
    const aralData = await getAllResources()
    return aralData
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}

export default async function Page() {
  const data = await getData()

  return(
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-amber-600 bg-clip-text text-transparent mb-4">
            Aral
          </h1>
          <h2>
            Your Centralized Platform of all things CS and Tech!
          </h2>
        </div>

        {/* Table Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-green-200/50 p-6 mb-8">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
}
