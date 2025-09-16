
'use client';

import { useRef, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend, ChartOptions } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export default function SignaturesChart() {
    const chartRef = useRef<ChartJS<'line', number[], string>>(null);

    const data = {
        labels: Array.from({length: 12}, (_, i) => `S${i+1}`),
        datasets: [
            { label: 'Firmas', data: [3,5,4,7,8,6,9,11,10,12,13,14], borderColor: '#818cf8', backgroundColor: 'transparent', fill: true, tension: 0.35, borderWidth: 2, pointRadius: 0 },
            { label: 'Completadas', data: [2,4,3,5,6,5,8,9,9,10,12,12], borderColor: '#34d399', backgroundColor: 'transparent', fill: true, tension: 0.35, borderWidth: 2, pointRadius: 0 }
        ]
    };

    useEffect(() => {
        const chart = chartRef.current;
        if (chart) {
            const ctx = chart.ctx;
            const gradient1 = ctx.createLinearGradient(0, 0, 0, 200);
            gradient1.addColorStop(0, 'rgba(99,102,241,0.35)');
            gradient1.addColorStop(1, 'rgba(99,102,241,0.02)');
            
            const gradient2 = ctx.createLinearGradient(0, 0, 0, 200);
            gradient2.addColorStop(0, 'rgba(16,185,129,0.35)');
            gradient2.addColorStop(1, 'rgba(16,185,129,0.02)');
            
            chart.data.datasets[0].backgroundColor = gradient1;
            chart.data.datasets[1].backgroundColor = gradient2;
            chart.update();
        }
    }, []);

    const options: ChartOptions<'line'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { mode: 'index' as const, intersect: false, displayColors: false } },
        scales: {
          x: { 
            grid: { color: 'rgba(255,255,255,0.06)' }, 
            ticks: { 
              color: 'rgba(226,232,240,0.7)' as any, 
              font: { weight: '500' }
            } 
          },
            y: { grid: { color: 'rgba(255,255,255,0.06)' }, ticks: { color: 'rgba(226,232,240,0.7)' as any } }
        }
    };
    
    return <Line ref={chartRef} options={options} data={data} />;
};
