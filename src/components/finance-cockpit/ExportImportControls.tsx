import { useRef } from 'react'
import { Download, Upload, FileSpreadsheet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import type { FinanceTransaction } from '@/types/finance-cockpit'

export interface ExportImportControlsProps {
  transactions: FinanceTransaction[]
  isLoading?: boolean
  onImport?: (rows: Omit<FinanceTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>[]) => void
}

const CSV_HEADERS = 'date,description,amount,type,category,project_client'

function transactionToRow(t: FinanceTransaction): string {
  const amount = Math.abs(t.amount_cents) / 100
  const type = t.amount_cents >= 0 ? 'income' : 'expense'
  return [t.date, `"${(t.description ?? '').replace(/"/g, '""')}"`, amount, type, t.category ?? '', t.project_client ?? ''].join(',')
}

export function ExportImportControls({
  transactions,
  isLoading = false,
  onImport,
}: ExportImportControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const rows = [CSV_HEADERS, ...transactions.map(transactionToRow)]
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `finance-transactions-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    toast.success('CSV exported')
  }

  const handleDownloadTemplate = () => {
    const example = [
      CSV_HEADERS,
      '2025-02-01,"Consulting fee",1500.00,income,Software,Acme Corp',
      '2025-02-05,"Software subscription",-99.00,expense,Software,',
    ].join('\n')
    const blob = new Blob([example], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'finance-import-template.csv'
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Template downloaded')
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const text = String(reader.result)
      const lines = text.split(/\r?\n/).filter(Boolean)
      if (lines.length < 2) {
        toast.error('CSV must have a header and at least one row')
        e.target.value = ''
        return
      }
      const header = lines[0].toLowerCase()
      const cols = header.split(',')
      const dateIdx = cols.findIndex((c) => c.includes('date')) ?? 0
      const descIdx = cols.findIndex((c) => c.includes('description')) ?? 1
      const amountIdx = cols.findIndex((c) => c.includes('amount')) ?? 2
      const typeIdx = cols.findIndex((c) => c === 'type') ?? 3
      const categoryIdx = cols.findIndex((c) => c.includes('category')) ?? 4
      const projectIdx = cols.findIndex((c) => c.includes('project') || c.includes('client')) ?? 5
      const rows: Omit<FinanceTransaction, 'id' | 'user_id' | 'created_at' | 'updated_at'>[] = []
      for (let i = 1; i < lines.length; i++) {
        const cells = lines[i].split(',').map((c) => c.trim().replace(/^"|"$/g, ''))
        const date = cells[dateIdx] || new Date().toISOString().slice(0, 10)
        const desc = cells[descIdx] ?? 'Imported'
        const rawAmount = cells[amountIdx] ?? '0'
        const amount = Math.round(parseFloat(String(rawAmount).replace(/[^0-9.-]/g, '')) * 100)
        const typeVal = (cells[typeIdx] ?? 'expense').toLowerCase()
        const type = typeVal === 'income' ? 'income' : 'expense'
        rows.push({
          date,
          description: desc,
          amount_cents: type === 'income' ? amount : -Math.abs(amount),
          type,
          category: categoryIdx >= 0 && cells[categoryIdx] ? cells[categoryIdx] : undefined,
          project_client: projectIdx >= 0 && cells[projectIdx] ? cells[projectIdx] : undefined,
        })
      }
      onImport?.(rows)
      toast.success(`${rows.length} row(s) imported`)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  if (isLoading) {
    return (
      <Card className="transition-all duration-300 hover:shadow-card-hover">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            Export / Import
          </CardTitle>
          <CardDescription>CSV export and import with template.</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-10 w-full rounded-lg" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-card-hover">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileSpreadsheet className="h-5 w-5 text-primary" />
          Export / Import
        </CardTitle>
        <CardDescription>CSV export and import with template.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={transactions.length === 0}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadTemplate}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Download template
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileChange}
            aria-label="Import CSV"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="transition-transform duration-200 hover:scale-[1.02]"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Template columns: date, description, amount, type (income|expense), category, project_client.
          Export includes all current transactions.
        </p>
      </CardContent>
    </Card>
  )
}
