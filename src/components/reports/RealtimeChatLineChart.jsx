import React,{useEffect } from 'react';
import { useChart } from '../chart';
import { Card, CardHeader, Box } from '@mui/material';
import ReactApexChart from 'react-apexcharts';

import { createClient } from 'graphql-ws';

const clientEnglish = createClient({
  url: 'wss://stake.com/_api/websockets',
}); 
let EnglishCounter = [];
let liveChartStep = 10;
async function getChatData(chatid,client){

  client.subscribe({
    query: `subscription {
      chatMessages(chatId: "${chatid}") {
          createdAt
          id
          data {
          ... on ChatMessageDataText {
              message
          }
          },
          chat{
              id
          },
          user{
          name
          }
      }
  }`
  },
  {
    async next(data) {
        if (data?.data?.chatMessages?.data?.message){
          const now = new Date();
          const minutesAndSeconds = now.getMinutes() + ':' + Math.round((now.getSeconds()) / liveChartStep) * liveChartStep;
          EnglishCounter.push(minutesAndSeconds)
        }
    },
    error(error) {
        console.log("subscriptionError", error);
    },
    complete() {
        console.log("subscriptionComplete");
    },
    }
  );
}
  

  export default  function App() {
    let liveArray = []
    let series = [{data:[]}];

  const ApexCharts = window.ApexCharts;
    useEffect(() => {
      getChatData("f0326994-ee9e-411c-8439-b4997c187b95",clientEnglish);
      window.setInterval(() => {
        const now = new Date(new Date() - 10000);
        const minutesAndSeconds = (now.getMinutes()) + ':' + (Math.round((now.getSeconds()) / liveChartStep) * liveChartStep);
        if (liveArray?.length === 9){
            liveArray.shift()
        }
        liveArray.push({
            x:minutesAndSeconds,
            y:EnglishCounter.filter(x => x===minutesAndSeconds).length
        })
        ApexCharts.exec('realtime', 'updateSeries', [{data:liveArray}])
      }, 10000)
    },[]);
    let chartData = [
        {
        name: 'Total messages in day',
        type: 'line',
        fill: 'solid'
        }
    ]; 

    const chartOptions = useChart({
        fill: { type: chartData.map((i) => i.fill) },
        chart:{
            id: 'realtime',
            animations: {
              enabled: true,
              easing: 'linear',
              dynamicAnimation: {
                speed: 10000
              }
            },
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
            format:"HH:mm",
            formatter: undefined,
        },
        },
      });
      return (
        <div className="home">
            <Card>
                <CardHeader title="Realtime"/>
                <Box sx={{ p: 1, pb: 1 }} dir="ltr">
                    <ReactApexChart 
                    series={series} 
                    options={chartOptions} 
                    height={200} />
                </Box>
            </Card>
        </div>
      ) 
  }