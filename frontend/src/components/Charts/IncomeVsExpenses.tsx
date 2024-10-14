import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import axios from "axios";
import { useEffect, useState } from "react";

export const description = "An income vs expenses bar chart";

const chartConfig = {
  income: {
    label: "Income",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function IncomeVsExpenses() {
  const [chartData, setChartData] = useState([]);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchData = async () => {
       if (!userId) return;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/transactions/totals/monthly/${userId}`
        );
        const data = response.data;

        // Format the data for recharts
        const formattedData = data.map((item: any) => ({
          month: new Date(item.year, item.month - 1).toLocaleString("default", {
            month: "long",
          }),
          income: item.income,
          expenses: item.expenses,
        }));

        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
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
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
