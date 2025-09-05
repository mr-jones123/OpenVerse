"use client"
import { Aral } from "@/lib/types"
import { ColumnDef } from "@tanstack/react-table"

export const columns: ColumnDef<Aral>[] = [
  {
    accessorKey: "source_name",
    header: "Source Name"
  },
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "field",
    header: "Field"
  },
  {
    accessorKey: "link",
    header: "Link",
    cell: ({ row }) => {
      const link = row.getValue("link") as string
      return (
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-green-600 hover:text-green-800 underline hover:no-underline transition-colors duration-200"
        >
          Visit Link
        </a>
      )
    }
  }
]
