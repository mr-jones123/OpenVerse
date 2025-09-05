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
  }
]
