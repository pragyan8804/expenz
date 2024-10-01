import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectGroup, SelectLabel } from "@radix-ui/react-select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function AddTransactionModal() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [notes, setNotes] = useState("");
  const [amount, setAmount] = useState("");
  const [subCategories, setSubCategories] = useState<string[]>([]);
  const navigate = useNavigate();

  // Categories with subcategories and group labels
  const categories = {
    Expense: {
      "Essentials": [
        "Food & Dining",
        "Groceries",
        "Healthcare",
        "Education",
        "Taxes",
        "Bills & Fees",
        "Housing",
        "Utilities",
        "Insurance",
        "Debt Payments",
      ],
      "Lifestyle": [
        "Transportation",
        "Entertainment",
        "Shopping",
        "Personal Care",
        "Travel",
        "Gifts & Donations",
        "Subscriptions",
      ],
      "Miscellaneous": ["Miscellaneous"],
    },
    Income: {
      "Primary Income": ["Salary", "Business", "Freelance"],
      "Passive Income": [
        "Investments",
        "Rental Income",
        "Dividends",
        "Interest",
        "Royalties",
      ],
      "Other Income": [
        "Gifts Received",
        "Tax Refunds",
        "Government Benefits",
        "Side Hustle",
        "Commissions",
        "Bonuses",
      ],
    },
    Investment: {
      "Traditional Investments": [
        "Stocks",
        "Bonds",
        "Mutual Funds",
        "ETFs",
        "Real Estate",
      ],
      "Alternative Investments": [
        "Cryptocurrency",
        "Commodities",
        "P2P Lending",
        "Startups",
        "Art & Collectibles",
      ],
      "Retirement & Savings": [
        "Retirement Accounts",
        "Savings Accounts",
        "Certificates of Deposit",
      ],
      "Advanced Instruments": ["Forex", "Options"],
    },
  };

  // Handle category selection
  const handleCategoryChange = (value: keyof typeof categories) => {
    setCategory(value);
    setSubCategories(Object.values(categories[value]).flat() || []);
    setSubCategory(""); // Reset subcategory when category changes
  };

  const handleAddTransaction = () => {
    // Logic to add the transaction will go here
    console.log({ name, category, subCategory, date, notes, amount });
  };

  const handleCustomCategory = () => {
    navigate("/custom-category"); // Redirect to the custom category creation page
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent>
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
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Transaction Name" />
          </div>

          {/* Category and Subcategory in the same row */}
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
                  <SelectItem value="custom">Add Custom Category</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory Dropdown */}
            <div>
              <Label htmlFor="subCategory">Subcategory</Label>
              <Select onValueChange={(value) => setSubCategory(value)} disabled={!category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categories[category as keyof typeof categories] || {}).map(([groupLabel, subCats]) => (
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

          {/* Amount and Date in the same row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Amount Input */}
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" />
            </div>

            {/* Date Input using Calendar */}
            <div>
              <Label htmlFor="date">Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
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
            <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes" />
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
  );
}
