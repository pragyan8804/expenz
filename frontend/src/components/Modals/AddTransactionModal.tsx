import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useState } from 'react'
import { SelectGroup, SelectLabel } from '@radix-ui/react-select'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import axios from 'axios'
import { useToast } from '@/hooks/use-toast'

export function AddTransactionModal() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [notes, setNotes] = useState('')
  const [amount, setAmount] = useState('')
  const [_subCategories, setSubCategories] = useState<string[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { toast } = useToast()

  const resetForm = () => {
    setName('')
    setCategory('')
    setSubCategory('')
    setDate(new Date())
    setNotes('')
    setAmount('')
    setSubCategories([])
  }

  const handleOpenChange = (open: boolean) => {
    setIsModalOpen(open)
    if (open) {
      resetForm()
    }
  }

  const showToast = (
    title: string,
    description: string,
    variant: 'default' | 'destructive'
  ) => {
    const { dismiss } = toast({
      title,
      description,
      variant,
    })

    setTimeout(() => {
      dismiss()
    }, 2000)
  }

  // Categories with subcategories and group labels
  const categories = {
    Expense: {
      Essentials: [
        'Food & Dining',
        'Groceries',
        'Healthcare',
        'Education',
        'Taxes',
        'Bills & Fees',
        'Housing',
        'Utilities',
        'Insurance',
        'Debt Payments',
      ],
      Lifestyle: [
        'Transportation',
        'Entertainment',
        'Shopping',
        'Personal Care',
        'Travel',
        'Gifts & Donations',
        'Subscriptions',
      ],
      Miscellaneous: ['Miscellaneous'],
    },
    Income: {
      'Primary Income': ['Salary', 'Business', 'Freelance'],
      'Passive Income': [
        'Investments',
        'Rental Income',
        'Dividends',
        'Interest',
        'Royalties',
      ],
      'Other Income': [
        'Gifts Received',
        'Tax Refunds',
        'Government Benefits',
        'Side Hustle',
        'Commissions',
        'Bonuses',
      ],
    },
    Investment: {
      'Traditional Investments': [
        'Stocks',
        'Bonds',
        'Mutual Funds',
        'ETFs',
        'Real Estate',
      ],
      'Alternative Investments': [
        'Cryptocurrency',
        'Commodities',
        'P2P Lending',
        'Startups',
        'Art & Collectibles',
      ],
      'Retirement & Savings': [
        'Retirement Accounts',
        'Savings Accounts',
        'Certificates of Deposit',
      ],
      'Advanced Instruments': ['Forex', 'Options'],
    },
  }

  // Update subcategories when category changes
  const handleCategoryChange = (value: keyof typeof categories) => {
    setCategory(value)
    setSubCategories(Object.values(categories[value]).flat() || [])
    setSubCategory('')
  }

  const handleAddTransaction = async () => {
    // Get userId from localStorage
    const userId = localStorage.getItem('userId')
    if (!userId) {
      console.error('No userId found')
      showToast(
        'Error',
        'User ID not found. Please log in again.',
        'destructive'
      )
      return
    }

    // Prepare the transaction data
    const transactionData = {
      userId,
      name,
      category,
      subCategory,
      date,
      notes,
      amount,
    }

    try {
      // Send transaction to backend
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/transactions/add`,
        transactionData
      )

      console.log('Transaction added successfully:', response.data)

      // Show success toast
      showToast('Success', 'Transaction added successfully', 'default')

      // Close modal on success
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error adding transaction:', error)

      // Show error toast
      showToast(
        'Error',
        'Failed to add transaction. Please try again.',
        'destructive'
      )
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={() => handleOpenChange(true)}>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent className="bg-white text-black dark:bg-black dark:text-white">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Enter the details of your new transaction below.
          </DialogDescription>
        </DialogHeader>

        {/* Transaction Form */}
        <div className="space-y-4">
          {/* Transaction Name */}
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Transaction Name"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category Dropdown */}
            <div>
              <Label htmlFor="category">Category</Label>
              <Select onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Expense">Expense</SelectItem>
                  <SelectItem value="Income">Income</SelectItem>
                  <SelectItem value="Investment">Investment</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory Dropdown */}
            <div>
              <Label htmlFor="subCategory">Subcategory</Label>
              <Select
                onValueChange={(value) => setSubCategory(value)}
                disabled={!category}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(
                    categories[category as keyof typeof categories] || {}
                  ).map(([groupLabel, subCats]) => (
                    <SelectGroup key={groupLabel}>
                      <SelectLabel className="px-2 pt-3 pb-1 text-xs font-semibold uppercase text-gray-400">
                        {groupLabel}
                      </SelectLabel>
                      {subCats.map((subCat) => (
                        <SelectItem key={subCat} value={subCat}>
                          {subCat}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Amount Input */}
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                min={0}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
              />
            </div>

            {/* Date Input using Calendar */}
            <div>
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !date && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Notes Input */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-4">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleAddTransaction}>Add Transaction</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
