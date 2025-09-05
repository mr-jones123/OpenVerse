import { DataTable } from "@/components/aral-table/data-table";
import { getAllResources } from "@/lib/db/queries";
import { columns } from "@/components/aral-table/columns";

async function getData(){
  try {
    const aralData = await getAllResources()
    console.log(aralData)
    return aralData
  } catch (error) {
    console.error('Error fetching data:', error)
    return []
  }
}
export default async function Page() {
  const data = await getData()
  return(
    <DataTable columns = {columns} data={data}  />
  )
}
