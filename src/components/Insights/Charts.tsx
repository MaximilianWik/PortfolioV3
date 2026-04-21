/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
} from 'chart.js';
import { Radar, Bar, Doughnut, Line } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title
);

const sharedOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: '#0D0D12',
      titleFont: { family: 'Cinzel', size: 12 },
      bodyFont: { family: 'JetBrains Mono', size: 10 },
      borderColor: '#B8935A',
      borderWidth: 1,
      displayColors: false,
    }
  }
};

export const SkillRadar: React.FC = () => {
  const data = {
    labels: [
      'AI & Automation', 
      'Python Scripting', 
      'Power BI / DAX', 
      'Full-stack Dev', 
      'Data Modeling', 
      'ERP/CRM', 
      'IAM / Security', 
      'UX Sensibility'
    ],
    datasets: [{
      label: 'Proficiency',
      data: [95, 88, 92, 75, 85, 80, 85, 82],
      fill: true,
      backgroundColor: 'rgba(139, 26, 26, 0.12)',
      borderColor: '#B8935A',
      pointBackgroundColor: '#E8E4D8',
      pointBorderColor: '#07070A',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#B8935A'
    }]
  };

  const options = {
    ...sharedOptions,
    scales: {
      r: {
        angleLines: { color: 'rgba(92, 88, 79, 0.3)' },
        grid: { color: 'rgba(92, 88, 79, 0.3)' },
        pointLabels: {
          color: '#9A968B',
          font: { family: 'JetBrains Mono', size: 10 }
        },
        ticks: { display: false, stepSize: 20 },
        suggestedMin: 0,
        suggestedMax: 100
      }
    }
  };

  return <Radar data={data} options={options} />;
};

export const DomainsBar: React.FC = () => {
  const data = {
    labels: ['Agentic AI', 'Workflow Automation', 'Identity Governance', 'Business Intelligence', 'Conversational AI', 'Process Mining'],
    datasets: [{
      label: 'Depth',
      data: [98, 95, 88, 92, 85, 78],
      backgroundColor: '#8B1A1A',
      hoverBackgroundColor: '#B8935A',
      borderWidth: 0,
      borderRadius: 0,
      barThickness: 12
    }]
  };

  const options = {
    ...sharedOptions,
    indexAxis: 'y' as const,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#5C584F', font: { family: 'JetBrains Mono', size: 10 } }
      },
      y: {
        grid: { display: false },
        ticks: { color: '#9A968B', font: { family: 'JetBrains Mono', size: 11 } }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export const ToolsDonut: React.FC = () => {
  const data = {
    labels: ['Copilot', 'Power Automate', 'Python', 'Power BI', 'SailPoint', 'Dynamics 365', 'SQL', 'Other'],
    datasets: [{
      data: [25, 20, 15, 10, 10, 10, 5, 5],
      backgroundColor: [
        '#8B1A1A', '#3D2B1F', '#B8935A', '#E8E4D8', '#9A968B', '#5C584F', '#1A1A20', '#0D0D12'
      ],
      borderWidth: 1,
      borderColor: '#07070A',
    }]
  };

  const options = {
    ...sharedOptions,
    cutout: '75%',
    plugins: {
      ...sharedOptions.plugins,
      tooltip: {
        ...sharedOptions.plugins.tooltip,
        callbacks: {
          label: (item: any) => `${item.label}: ${item.raw}%`
        }
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="font-subdisplay text-[10px] text-bone-faded uppercase tracking-widest">Arsenal</span>
        <span className="font-display text-xl text-bone-white">MMXXVI</span>
      </div>
    </div>
  );
};

export const CareerArea: React.FC = () => {
  const data = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024', '2025', '2026'],
    datasets: [{
      label: 'AI & Automation',
      data: [0, 0, 0, 5, 15, 30, 80, 95],
      fill: true,
      backgroundColor: 'rgba(139, 26, 26, 0.4)',
      borderColor: '#8B1A1A',
      tension: 0.4,
      pointRadius: 0
    }]
  };

  const options = {
    ...sharedOptions,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#5C584F', font: { family: 'JetBrains Mono', size: 10 } }
      },
      y: {
        grid: { color: 'rgba(92, 88, 79, 0.1)' },
        ticks: { display: false }
      }
    }
  };

  return <Line data={data} options={options} />;
};
