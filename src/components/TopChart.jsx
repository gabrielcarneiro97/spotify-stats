import React, { PureComponent } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  XAxis,
  Line,
} from 'recharts';

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function TopChart({ data }) {
  const set = [];
  data.forEach(o => set.push(...Object.keys(o)));
  const musics = [...new Set(set)].filter(e => e !== 'xAxisChart');

  const lines = musics.map((musicName) => {
    const CustomizedLabel = (props) => {
      const {
        x, y, stroke,
      } = props;

      return <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">{musicName}</text>;
    };
    return <Line label={<CustomizedLabel />} type="monotone" key={musicName} dataKey={musicName} stroke={getRandomColor()} />;
  });

  return (
    <ResponsiveContainer>
      <LineChart
        data={data}
        margin={{
          top: 20,
          right: 100,
          left: 100,
          bottom: 10,
        }}
      >
        <XAxis dataKey="xAxisChart" />
        {lines}
      </LineChart>
    </ResponsiveContainer>
  );
}

export default TopChart;
