"use client";

import { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnDef,
  flexRender,
} from "@tanstack/react-table";

export interface Invoice {
  id: string;
  filename: string;
  supplier: string;
  importer: string;
  status: "approved" | "rejected" | "warning";
  errors: number;
  warnings: number;
  amount: string;
  currency: string;
  items: number;
  date: string;
}

interface IInvoicesTable {
  data: Invoice[];
  onRowClick?: (invoice: Invoice) => void;
}

export default function InvoicesTable({ data, onRowClick }: IInvoicesTable) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        id: "status",
        accessorKey: "status",
        header: "",
        cell: ({ row }) => {
          const status = row.original.status;
          const icon = status === "approved" ? "✓" : status === "rejected" ? "✕" : "⚠";
          const type = status === "approved" ? "success" : status === "rejected" ? "error" : "warning";
          return <div className={`status-icon ${type}`}>{icon}</div>;
        },
        size: 50,
      },
      {
        id: "invoice",
        header: "Factura",
        accessorKey: "filename",
        cell: ({ row }) => (
          <div className="flex-1">
            <div className="font-semibold text-white">{row.original.filename}</div>
            <div className="text-secondary-400 text-sm">
              {row.original.supplier} → {row.original.importer}
            </div>
          </div>
        ),
      },
      {
        id: "validation",
        header: "Validación",
        cell: ({ row }) => {
          const { status, errors, warnings } = row.original;
          const badgeClass =
            status === "approved"
              ? "badge-success"
              : status === "rejected"
              ? "badge-error"
              : "badge-warning";
          const badgeText =
            status === "approved"
              ? "Aprobada"
              : status === "rejected"
              ? `${errors} Errores`
              : `${warnings} Advertencias`;

          return (
            <div className="text-right min-w-[150px]">
              <div className={`badge ${badgeClass}`}>{badgeText}</div>
              <div className="text-secondary-400 text-xs mt-1">{row.original.date}</div>
            </div>
          );
        },
      },
      {
        id: "amount",
        header: "Monto",
        cell: ({ row }) => (
          <div className="min-w-[120px] text-right">
            <div className="font-bold text-white">
              {row.original.amount} {row.original.currency}
            </div>
            <div className="text-secondary-400 text-xs">{row.original.items} items</div>
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <button
            className="btn btn-ghost"
            onClick={(e) => {
              e.stopPropagation();
              onRowClick?.(row.original);
            }}
          >
            Ver →
          </button>
        ),
        size: 100,
      },
    ],
    [onRowClick]
  );

  const filteredData = useMemo(() => {
    if (statusFilter === "all") return data;
    return data.filter((invoice) => invoice.status === statusFilter);
  }, [data, statusFilter]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
  });

  return (
    <div>
      {/* Filters */}
      <div className="p-6 border-b border-secondary-700 flex gap-3 flex-wrap">
        <div
          className={`filter-chip ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          Todas
        </div>
        <div
          className={`filter-chip ${statusFilter === "approved" ? "active" : ""}`}
          onClick={() => setStatusFilter("approved")}
        >
          ✓ Aprobadas
        </div>
        <div
          className={`filter-chip ${statusFilter === "rejected" ? "active" : ""}`}
          onClick={() => setStatusFilter("rejected")}
        >
          ✕ Rechazadas
        </div>
        <div
          className={`filter-chip ${statusFilter === "warning" ? "active" : ""}`}
          onClick={() => setStatusFilter("warning")}
        >
          ⚠ Con Advertencias
        </div>
      </div>

      {/* Table */}
      <div className="card-body">
        {table.getRowModel().rows.map((row) => (
          <div
            key={row.id}
            className="invoice-row"
            onClick={() => onRowClick?.(row.original)}
          >
            {row.getVisibleCells().map((cell) => (
              <div key={cell.id} style={{ flex: cell.column.getSize() }}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            ))}
          </div>
        ))}

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <div className="text-secondary-400 text-sm">
            Mostrando {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-
            {Math.min(
              (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
              filteredData.length
            )}{" "}
            de {filteredData.length} validaciones
          </div>
          <div className="flex gap-2">
            <button
              className="btn btn-ghost"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              ← Anterior
            </button>
            {Array.from({ length: table.getPageCount() }, (_, i) => (
              <button
                key={i}
                className={`btn ${table.getState().pagination.pageIndex === i ? "btn-primary" : "btn-ghost"}`}
                onClick={() => table.setPageIndex(i)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="btn btn-ghost"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
