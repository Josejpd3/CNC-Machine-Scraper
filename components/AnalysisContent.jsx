'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import StatCard from '@/components/StatCard'
import MachineTable from '@/components/MachineTable'
import MachineTypePieChart from '@/components/MachineTypePieChart'
import AveragePriceBarChart from '@/components/AveragePriceBarChart'
import { Button } from '@/components/ui/button'
import PriceTrendChart from '@/components/PriceTrendChart'

const AnalysisContent = () => {
  const [machines, setMachines] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMachines = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/machines');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received data:', data);
      
      if (!Array.isArray(data)) {
        console.error('Received data is not an array:', data);
        throw new Error(`Data is not an array. Received: ${typeof data}`);
      }
      
      setMachines(data);
    } catch (error) {
      console.error('Error fetching machines:', error);
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMachines()
  }, [fetchMachines])

  const stats = useMemo(() => {
    if (!Array.isArray(machines) || machines.length === 0) return null

    const totalMachines = machines.length

    const prices = machines
      .map(m => {
        const price = m.price?.replace('$', '').replace(',', '')
        return price ? parseFloat(price) : NaN
      })
      .filter(p => !isNaN(p))

    const averagePrice = prices.length > 0
      ? prices.reduce((sum, price) => sum + price, 0) / prices.length
      : 0

    const minPrice = prices.length > 0 ? Math.min(...prices) : 0
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0

    return {
      totalMachines,
      averagePrice,
      minPrice,
      maxPrice
    }
  }, [machines])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-100 border border-red-400 rounded-lg">
        <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchMachines}>Try Again</Button>
      </div>
    )
  }

  if (!stats || machines.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-100 border border-gray-300 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">No Data Available</h2>
        <p className="text-gray-600 mb-4">There are currently no machines in the database.</p>
        <Button onClick={fetchMachines}>Refresh Data</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Machines" 
          value={stats.totalMachines}
          description="Total number of CNC machines in the database"
        />
        <StatCard 
          title="Average Price" 
          value={`$${stats.averagePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          description="Average price of CNC machines"
        />
        <StatCard 
          title="Lowest Price" 
          value={`$${stats.minPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          description="Lowest price of CNC machines"
        />
        <StatCard 
          title="Highest Price" 
          value={`$${stats.maxPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          description="Highest price of CNC machines"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Machine Type Distribution</h2>
          <MachineTypePieChart machines={machines} />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Average Price by Machine Type</h2>
          <AveragePriceBarChart machines={machines} />
        </div>
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Price Trends by Machine Type</h2>
        <PriceTrendChart machines={machines} />
      </div>
      <MachineTable machines={machines} />
    </div>
  )
}

export default AnalysisContent
