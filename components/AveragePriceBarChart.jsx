'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AveragePriceBarChart = ({ machines }) => {
  const machineTypeData = machines.reduce((acc, machine) => {
    const type = getMachineType(machine.title, machine.description);
    const price = parseFloat(machine.price.replace(/[^0-9.-]+/g,""));
    if (!isNaN(price)) {
      if (!acc[type]) {
        acc[type] = { total: 0, count: 0 };
      }
      acc[type].total += price;
      acc[type].count += 1;
    }
    return acc;
  }, {});

  const averagePrices = Object.entries(machineTypeData).map(([type, data]) => ({
    type,
    averagePrice: data.total / data.count
  }));

  averagePrices.sort((a, b) => b.averagePrice - a.averagePrice);

  const data = {
    labels: averagePrices.map(item => item.type),
    datasets: [
      {
        label: 'Average Price',
        data: averagePrices.map(item => item.averagePrice),
        backgroundColor: 'rgba(239,68,68,0.9)',
        borderColor: 'rgba(239,68,68,1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Average Price by Machine Type',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average Price ($)',
        },
      },
    },
  };

  return (
    <div className="w-full max-w-4xl mx-auto" style={{ height: '400px' }}>
      <Bar data={data} options={options} />
    </div>
  );
}

const getMachineType = (title, description) => {
    const combinedText = (title + ' ' + description).toLowerCase();
    const typeChecks = [
      { type: 'Mill', keywords: ['mill', 'milling center', 'machining center', 'vertical machining center', 'horizontal machining center'] },
      { type: 'Lathe', keywords: ['lathe', 'turning center'] },
      { type: 'Router', keywords: ['router'] },
      { type: 'Drill', keywords: ['drill', 'drilling'] },
      { type: 'Grinder', keywords: ['grinder', 'grinding'] },
      { type: 'EDM', keywords: ['edm', 'electrical discharge'] },
      { type: 'Saw', keywords: ['saw', 'cutting'] },
      { type: '3D Printer', keywords: ['3d print', 'additive manufacturing'] },
      { type: 'Plasma Cutter', keywords: ['plasma'] },
      { type: 'Laser Cutter', keywords: ['laser'] },
    ];
  
    for (const check of typeChecks) {
      if (check.keywords.some(keyword => combinedText.includes(keyword))) {
        return check.type;
      }
    }
  
    return 'Other';
  }
  
export default AveragePriceBarChart;