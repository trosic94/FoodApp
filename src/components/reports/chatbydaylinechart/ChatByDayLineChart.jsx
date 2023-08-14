import "./chatbydaylinechart.css";

import React,{useEffect,useState } from 'react';
import axiosInstance from '../../../helpers/axiosConfigured'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  import { Line } from 'react-chartjs-2';

  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
  export default function App() {
    const [chartData,setchartData] = useState({
      labels:[],
      datasets: [
          {
          label: 'Dataset 1',
          data: [],
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          }
      ],
      });
    const getData = async () => {
      let days = [];
      let numMsgs = [];
      let result = await axiosInstance.post(`/stake/chat/messagesByDay`);
      for(const dataObj of result.data){
        days.push(dataObj.day);
        numMsgs.push(parseInt(dataObj['Number of messages by day']));

      }
      setchartData({
        labels:days,
        datasets: [
            {
            label: 'Number of messages',
            data: numMsgs,
            borderColor: 'rgb(38, 66, 175)',
            backgroundColor: 'rgb(38, 66, 175)',
            }
        ],
        })
    }
    const options = {
        responsive: true,
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Number of messages per day',
          },
        },
      };

    useEffect(() => {
         getData()
      },[])
      return (
          <div style={{maxWidth:700,maxHeight:300}}>
            <Line options={options} data={chartData} />
          </div>
          )  
  }