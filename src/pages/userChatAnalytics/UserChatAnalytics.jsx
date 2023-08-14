import "./userChatAnalytics.css"
import { TextField} from '@mui/material';
import React,{useEffect,useContext} from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axiosInstance from '../../helpers/axiosConfigured'
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import KpiSummaryWidget from "../../components/reports/kpiSummaryWidget/KpiSummaryWidget"
import ChatByHour from "../../components/reports/ChatByHour"
import ChatByDay from "../../components/reports/ChatByDay"
import NotificationContext from '../../context/notificationContext';

const Chat = (props) => {
  const [dateFrom, setValueDateFrom] = React.useState(dayjs(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)));
  const [dateTo, setValueDateTo] = React.useState(dayjs(new Date(Date.now())));

  const handleChangeDateFrom = (newValue) => {
    setValueDateFrom(newValue)
  };
  const handleChangeDateTo = (newValue) => {
    setValueDateTo(newValue);
  };
  

  const notificationCtx = useContext(NotificationContext);  

  const [namesFilter, setNamesFilter] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  
    // eslint-disable-next-line no-unused-vars
  const [loading, setLoading] = React.useState(false)
  const [userHourlyRateData, setUserHourlyRateData] = React.useState([]);
  const [userHourlyRateHours, setUserHourlyRateHours] = React.useState([]);
  const [userDailyRateData, setUserDailyRateData] = React.useState([]);
  const [userDailyRateDays, setUserDailyRateDays] = React.useState([]);

  const [userDashData, setuserDashData] = React.useState();


  const [daySelected, setdaySelected] = React.useState();

  useEffect(() => {
    try {
    fetchHourlyCount(daySelected);
    } catch (error) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [daySelected]);

  const fetchHourlyCount  = async (daySelected) => {
    setLoading(true);
    if (!selectedUser) return;
            try {
              let userVal = selectedUser.user;
              const response = await axiosInstance.get('/userchatanalytics/chats/ChatsUserHourlyRate',{params:{username:userVal,dayToDisplay:daySelected}});
              const responseJson = await response.data;
              let arrHours = [];
              let arrData = [];
              responseJson.forEach(element => {
                arrHours.push(element.date_hour)
                arrData.push(element.count)
              });
              setUserHourlyRateHours(arrHours)
              setUserHourlyRateData(arrData)
                setLoading(false);
            } catch (err) {
                setLoading(false);
                if (err.response.status === 403 || err.response.status === 400){
                  notificationCtx.error(err.response.data.message);
                }else{
                  notificationCtx.error('Server error!');
                }
            }

  };
  const fetchDailyCount  = async () => {
    setLoading(true);
    if (!selectedUser) return;
            try {
              let userVal = selectedUser.user;
              const response = await axiosInstance.get('/userchatanalytics/chats/ChatsUserDailyRate',{params:{username:userVal,dateto:dateTo,days:30}});
              const responseJson = await response.data;
              let arrDays = [];
              let arrData = [];
              responseJson.forEach(element => {
                arrDays.push(element.date)
                arrData.push(element.count)
              });
              setUserDailyRateDays(arrDays)
              setUserDailyRateData(arrData)
                setLoading(false);
            } catch (err) {
                setLoading(false);
                if (err.response.status === 403 || err.response.status === 400){
                  notificationCtx.error(err.response.data.message);
                }else{
                  notificationCtx.error('Server error!');
                }
            }

  };
  const fetchUserDash = async () => {
    setLoading(true);
    if (!selectedUser) return;
            try {
              let userVal = selectedUser.user;
              const response = await axiosInstance.get('/userchatanalytics/chats/ChatsUserDashData',{params:{username:userVal,dateto:dateTo,datefrom:dateFrom}});
              const responseJson = await response.data;
              setuserDashData(responseJson[0])
                setLoading(false);
            } catch (err) {
                setLoading(false);
                if (err.response.status === 403 || err.response.status === 400){
                  notificationCtx.error(err.response.data.message);
                }else{
                  notificationCtx.error('Server error!');
                }
            }

  };
  const populateUsersList  = async () => {
            try {
              setSelectedUser('')
              setNamesFilter([])
              const response = await axiosInstance.post('/stake/chat/users-list',{dateFrom,dateTo});
              let responseJson = await response.data;
              setNamesFilter(responseJson);
            } catch (err) {
              if (err.response.status === 403 || err.response.status === 400){
                notificationCtx.error(err.response.data.message);
              }else{
                notificationCtx.error('Server error!');
              }
            }

  };
  const handleClick = () => {
    fetchHourlyCount(daySelected)
    fetchDailyCount()
    fetchUserDash()
}
  useEffect(() => {
    populateUsersList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dateFrom,dateTo]);
  return (
    <div className="userList" style={{ height: 800, width: '100%',margin:5,marginTop:0}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container item spacing={3}>
            <Grid item>
                <DateTimePicker 
                  value={dateFrom}
                  onChange={handleChangeDateFrom}
                  ampm={false}
                  renderInput={(params) => <TextField size="small" {...params} />}
                />
            </Grid>
            <Grid item>
                <DateTimePicker 
                  value={dateTo}
                  onChange={handleChangeDateTo}
                  ampm={false}
                  renderInput={(params) => <TextField size="small" {...params} />}
                />
            </Grid>
            <Grid item>
                  <Autocomplete
                    onChange={(event, value) => setSelectedUser(value)}
                    value={selectedUser||null}
                    size={'small'}
                    limitTags={1}
                    id="multiple-limit-tags"
                    loading
                    options={namesFilter}
                    getOptionLabel={(option) => option.user ? option.user : ""}
                    renderInput={(params) => (
                      <TextField {...params} label="Select user" placeholder="Select user" />
                    )}
                    sx={{ width: 400 }}
                  />
            </Grid>
            <Grid item>
              <LoadingButton 
                size="small"
                endIcon={<SendIcon />}
                loadingPosition="end"
                variant="contained"
                onClick={handleClick}
                >
                Process
              </LoadingButton>
            </Grid>
            <Box width="100%"/>
            <Grid item alignItems="center"  xs={12} sm={6} md={2}>
                <KpiSummaryWidget title="Total for choosen period" color="success" total={Number(userDashData?.total_for_period)} icon={'bi:calendar2-range-fill'} />
            </Grid>
            <Grid item alignItems="center"  xs={12} sm={6} md={2}>
                <KpiSummaryWidget title="Total current year" total={Number(userDashData?.total_current_year)} icon={'fluent-mdl2:total'} />
            </Grid>
            <Grid item alignItems="center"  xs={12} sm={6} md={2}>
                <KpiSummaryWidget title="Max in day" color="info" total={Number(userDashData?.max_in_day)} icon={'carbon:chart-maximum'} />
            </Grid>
            <Grid item alignItems="center"  xs={12} sm={6} md={2}>
                <KpiSummaryWidget title="Total current month" color="warning" total={Number(userDashData?.total_current_month)} icon={'ic:baseline-calendar-month'} />
            </Grid>
            <Grid item alignItems="center"  xs={12} sm={6} md={2}>
                <KpiSummaryWidget title="Average daily rate" color="error" total={Number(userDashData?.daily_average)} icon={'carbon:chart-average'} />
            </Grid>
            <Grid item alignItems="center"  xs={12} sm={6} md={2}>
                <KpiSummaryWidget title="Total today"  total={Number(userDashData?.total_today)} icon={'fluent:shifts-day-24-filled'} />
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
            <ChatByDay
              xaxisformat = "dd.MM"
              title="Daily messages"
              subheader="20 days from second date"
              chartLabels={userDailyRateDays}
              setdaySelected={setdaySelected}
              chartData={[
                {
                  name: 'Total messages in day',
                  type: 'bar',
                  fill: 'solid',
                  data: userDailyRateData,
                },
              ]}
            />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <ChatByHour
              xaxisformat = "HH"
              title="Hourly rate"
              subheader={daySelected ? `for ${daySelected}` : ''}
              chartLabels={userHourlyRateHours}
              chartData={[
                {
                  name: 'Total messages in day',
                  type: 'bar',
                  fill: 'solid',
                  data: userHourlyRateData,
                },
                // {
                //   name: 'Same day previous month',
                //   type: 'line',
                //   fill: 'solid',
                //   data: [44, 55, 41, 67],
                // },
              ]}
            />
          </Grid>
          </Grid>
          
        </LocalizationProvider>
     </div>
  )
}

export default Chat;
