'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';

import { Trip } from './map';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
type TripsVisualizationProps = {
  trips: Trip[];
  tripsLoading: boolean;
};
const TripsVisualization = ({
  trips,
  tripsLoading
}: TripsVisualizationProps) => {
  if (tripsLoading) return <p>Loading charts...</p>;

  const tripsData = trips || [];

  // Hitung jumlah perjalanan per metode pembayaran
  const paymentCounts = tripsData.reduce((acc: any, trip: any) => {
    acc[trip.payment_type] = (acc[trip.payment_type] || 0) + 1;
    return acc;
  }, {});

  // Konversi ke format PieChart
  const paymentData = Object.keys(paymentCounts).map((key) => ({
    name: key,
    value: paymentCounts[key]
  }));

  // Hitung rata-rata tarif berdasarkan metode pembayaran
  const fareByPayment = tripsData.reduce((acc: any, trip: any) => {
    const fare = Number(trip.fare_amount) || 0; // Pastikan angka
    const type = trip.payment_type || 'Unknown'; // Default jika tidak ada

    if (!acc[type]) {
      acc[type] = { totalFare: 0, count: 0 };
    }
    acc[type].totalFare += fare;
    acc[type].count += 1;
    return acc;
  }, {});

  const fareData = Object.keys(fareByPayment).map((key) => ({
    name: key,
    avgFare:
      fareByPayment[key].count > 0
        ? fareByPayment[key].totalFare / fareByPayment[key].count
        : 0 // Hindari pembagian dengan 0
  }));

  // Hitung jumlah perjalanan berdasarkan jumlah penumpang
  const passengerCounts = tripsData.reduce((acc: any, trip: any) => {
    acc[trip.passenger_count] = (acc[trip.passenger_count] || 0) + 1;
    return acc;
  }, {});

  const passengerData = Object.keys(passengerCounts).map((key) => ({
    name: `Penumpang ${key}`,
    count: passengerCounts[key]
  }));

  return (
    <div className='grid grid-cols-1 gap-4 md:grid-cols-3'>
      {/* Distribusi Metode Pembayaran */}
      <div className='flex w-full flex-col items-center'>
        <h3 className='mb-2 text-lg font-bold'>Distribusi Metode Pembayaran</h3>
        <ResponsiveContainer width='100%' height={300}>
          <PieChart>
            <Pie
              data={paymentData}
              cx='50%'
              cy='50%'
              outerRadius={80}
              fill='#8884d8'
              dataKey='value'
            >
              {paymentData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Rata-rata Tarif Berdasarkan Metode Pembayaran */}
      <div className='w-full'>
        <h3 className='mb-2 text-lg font-bold'>
          Rata-rata Tarif per Metode Pembayaran
        </h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={fareData}>
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='avgFare' fill='#82ca9d' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Distribusi Jumlah Penumpang */}
      <div className='w-full'>
        <h3 className='mb-2 text-lg font-bold'>Distribusi Jumlah Penumpang</h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={passengerData}>
            <XAxis dataKey='name' />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey='count' fill='#ff7300' />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TripsVisualization;
