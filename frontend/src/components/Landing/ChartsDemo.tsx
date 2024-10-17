import * as React from 'react'
import {
  Label,
  Pie,
  PieChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

const pieChartData = [
  { category: 'Food', amount: 275, fill: 'var(--color-food)' },
  { category: 'Rent', amount: 200, fill: 'var(--color-rent)' },
  { category: 'Utilities', amount: 287, fill: 'var(--color-utilities)' },
  {
    category: 'Entertainment',
    amount: 173,
    fill: 'var(--color-entertainment)',
  },
  { category: 'Other', amount: 190, fill: 'var(--color-other)' },
]

const pieChartConfig = {
  food: {
    label: 'Food',
    color: 'hsl(var(--chart-1))',
  },
  rent: {
    label: 'Rent',
    color: 'hsl(var(--chart-2))',
  },
  utilities: {
    label: 'Utilities',
    color: 'hsl(var(--chart-3))',
  },
  entertainment: {
    label: 'Entertainment',
    color: 'hsl(var(--chart-4))',
  },
  other: {
    label: 'Other',
    color: 'hsl(var(--chart-5))',
  },
}

const barChartData = [
  { month: 'January', income: 2500, expenses: 1500 },
  { month: 'February', income: 3000, expenses: 1800 },
  { month: 'March', income: 2800, expenses: 1600 },
  { month: 'April', income: 3200, expenses: 2000 },
  { month: 'May', income: 3500, expenses: 2200 },
  { month: 'June', income: 4000, expenses: 2500 },
]

const barChartConfig = {
  income: {
    label: 'Income',
    color: 'hsl(var(--chart-1))',
  },
  expenses: {
    label: 'Expenses',
    color: 'hsl(var(--chart-2))',
  },
}

export function ChartsDemo() {
  const totalExpenses = React.useMemo(() => {
    return pieChartData.reduce((acc, curr) => acc + curr.amount, 0)
  }, [])

  return (
    <>
      <div className="mb-6 px-16 mx-auto text-center">
        <h1 className="text-3xl font-semibold mb-2">Financial Overview</h1>
        <p className="text-gray-600">
          This section provides insights into your financial status through
          visual representations. The charts below illustrate your expense
          distribution and compare your income with expenses over the past few
          months.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 mx-auto px-10">
        {/* Pie Chart Section */}
        <Card className="flex flex-col flex-1 bg-transparent border-none shadow-none">
          <CardHeader className="items-center pb-0">
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer
              className="mx-auto aspect-square max-h-[250px]"
              config={pieChartConfig}
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={pieChartData}
                  dataKey="amount"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {totalExpenses.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total Expenses
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Bar Chart Section */}
        <Card className="flex flex-col flex-1 bg-transparent border-none shadow-none">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={barChartConfig}>
              <BarChart data={barChartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dashed" />}
                />
                <Bar dataKey="income" fill="var(--color-income)" radius={4} />
                <Bar
                  dataKey="expenses"
                  fill="var(--color-expenses)"
                  radius={4}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
