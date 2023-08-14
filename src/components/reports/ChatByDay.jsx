import PropTypes from 'prop-types';
import ReactApexChart from 'react-apexcharts';
// @mui
import { Card, CardHeader, Box } from '@mui/material';
// components
import { useChart } from '../chart';

import {fShortenNumber} from '../../helpers/formatNumber'
import React from "react";

// ----------------------------------------------------------------------

ChatByDay.propTypes = {
  title: PropTypes.string,
  subheader: PropTypes.string,
  chartData: PropTypes.array.isRequired,
  chartLabels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function ChatByDay({props, title, subheader, chartLabels,setdaySelected, chartData,xaxisformat,showLabels, ...other }) {
  // console.log(labels)
  const chartOptions = useChart({
    // plotOptions: { bar: { columnWidth: '16%' } },
    fill: { type: chartData.map((i) => i.fill) },
    // labels: chartLabels,
    chart: {
      events: {
        dataPointSelection: function(event, chartContext, config) {
            setdaySelected(config.w.config.xaxis.categories[config.dataPointIndex])
            
        }
      }
    },
    dataLabels: {
      enabled: showLabels??true,
      background: {
        borderRadius: 10,
      },
      formatter: function (val, opts) {
        return fShortenNumber(val)
      },
    },
    xaxis: { 
        type: 'datetime',
        labels: {
            datetimeUTC: false,
            format: xaxisformat
        },
        categories:chartLabels
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} messages`;
          }
          return y;
        },
      },
      x: {
        show: true,
        format:xaxisformat,
        formatter: undefined,
    },
    },
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart 
          type="line" 
          series={chartData} 
          options={chartOptions} 
          height={364} />
      </Box>
    </Card>
  );
}
