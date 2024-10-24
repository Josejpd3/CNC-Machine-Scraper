'use client';

import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const MachineTypePieChart = ({ machines }) => {
  const machineTypes = machines.reduce((acc, machine) => {
    const type = getMachineType(machine.title, machine.description);
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(machineTypes),
    datasets: [
      {
        data: Object.values(machineTypes),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        hoverBackgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: true,
        text: 'CNC Machine Types Distribution',
      },
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto" style={{ height: '400px' }}>
      <div style={{ width: '80%', height: '80%', margin: 'auto' }}>
        <Pie data={data} options={options} />
      </div>
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

export default MachineTypePieChart;
