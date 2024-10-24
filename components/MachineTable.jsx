'use client';

import React, { useState, useMemo } from 'react';

const MachineTable = ({ machines }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('title');
  const [sortDirection, setSortDirection] = useState('asc');

  // Format price for display ('20000' -> $20,000)
  const formatPrice =(price) => {
    if (price.toLowerCase().includes('call for price')) {
      return 'N/A';
    }
    const numericPrice = parseFloat(price.replace(/[^0-9.-]+/g,""));
    return isNaN(numericPrice) ? 'N/A' : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(numericPrice);
  };

  const getPriceValue = (price) => {
    if (price.toLowerCase().includes('call for price')) {
      return Infinity; // This will push "Call for Price" items to the end when sorting
    }
    return parseFloat(price.replace(/[^0-9.-]+/g,"")) || Infinity;
  };

  // Filter and sort machines based on search term and sort settings
  const filteredAndSortedMachines = useMemo(() => {
    return machines
      .filter(machine =>
        machine.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.price.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (sortColumn === 'price') {
          return (getPriceValue(a.price) - getPriceValue(b.price)) * (sortDirection === 'asc' ? 1 : -1);
        }
        if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
        if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
  }, [machines, searchTerm, sortColumn, sortDirection]);

  // Handle column sorting
  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  return (
    <div> 
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search machines..."
          className="px-4 py-2 border rounded-md w-full"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              {['title', 'price', 'description'].map((column) => (
                <th
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort(column)}
                >
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                  {sortColumn === column && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedMachines.map((machine) => (
              <tr key={machine._id}>
                <td className="px-6 py-4 whitespace-nowrap">{machine.title}</td>
                <td className="px-6 py-4 whitespace-nowrap">{formatPrice(machine.price)}</td>
                <td className="px-6 py-4 whitespace-nowrap">{machine.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default MachineTable;
