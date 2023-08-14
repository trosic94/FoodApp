import "./home.css"
import React,{useEffect,useContext } from 'react';
import axiosInstance from '../../helpers/axiosConfigured'
import ChatByHour from "../../components/reports/ChatByHour"
import {fShortenNumber} from '../../helpers/formatNumber'
import Grid from '@mui/material/Grid';
import NotificationContext from '../../context/notificationContext';
import RealtimeChatLineChart from '../../components/reports/RealtimeChatLineChart'
import FoodItem from '../../components/foodItem/fooditem'

export default function Home() {
  
  const notificationCtx = useContext(NotificationContext);  
  const [userDailyRateData, setUserDailyRateData] = React.useState([]);
  const [userDailyRateDays, setUserDailyRateDays] = React.useState([]);
  const getData = async () => {
    let days = [];
    let numMsgs = [];
    let numMsgsFormatted = [];
    let result;
    try {
     result = await axiosInstance.post(`/stake/chat/messagesByDay`);
    }catch(err){
      if (err.response.status === 400 || err.response.status === 403 || err.response.status === 401){
        notificationCtx.error(err.response.data.message);
     }else{
       notificationCtx.error('Server error!');
     }
    }
    if(!result) return;
    for(const dataObj of result.data){
      days.push(dataObj.day);
      let numOfMessages = fShortenNumber(parseInt(dataObj['Number of messages by day']))
      numMsgsFormatted.push(numOfMessages);
      numMsgs.push(parseInt(dataObj['Number of messages by day']));

    }
    setUserDailyRateDays(days)
    setUserDailyRateData(numMsgs)
    
  }
  useEffect(() => {
    getData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);
  return (
    <div>
        <Grid container item spacing={3}>
          <Grid item>
            <FoodItem/>
          </Grid>
          <Grid item>
            <FoodItem/>
          </Grid>
          <Grid item>
            <FoodItem/>
          </Grid>
          <Grid item>
            <FoodItem/>
          </Grid>
          <Grid item>
            <FoodItem/>
          </Grid>
          <Grid item>
            <FoodItem/>
          </Grid>
          <Grid item>
            <FoodItem/>
          </Grid>
        </Grid>
    </div>
  )
}
