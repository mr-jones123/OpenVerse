import { prisma } from "@/lib/prisma"
import { Aral } from "../types"

export async function getAllResources(): Promise<Aral[]>{
  try {
    const resources = await prisma.resource.findMany({
      orderBy: [
        {category: 'asc'},
        {source_name: 'asc'}
      ]
    })
    console.log(resources)
    return resources
  } catch (error) {
    console.log("Retrieved Resources: Failed")
    throw new Error('Failed to fetch sources')
  }
}


