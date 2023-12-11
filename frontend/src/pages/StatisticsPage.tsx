import React, { useContext, useEffect, useRef, useState } from 'react';
import AuthContext from '../context/AuthContext';
import { Chart, DoughnutController } from 'chart.js/auto';
import Button from '@mui/material/Button';

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
    Chart.register(DoughnutController);

    const incomeByCategory = groupByCategory(statisticsData.incomes);
    const expenseByCategory = groupByCategory(statisticsData.expenses);

    const uniqueColors = generateUniqueColors(incomeSections.length + expenseSections.length);

    const incomeData = {
      labels: incomeSections,
      datasets: [
        {
          data: incomeSections.map((section) => incomeByCategory[section] || 0),
          backgroundColor: uniqueColors.slice(0, incomeSections.length),
          borderColor: uniqueColors.slice(0, incomeSections.length),
          borderWidth: 1,
        },
      ],
    };

    const expenseData = {
      labels: expenseSections,
      datasets: [
        {
          data: expenseSections.map((section) => expenseByCategory[section] || 0),
          backgroundColor: uniqueColors.slice(incomeSections.length),
          borderColor: uniqueColors.slice(incomeSections.length),
          borderWidth: 1,
        },
      ],
    };

    const incomeChart = new Chart(chartRef1.current!.getContext('2d')!, {
      type: 'doughnut',
      data: incomeData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    const expenseChart = new Chart(chartRef2.current!.getContext('2d')!, {
      type: 'doughnut',
      data: expenseData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
      },
    });

    return () => {
      incomeChart.destroy();
      expenseChart.destroy();
    };
  }, [statisticsData]);

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
  }, [period, authTokens.access]);

  const groupByCategory = (items: ItemType[]): CategoryResult => {
    return items.reduce((result: CategoryResult, item: ItemType) => {
      const category = item.section;
      result[category] = (result[category] || 0) + parseFloat(item.amount);
      return result;
    }, {});
  };

  const generateUniqueColors = (count: number): string[] => {
    const colors: string[] = [];

    for (let i = 0; i < count; i++) {
      const color = getRandomColor();
      if (!colors.includes(color)) {
        colors.push(color);
      } else {
        i--;
      }
    }

    return colors;
  };

  const getRandomColor = (): string => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleDownloadCSV = () => {
    const incomeCsv = generateCsvContent(statisticsData.incomes, 'Income');
    const expenseCsv = generateCsvContent(statisticsData.expenses, 'Expense');

    const csvContent = `${incomeCsv}\n${expenseCsv}`;
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = `${period}_data.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const generateCsvContent = (data: ItemType[], type: string): string => {
    const rows = data.map((item: ItemType, index: number) => {
      const values = Object.values(item).map((value) => `"${value}"`);
      return `${index + 1},${values.join(',')}`;
    });

    const totalRow = `${type}Total,${statisticsData[`${type.toLowerCase()}Total`] || 0}`;

    return [`ID,Amount,Description,Date,Section`, ...rows, totalRow].join('\n');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-around', maxWidth: '1200px', margin: 'auto' }}>
        <div style={{ flex: '1', marginRight: '10px' }}>
          <canvas ref={chartRef1} style={{ maxWidth: '600px', maxHeight: '500px', width: '100%', height: 'auto' }}></canvas>
        </div>
        <div style={{ flex: '1' }}>
          <canvas ref={chartRef2} style={{ maxWidth: '600px', maxHeight: '500px', width: '100%', height: 'auto' }}></canvas>
        </div>
      </div>
      <Button variant="contained" color="primary" onClick={handleDownloadCSV} style={{ marginLeft: '20px' }}>
        Download CSV
      </Button>
    </div>
  );
};

export default StatisticsPage;
