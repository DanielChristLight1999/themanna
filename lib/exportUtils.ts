import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import Papa from "papaparse"
export function exportToCSV<T>(data: T[], fileName: string = "table.csv") {
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  link.href = URL.createObjectURL(blob)
  link.setAttribute("download", fileName)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function exportToPDF<T>(columns: string[], data: T[], fileName: string = "table.pdf") {
  const doc = new jsPDF()
  autoTable(doc, {
    head: [columns],
    body: data.map((row: any) => columns.map((col) => row[col])),
  })
  doc.save(fileName)
}
