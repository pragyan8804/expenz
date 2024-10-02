import React, { useState, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Sidebar } from '@/components/Sidebar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Transaction = {
  id: string;
  amount: number;
  category: string;
  subcategory: string;
  date: string;
  name: string;
  notes: string;
};

// Mock data for demonstration
const mockTransactions: Transaction[] = Array.from({ length: 100 }, (_, index) => ({
  id: `t${index + 1}`,
  amount: Math.round(Math.random() * 1000 * 100) / 100,
  category: ['Expense', 'Income', 'Investment'][Math.floor(Math.random() * 3)],
  subcategory: ['Groceries', 'Salary', 'Stocks', 'Rent', 'Dividends'][Math.floor(Math.random() * 5)],
  date: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
  name: ['Walmart', 'Amazon', 'Paycheck', 'Vanguard', 'Apartment'][Math.floor(Math.random() * 5)],
  notes: ['Monthly transaction', 'Routine purchase', 'Quarterly dividend', 'Unexpected expense', 'Bonus'][Math.floor(Math.random() * 5)],
}));

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

interface Filter {
  search: string;
  type: 'All' | 'Expense' | 'Income' | 'Investment';
  subcategories: Record<string, boolean>;
}

const TransactionPage: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filter, setFilter] = useState<Filter>({ search: '', type: 'All', subcategories: {} });
  const [sortConfig, setSortConfig] = useState({ key: null as keyof Transaction | null, direction: 'none' });

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => 
      (filter.type === 'All' || t.category === filter.type) &&
      (filter.search === '' || 
        t.name.toLowerCase().includes(filter.search.toLowerCase()) ||
        t.notes.toLowerCase().includes(filter.search.toLowerCase())) &&
      (Object.keys(filter.subcategories).length === 0 || 
        (t.subcategory && filter.subcategories[t.subcategory]))
    );
  }, [transactions, filter]);

  const sortedTransactions = useMemo(() => {
    if (sortConfig.key === null || sortConfig.direction === 'none') return filteredTransactions;
    return [...filteredTransactions].sort((a, b) => {
      if (a[sortConfig.key!] < b[sortConfig.key!]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key!] > b[sortConfig.key!]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredTransactions, sortConfig]);

  const handleSort = (key: keyof Transaction, direction: 'asc' | 'desc' | 'none') => {
    setSortConfig({ key, direction });
  };

  const handleSubcategoryFilter = (subcategory: string) => {
    setFilter(prev => ({
      ...prev,
      subcategories: {
        ...prev.subcategories,
        [subcategory]: !prev.subcategories[subcategory]
      }
    }));
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-grow container mx-auto p-4 dark:bg-black dark:text-white h-screen overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Transactions</h1>
        
        <Tabs defaultValue="All" onValueChange={(value) => setFilter(prev => ({ ...prev, type: value as Filter['type'] }))}>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Expense">Expense</TabsTrigger>
            <TabsTrigger value="Income">Income</TabsTrigger>
            <TabsTrigger value="Investment">Investment</TabsTrigger>
          </TabsList>
          
          {['All', 'Expense', 'Income', 'Investment'].map(type => (
            <TabsContent key={type} value={type}>
              <TransactionTable 
                transactions={type === 'All' ? sortedTransactions : sortedTransactions.filter(t => t.category === type)}
                handleSort={handleSort} 
                handleSubcategoryFilter={handleSubcategoryFilter}
                filter={filter}
                setFilter={setFilter}
                categories={categories}
                sortConfig={{
                  ...sortConfig,
                  direction: sortConfig.direction as "none" | "desc" | "asc"
                }}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

const TransactionTable: React.FC<{
  transactions: Transaction[], 
  handleSort: (key: keyof Transaction, direction: 'asc' | 'desc' | 'none') => void,
  handleSubcategoryFilter: (subcategory: string) => void,
  filter: any,
  setFilter: React.Dispatch<React.SetStateAction<any>>,
  categories: typeof categories,
  sortConfig: { key: keyof Transaction | null, direction: 'asc' | 'desc' | 'none' },
}> = ({ transactions, handleSort, handleSubcategoryFilter, filter, setFilter, categories, sortConfig }) => {
  const subcategories = useMemo(() => {
    if (filter.type === 'All') {
      return [...new Set(transactions.map(t => t.subcategory))];
    }
    return Object.values(categories[filter.type as keyof typeof categories]).flat();
  }, [transactions, filter.type, categories]);

  const renderSortSelect = (key: keyof Transaction) => {
    if (key === 'notes' || key === 'name') {
      return <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>;
    }
    return (
      <Select
        value={sortConfig.key === key ? sortConfig.direction : 'none'}
        onValueChange={(value) => handleSort(key, value as 'asc' | 'desc' | 'none')}
      >
        <SelectTrigger className="w-[130px]">
          <SelectValue placeholder={key.charAt(0).toUpperCase() + key.slice(1)} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">{key.charAt(0).toUpperCase() + key.slice(1)}</SelectItem>
          <SelectItem value="asc">↑ {key.charAt(0).toUpperCase() + key.slice(1)}</SelectItem>
          <SelectItem value="desc">↓ {key.charAt(0).toUpperCase() + key.slice(1)}</SelectItem>
        </SelectContent>
      </Select>
    );
  };

  return (
    <>
      <div className="mb-4">
        <Input 
          placeholder="Search transactions..." 
          value={filter.search}
          onChange={(e) => setFilter((prev: typeof filter) => ({ ...prev, search: e.target.value }))}
        />
      </div>
      
      <div className="overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg">
        <Table className="w-full">
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-950">
              <TableHead>{renderSortSelect('amount')}</TableHead>
              <TableHead>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost">Category (Subcategory)</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    {subcategories.map(subcat => (
                      <div key={subcat}>
                        <Checkbox 
                          id={subcat} 
                          checked={filter.subcategories[subcat]} 
                          onCheckedChange={() => handleSubcategoryFilter(subcat)}
                        />
                        <label htmlFor={subcat}>{subcat}</label>
                      </div>
                    ))}
                  </PopoverContent>
                </Popover>
              </TableHead>
              <TableHead>{renderSortSelect('date')}</TableHead>
              <TableHead>{renderSortSelect('name')}</TableHead>
              <TableHead>{renderSortSelect('notes')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map(transaction => (
              <TableRow key={transaction.id} className="border-t border-gray-200 dark:border-gray-700">
                <TableCell>{transaction.amount}</TableCell>
                <TableCell>{`${transaction.category} (${transaction.subcategory})`}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.name}</TableCell>
                <TableCell>{transaction.notes}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default TransactionPage;