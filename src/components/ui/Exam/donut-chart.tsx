"use client"

import { Pie, PieChart, Cell } from "recharts"
import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

export default function DonutChart({
  correct,
  total,
}: {
  correct: number;
  total: number;
}) {
  const incorrect = total - correct;

  const chartData = [
    { status: "correct", value: correct },
    { status: "incorrect", value: incorrect },
  ]

  const chartConfig = {
    correct: {
      label: "Correct",
      color: "#22c55e", 
    },
    incorrect: {
      label: "Incorrect",
      color: "#ef4444",
    },
  } satisfies ChartConfig

  return (
    <div className="flex flex-col items-center gap-6">
   
      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square w-full min-w-51 " 
      >
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="status"
            innerRadius={60}
            outerRadius={90}
            strokeWidth={10}
          >
           
            <Cell fill={chartConfig.correct.color} />
            <Cell fill={chartConfig.incorrect.color} />
          </Pie>
        </PieChart>
      </ChartContainer>

      {/* Legend */}
      <div className="flex flex-col gap-3 ml-19 font-mono text-sm w-full">
        <div className="flex items-center gap-3">
          <div className="h-4 w-4 bg-emerald-500" />
          <span className="text-gray-700">
            Correct: <span className="font-bold">{correct}</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-4 w-4  bg-red-500" />
          <span className="text-gray-700">
            Incorrect: <span className="font-bold">{incorrect}</span>
          </span>
        </div>
      </div>
    </div>
  )
}