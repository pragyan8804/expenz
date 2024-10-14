import { Label, Pie, PieChart, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import axios from 'axios';
import { useEffect, useState } from "react";

const fetchExpenseDistribution = async (userId: string) => {
  const response = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/transactions/expenses/distribution/${userId}`
  );
  return response.data;
};

interface ChartDataEntry {
    fill: string;
}

export function ExpenseChart() {
  const [chartData, setChartData] = useState<ChartDataEntry[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    async function getExpenseDistribution() {
      if (!userId) return;
      try {
        const expenseData = await fetchExpenseDistribution(userId);

        // Map the expense data into the format needed for the chart
        const mappedData = expenseData.map((item: { _id: any; totalAmount: any; }, index: number) => ({
          category: item._id,
          amount: item.totalAmount,
          fill: `hsl(var(--chart-${index + 1}))`, // Dynamically assign colors
        }));

        // Set the chart data and calculate total expenses
        setChartData(mappedData);
        const total = mappedData.reduce((acc: any, curr: { amount: any; }) => acc + curr.amount, 0);
        setTotalExpenses(total);
      } catch (error) {
        console.error("Error fetching expense distribution:", error);
      }
    }

    getExpenseDistribution();
  }, [userId]);

  return (
    <Card className="flex flex-col dark:text-white">
      <CardHeader className="items-center pb-0">
        <CardTitle>Expense Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          className="mx-auto aspect-square max-h-[40vh]"
          config={{ }}
        >
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            {chartData.length > 0 ? ( // Check if there is data
              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                innerRadius={70}
                strokeWidth={5}
                fill="#8884d8"
              >
                {chartData.map((entry: ChartDataEntry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="dark:text-white"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold dark:text-white"
                          >
                            ${totalExpenses.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground dark:text-white"
                          >
                            Total Expenses
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            ) : (
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-gray-500 dark:text-gray-400"
              >
                No Data
              </text>
            )}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
