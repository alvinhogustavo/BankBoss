import React from 'react';
import { HistoryEntry } from '../types';

interface PerformanceChartProps {
  data: HistoryEntry[];
}

interface Point {
    x: number;
    y: number;
}

// Helper to get properties of a line between two points.
const lineProperties = (pointA: Point, pointB: Point) => {
  const lengthX = pointB.x - pointA.x;
  const lengthY = pointB.y - pointA.y;
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX)
  };
};

// Helper to calculate a control point for a smooth bezier curve.
const controlPoint = (current: Point, previous: Point | undefined, next: Point | undefined, reverse?: boolean) => {
  // When 'previous' or 'next' is not defined, use the 'current' point.
  const p = previous || current;
  const n = next || current;
  const smoothing = 0.2; // Adjust this value for the curve smoothness

  // Get properties of the line connecting previous and next points
  const o = lineProperties(p, n);

  // If reverse is true, mirror the angle to get the second control point.
  const angle = o.angle + (reverse ? Math.PI : 0);
  const length = o.length * smoothing;

  // Calculate the control point coordinates.
  const x = current.x + Math.cos(angle) * length;
  const y = current.y + Math.sin(angle) * length;
  
  return [x, y];
};

// Creates the SVG path data for a smooth line through the given points.
const createSmoothPath = (points: Point[]) => {
  let path = `M ${points[0].x} ${points[0].y}`;
  
  for (let i = 1; i < points.length; i++) {
    // Get the control point for the start of the curve segment.
    const [cpsX, cpsY] = controlPoint(points[i - 1], points[i - 2], points[i]);
    // Get the control point for the end of the curve segment.
    const [cpeX, cpeY] = controlPoint(points[i], points[i - 1], points[i + 1], true);

    path += ` C ${cpsX},${cpsY} ${cpeX},${cpeY} ${points[i].x},${points[i].y}`;
  }
  
  return path;
};


const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  const width = 300;
  const height = 150;
  const padding = { top: 20, bottom: 25, left: 35, right: 5 }; // Space for labels

  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  if (data.length < 2) {
    return null;
  }

  const bankrollValues = data.map(d => d.bankroll);
  const minBankroll = Math.min(...bankrollValues);
  const maxBankroll = Math.max(...bankrollValues);
  
  // Avoid division by zero if all values are the same
  const yRange = maxBankroll - minBankroll === 0 ? 1 : maxBankroll - minBankroll;

  const points = data.map((point, i) => {
    const x = (i / (data.length - 1)) * chartWidth + padding.left;
    const y = chartHeight - ((point.bankroll - minBankroll) / yRange) * chartHeight + padding.top;
    return { x, y, value: point.bankroll };
  });
  
  const pathData = createSmoothPath(points);
  const areaPathData = `${pathData} L ${points[points.length - 1].x},${height - padding.bottom} L ${points[0].x},${height - padding.bottom} Z`;

  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
      <defs>
        <style>
          {`
            @keyframes pulse {
              0%, 100% {
                r: 4;
                stroke-opacity: 1;
              }
              50% {
                r: 7;
                stroke-opacity: 0.5;
              }
            }
            .pulse-point {
              animation: pulse 2s ease-in-out infinite;
            }
          `}
        </style>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4"/>
           <stop offset="100%" stopColor="#0f172a" stopOpacity="0"/>
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
        </filter>
      </defs>

      {/* Grid Lines & Y-Axis Labels */}
      {[0, 0.5, 1].map(ratio => {
        const yValue = maxBankroll - yRange * ratio;
        const y = chartHeight * ratio + padding.top;
        return (
          <g key={ratio}>
            <line
              x1={padding.left} y1={y}
              x2={width - padding.right} y2={y}
              stroke="#404040" strokeWidth="0.5"
            />
             <text x={padding.left - 4} y={y} dy="3" fontSize="9" fill="#71717a" textAnchor="end">
              {`R$${yValue.toFixed(0)}`}
            </text>
          </g>
        );
      })}

      {/* Area Gradient */}
      <path d={areaPathData} fill="url(#areaGradient)" stroke="none" />

      {/* Line */}
      <path
        d={pathData}
        fill="none"
        stroke="url(#lineGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ filter: 'url(#glow)' }}
      />
      
      {/* Data Points - Now the line will pass through them */}
      {points.map((point, i) => (
         <circle 
            key={i} 
            cx={point.x} 
            cy={point.y} 
            r={i === points.length - 1 ? 0 : 3.5} // Hide last static point, pulse will show
            fill="#0f172a" 
            stroke="#fde047" 
            strokeWidth="1.5" 
         />
      ))}
      
      {/* Last point pulse */}
      <circle
        className="pulse-point"
        cx={lastPoint.x}
        cy={lastPoint.y}
        fill="#fde047"
        stroke="#fef08a"
        strokeWidth="1.5"
      />

      {/* Date Labels (X-Axis) */}
      <text x={firstPoint.x} y={height} fontSize="10" fill="#a1a1aa" textAnchor="start" dy="-5">
        {new Date(data[0].date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
      </text>
      <text x={lastPoint.x} y={height} fontSize="10" fill="#a1a1aa" textAnchor="end" dy="-5">
        {new Date(data[data.length - 1].date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
      </text>
    </svg>
  );
};

export default PerformanceChart;