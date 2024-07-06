import React from 'react';
import {
  BarChart,
  Bar,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

function BarChartDashboard({ budgetList }) {
  return (
    <div className='border rounded-lg p-5 '>
      <h2 className='font-bold text-lg mb-4'>Activity</h2>
      <ResponsiveContainer width={'100%'} height={450}>
        <BarChart data={budgetList} margin={{top:7}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="totalSpend" stackId="a" fill="#0E4F8B"/>
          <Bar dataKey="amount" stackId="a" fill="#A1D0FB" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartDashboard;
