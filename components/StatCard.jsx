'use client';

import React from 'react'

const StatCard = ({ title, value, description }) => {
  const formattedValue = typeof value === 'number' 
    ? value.toLocaleString()
    : value;

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex flex-col">
        <dt className="text-sm font-medium text-gray-500 truncate">
          {title}
        </dt>
        <dd className="mt-1 text-3xl font-semibold text-gray-900">
          {formattedValue}
        </dd>
        {description && (
          <dd className="mt-3 text-sm text-gray-500">
            {description}
          </dd>
        )}
      </div>
    </div>
  )
}

export default StatCard
