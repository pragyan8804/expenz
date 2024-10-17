//https://ui.shadcn.com/docs/components/data-table

import React, { useState, useMemo, useEffect } from 'react'
import axios from 'axios'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown, ArrowUpDown } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import DeleteTransaction from '@/components/Dialogs/DeleteTransaction'
import useFormatDate from '@/hooks/useFormatDate'
import { Sidebar } from '@/components/Sidebar'

type Transaction = {
  _id: string
  amount: number
  category: string
  subCategory: string
  date: string
  name: string
  notes: string
}

interface TransactionTableProps {
  categories: Record<string, Record<string, string[]>>
}

const TransactionTable: React.FC<TransactionTableProps> = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [visibleColumns, setVisibleColumns] = useState({
    amount: true,
    category: true,
    date: true,
    name: true,
    notes: true,
  })

  const [filter, setFilter] = useState({
    search: '',
  })

  const [sortConfig, setSortConfig] = useState({
    key: 'date' as keyof Transaction,
    direction: 'desc' as 'asc' | 'desc',
  })

  const { formatDate } = useFormatDate()

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true)
      try {
        const userId = localStorage.getItem('userId')
        if (!userId) {
          console.error('No userId found')
          return
        }
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/transactions/${userId}`
        )

        setTransactions(response.data)
        setError(null)
      } catch (err) {
        setError('Error fetching transactions. Please try again later.')
        console.error('Error fetching transactions:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  const toggleColumn = (column: keyof typeof visibleColumns) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }))
  }

  const handleDeleteSuccess = (transactionId: string) => {
    setTransactions((prevTransactions) =>
      prevTransactions.filter((t) => t._id !== transactionId)
    )
  }

  const handleSort = (key: keyof Transaction) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }))
  }

  const filteredAndSortedTransactions = useMemo(() => {
    return transactions
      .filter(
        (t) =>
          filter.search === '' ||
          t.name.toLowerCase().includes(filter.search.toLowerCase()) ||
          t.notes.toLowerCase().includes(filter.search.toLowerCase())
      )
      .sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === 'asc' ? -1 : 1
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
  }, [transactions, filter, sortConfig])

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 dark:bg-black dark:text-gray-100">
        <h1 className="text-3xl font-bold mb-4">Transactions</h1>
        {loading ? (
          <div>Loading transactions...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : (
          <div>
            <div className="flex items-center py-4 justify-between">
              <Input
                placeholder="Filter transactions..."
                value={filter.search}
                onChange={(e) =>
                  setFilter((prev) => ({ ...prev, search: e.target.value }))
                }
                className="max-w-sm"
              />
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                      Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {Object.entries(visibleColumns).map(([key, value]) => (
                      <DropdownMenuCheckboxItem
                        key={key}
                        className="capitalize"
                        checked={value}
                        onCheckedChange={() =>
                          toggleColumn(key as keyof typeof visibleColumns)
                        }
                      >
                        {key}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="rounded-md border dark:border-zinc-800">
              <Table>
                <TableHeader>
                  <TableRow className="dark:border-zinc-700">
                    {visibleColumns.amount && (
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('amount')}
                        >
                          Amount
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                    )}
                    {visibleColumns.category && <TableHead>Category</TableHead>}
                    {visibleColumns.date && (
                      <TableHead>
                        <Button
                          variant="ghost"
                          onClick={() => handleSort('date')}
                        >
                          Date
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </Button>
                      </TableHead>
                    )}
                    {visibleColumns.name && <TableHead>Name</TableHead>}
                    {visibleColumns.notes && <TableHead>Notes</TableHead>}
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAndSortedTransactions.map((transaction) => (
                    <TableRow
                      key={transaction._id}
                      className="dark:border-zinc-800"
                    >
                      {visibleColumns.amount && (
                        <TableCell>{transaction.amount}</TableCell>
                      )}
                      {visibleColumns.category && (
                        <TableCell>
                          <Badge variant="outline">
                            {transaction.subCategory}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.date && (
                        <TableCell>{formatDate(transaction.date)}</TableCell>
                      )}
                      {visibleColumns.name && (
                        <TableCell>{transaction.name}</TableCell>
                      )}
                      {visibleColumns.notes && (
                        <TableCell>{transaction.notes}</TableCell>
                      )}
                      <TableCell className="text-right">
                        <DeleteTransaction
                          transactionId={transaction._id}
                          onDeleteSuccess={() =>
                            handleDeleteSuccess(transaction._id)
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionTable
