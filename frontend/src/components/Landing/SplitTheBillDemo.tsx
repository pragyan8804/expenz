import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowRight } from 'lucide-react'

interface Member {
  id: number
  name: string
}

interface Transaction {
  id: number
  paidBy: number
  splitBetween: number[]
  amount: number
}

interface Debt {
  from: number
  to: number
  amount: number
}

const initialMembers: Member[] = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Jane' },
  { id: 3, name: 'Bob' },
]

export default function SplitTheBillDemo() {
  const [members, setMembers] = useState<Member[]>(initialMembers)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [newMember, setNewMember] = useState('')
  const [paidBy, setPaidBy] = useState('')
  const [splitBetween, setSplitBetween] = useState<number[]>([])
  const [amount, setAmount] = useState('')

  const addMember = () => {
    if (newMember.trim() !== '') {
      setMembers([...members, { id: Date.now(), name: newMember.trim() }])
      setNewMember('')
    }
  }

  const removeMember = (id: number) => {
    setMembers(members.filter((member) => member.id !== id))
  }

  const addTransaction = () => {
    if (paidBy && splitBetween.length > 0 && amount) {
      setTransactions([
        ...transactions,
        {
          id: Date.now(),
          paidBy: parseInt(paidBy),
          splitBetween: splitBetween,
          amount: parseFloat(amount),
        },
      ])
      setPaidBy('')
      setSplitBetween([])
      setAmount('')
    }
  }

  const calculateNormalDebts = (): Debt[] => {
    const debts: Debt[] = []
    transactions.forEach((t) => {
      const splitAmount = t.amount / t.splitBetween.length
      t.splitBetween.forEach((memberId) => {
        if (memberId !== t.paidBy) {
          debts.push({
            from: memberId,
            to: t.paidBy,
            amount: splitAmount,
          })
        }
      })
    })
    return debts
  }

  const calculateSimplifiedDebts = (): Debt[] => {
    const balances: { [key: number]: number } = {}
    transactions.forEach((t) => {
      const splitAmount = t.amount / t.splitBetween.length
      t.splitBetween.forEach((memberId) => {
        if (memberId !== t.paidBy) {
          balances[t.paidBy] = (balances[t.paidBy] || 0) + splitAmount
          balances[memberId] = (balances[memberId] || 0) - splitAmount
        }
      })
    })

    const debtors = Object.entries(balances)
      .filter(([_, balance]) => balance < 0)
      .sort(([, a], [, b]) => a - b)
    const creditors = Object.entries(balances)
      .filter(([_, balance]) => balance > 0)
      .sort(([, a], [, b]) => b - a)

    const simplifiedDebts: Debt[] = []
    let i = 0,
      j = 0

    while (i < debtors.length && j < creditors.length) {
      const [debtorId, debtorBalance] = debtors[i]
      const [creditorId, creditorBalance] = creditors[j]
      const amount = Math.min(-debtorBalance, creditorBalance)

      simplifiedDebts.push({
        from: parseInt(debtorId),
        to: parseInt(creditorId),
        amount: parseFloat(amount.toFixed(2)),
      })

      debtors[i] = [debtorId, debtorBalance + amount]
      creditors[j] = [creditorId, creditorBalance - amount]

      if (debtors[i][1] === 0) i++
      if (creditors[j][1] === 0) j++
    }

    return simplifiedDebts
  }

  const normalDebts = calculateNormalDebts()
  const simplifiedDebts = calculateSimplifiedDebts()

  return (
    <div className="max-w-4xl mx-auto p-6 py-24">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-semibold mb-6 text-center text-primary"
      >
        Split the Bill - Playground
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-center mb-8 text-muted-foreground text-gray-600"
      >
        Experience the power of our advanced bill-splitting algorithm. Minimize
        transactions and simplify your group expenses effortlessly.
      </motion.p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                <AnimatePresence>
                  {members.map((member) => (
                    <motion.li
                      key={member.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex justify-between items-center"
                    >
                      <span>{member.name}</span>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeMember(member.id)}
                      >
                        Remove
                      </Button>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
              <div className="flex space-x-2 justify-between">
                <Input
                  type="text"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="New member name"
                  className="w-64"
                />
                <Button onClick={addMember} size="sm" variant="default">
                  Add
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-transparent border-none shadow-none">
            <CardHeader>
              <CardTitle>Add Transaction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="paidBy">Paid By</Label>
                <Select value={paidBy} onValueChange={setPaidBy}>
                  <SelectTrigger id="paidBy">
                    <SelectValue placeholder="Select member" />
                  </SelectTrigger>
                  <SelectContent>
                    {members.map((member) => (
                      <SelectItem key={member.id} value={member.id.toString()}>
                        {member.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className=" flex items-center space-x-2">
                <Label>Split Between</Label>
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center space-x-2 grid-cols-3"
                  >
                    <Checkbox
                      id={`split-${member.id}`}
                      checked={splitBetween.includes(member.id)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSplitBetween([...splitBetween, member.id])
                        } else {
                          setSplitBetween(
                            splitBetween.filter((id) => id !== member.id)
                          )
                        }
                      }}
                    />
                    <Label htmlFor={`split-${member.id}`}>{member.name}</Label>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount"
                />
              </div>
              <Button onClick={addTransaction} className="w-full">
                Add Transaction
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="mt-8"
      >
        <Card className="bg-transparent border-none shadow-none text-center">
          <CardHeader className="text-center">
            <CardTitle>Debts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-2">Normal Debts</h3>
                {normalDebts.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No debts. Add a transaction!
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {normalDebts.map((debt, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-2 bg-muted rounded-md flex justify-center"
                      >
                        {members.find((m) => m.id === debt.from)?.name}{' '}
                        <ArrowRight className="text-gray-400" />{' '}
                        {members.find((m) => m.id === debt.to)?.name} $
                        {debt.amount.toFixed(2)}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Simplified Debts</h3>
                {simplifiedDebts.length === 0 ? (
                  <p className="text-center text-gray-500">
                    No debts. Add a transaction!
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {simplifiedDebts.map((debt, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-2 bg-muted rounded-md flex justify-center"
                      >
                        {members.find((m) => m.id === debt.from)?.name}{' '}
                        <ArrowRight className="text-gray-400" />{' '}
                        {members.find((m) => m.id === debt.to)?.name} $
                        {debt.amount.toFixed(2)}
                      </motion.li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
