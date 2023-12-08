import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Chart, BarController, BarElement, LinearScale, CategoryScale } from 'chart.js/auto';

type ItemType = {
  id: number;
  amount: string;
  description: string;
  section: string;
  date: string;
  user: number;
};

type CategoryResult = {
  [key: string]: number;
};

const StatisticsPage: React.FC<{ period: string }> = ({ period }) => {
  const { authTokens } = useContext(AuthContext);
  const [statisticsData, setStatisticsData] = useState<any>({ incomes: [], expenses: [] });

  const incomeSections = ['Salary', 'Freelance'];
  const expenseSections = ['Food', 'Eating out', 'Home', 'Bad habits', 'Car', 'Transport', 'Health', 'Clothes', 'Gifts'];

  const chartRef1 = useRef<HTMLCanvasElement | null>(null);
  const chartRef2 = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/user-data/${period}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authTokens.access}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();
        setStatisticsData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [period]);

  useEffect(() => {
    Chart.register(BarController, BarElement, LinearScale, CategoryScale);

    const incomeByCategory = groupByCategory(statisticsData.incomes);
    const expenseByCategory = groupByCategory(statisticsData.expenses);

    const maxIncome = Math.max(...Object.values(incomeByCategory));
    const maxExpense = Math.max(...Object.values(expenseByCategory));
    const maxY = Math.max(maxIncome, maxExpense);

    const incomeData = {
      labels: incomeSections,
      datasets: [
        {
          label: 'Income',
          backgroundColor: 'rgba(75,192,192,0.2)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(75,192,192,0.4)',
          hoverBorderColor: 'rgba(75,192,192,1)',
          data: incomeSections.map((section) => incomeByCategory[section] || 0),
        },
      ],
    };

    const expenseData = {
      labels: expenseSections,
      datasets: [
        {
          label: 'Expenses',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.4)',
          hoverBorderColor: 'rgba(255,99,132,1)',
          data: expenseSections.map((section) => expenseByCategory[section] || 0),
        },
      ],
    };

    const incomeChart = new Chart(chartRef1.current!.getContext('2d')!, {
      type: 'bar',
      data: incomeData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 30,
              minRotation: 30,
            },
          },
          y: {
            beginAtZero: true,
            max: maxY,
          },
        },
      },
    });

    const expenseChart = new Chart(chartRef2.current!.getContext('2d')!, {
      type: 'bar',
      data: expenseData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            ticks: {
              autoSkip: false,
              maxRotation: 30,
              minRotation: 30,
            },
          },
          y: {
            beginAtZero: true,
            max: maxY,
          },
        },
      },
    });

    return () => {
      incomeChart.destroy();
      expenseChart.destroy();
    };
  }, [statisticsData]);

  const groupByCategory = (items: ItemType[]): CategoryResult => {
  return items.reduce((result: CategoryResult, item: ItemType) => {
    const category = item.section;
    result[category] = (result[category] || 0) + parseFloat(item.amount);
    return result;
  }, {});
};

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '1200px', margin: 'auto' }}>
      <div style={{ flex: '1', marginRight: '10px' }}>
        <canvas ref={chartRef1} style={{ maxWidth: '600px', maxHeight: '500px', width: '100%', height: 'auto' }}></canvas>
      </div>
      <div style={{ flex: '1' }}>
        <canvas ref={chartRef2} style={{ maxWidth: '600px', maxHeight: '500px', width: '100%', height: 'auto' }}></canvas>
      </div>
    </div>
  );
};

export default StatisticsPage;
