import React, { useMemo, useState, useEffect } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';
import { Slider } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend);

const redTheme = createTheme({
  palette: {
    primary: {
      main: 'rgba(239, 68, 68, 0.9)',
    },
  },
});

const PriceTrendChart = ({ machines }) => {
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
  const [yearRange, setYearRange] = useState({ min: 0, max: Infinity });

  const getMachineType = (description) => {
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.includes('lathe')) return 'Lathe';
    if (lowerDesc.includes('router')) return 'Router';
    if (lowerDesc.includes('machining center')) return 'Machining Center';
    if (lowerDesc.includes('mill')) return 'Mill';
    return 'Other';
  };

  const getYearFromTitle = (title) => {
    const match = title.match(/^(\d{4})/);
    return match ? parseInt(match[1]) : null;
  };

  const getPriceFromMachine = (machine) => {
    return parseFloat(machine.price.replace('Call for Price', '0').replace(/[^0-9.-]+/g,"")) || 0;
  };

  const allPrices = useMemo(() => {
    return machines.map(getPriceFromMachine).filter(price => price > 0);
  }, [machines]);

  const allYears = useMemo(() => {
    return machines.map(m => getYearFromTitle(m.title)).filter(year => year !== null);
  }, [machines]);

  const defaultPriceRange = useMemo(() => {
    return {
      min: Math.min(...allPrices),
      max: Math.max(...allPrices)
    };
  }, [allPrices]);

  const defaultYearRange = useMemo(() => {
    return {
      min: Math.min(...allYears),
      max: Math.max(...allYears)
    };
  }, [allYears]);

  useEffect(() => {
    setPriceRange(defaultPriceRange);
    setYearRange(defaultYearRange);
  }, [defaultPriceRange, defaultYearRange]);

  const chartData = useMemo(() => {
    const typeColors = {
      'Lathe': 'rgb(255, 99, 132)',
      'Router': 'rgb(54, 162, 235)',
      'Machining Center': 'rgb(75, 192, 192)',
      'Mill': 'rgb(255, 206, 86)',
      'Other': 'rgb(153, 102, 255)'
    };

    const datasets = Object.entries(typeColors).map(([type, color]) => ({
      label: type,
      data: machines
        .filter(m => getMachineType(m.description) === type)
        .map(m => ({
          x: getYearFromTitle(m.title),
          y: getPriceFromMachine(m),
          title: m.title
        }))
        .filter(point => 
          point.x !== null && 
          point.y >= priceRange.min && 
          point.y <= priceRange.max &&
          point.x >= yearRange.min &&
          point.x <= yearRange.max
        ),
      backgroundColor: color,
    }));

    return { datasets };
  }, [machines, priceRange, yearRange]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Year'
        },
        ticks: {
          stepSize: 1,
          callback: function(value) {
            return value.toString();
          }
        },
        min: yearRange.min,
        max: yearRange.max
      },
      y: {
        title: {
          display: true,
          text: 'Price ($)'
        },
        min: priceRange.min,
        max: priceRange.max
      }
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context) {
            const point = context.raw;
            return `${point.title}: $${point.y.toLocaleString()}`;
          }
        }
      },
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'CNC Machine Prices by Year and Type'
      }
    }
  };

  const handleSliderChange = (name) => (event, newValue) => {
    if (name === 'price') {
      setPriceRange({ min: newValue[0], max: newValue[1] });
    } else if (name === 'year') {
      setYearRange({ min: newValue[0], max: newValue[1] });
    }
  };

  return (
    <ThemeProvider theme={redTheme}>
      <div className="w-full">
        <div className="mb-4 space-y-4">
          <div>
            <label className="block mb-2">Price Range: ${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()}</label>
            <Slider
              value={[priceRange.min, priceRange.max]}
              onChange={handleSliderChange('price')}
              valueLabelDisplay="auto"
              min={defaultPriceRange.min}
              max={defaultPriceRange.max}
              step={1000}
              color="primary"
            />
          </div>
          <div>
            <label className="block mb-2">Year Range: {yearRange.min} - {yearRange.max}</label>
            <Slider
              value={[yearRange.min, yearRange.max]}
              onChange={handleSliderChange('year')}
              valueLabelDisplay="auto"
              min={defaultYearRange.min}
              max={defaultYearRange.max}
              step={1}
              color="primary"
            />
          </div>
        </div>
        <div className="w-full" style={{ height: '500px' }}>
          <Scatter data={chartData} options={options} />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default PriceTrendChart;
