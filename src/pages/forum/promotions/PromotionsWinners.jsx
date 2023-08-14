import "./promotionwinners.css"
import { DataGrid,GridToolbar  } from '@mui/x-data-grid';
import { Typography,Paper,Popper, Box,TextField, Button } from '@mui/material';
import React,{useEffect,useState,useContext } from 'react';
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import axiosInstance from '../../../helpers/axiosConfigured'
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import { getJWT } from "../../../helpers";
import NotificationContext from '../../../context/notificationContext';

function CircularProgressWithLabel(props) {
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
      <CircularProgress variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="caption" component="div" color="text.secondary">
          {`${Math.round(props.value)}%`}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  /**
   * The value of the progress indicator for the determinate variant.
   * Value between 0 and 100.
   * @default 0
   */
  value: PropTypes.number.isRequired,
};

function isOverflown(element) {
    return (
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth
    );
  }
  
  const GridCellExpand = React.memo(function GridCellExpand(props) {
    const { width, value } = props;
    const wrapper = React.useRef(null);
    const cellDiv = React.useRef(null);
    const cellValue = React.useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showFullCell, setShowFullCell] = React.useState(false);
    const [showPopper, setShowPopper] = React.useState(false);
  
    const handleMouseEnter = () => {
      const isCurrentlyOverflown = isOverflown(cellValue.current);
      setShowPopper(isCurrentlyOverflown);
      setAnchorEl(cellDiv.current);
      setShowFullCell(true);
    };
  
    const handleMouseLeave = () => {
      setShowFullCell(false);
    };
  
    React.useEffect(() => {
      if (!showFullCell) {
        return undefined;
      }
  
      function handleKeyDown(nativeEvent) {
        // IE11, Edge (prior to using Bink?) use 'Esc'
        if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
          setShowFullCell(false);
        }
      }
  
      document.addEventListener('keydown', handleKeyDown);
  
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [setShowFullCell, showFullCell]);
  
    return (
        <Box
          ref={wrapper}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          sx={{
            alignItems: 'center',
            lineHeight: '24px',
            width: '100%',
            height: '100%',
            position: 'relative',
            display: 'flex',
          }}
        >
          <Box
            ref={cellDiv}
            sx={{
              height: '100%',
              width,
              display: 'block',
              position: 'absolute',
              top: 0,
            }}
          />
          <Box
            ref={cellValue}
            sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {value}
          </Box>
          {showPopper && (
            <Popper
              open={showFullCell && anchorEl !== null}
              anchorEl={anchorEl}
              style={{ width, marginLeft: -17 }}
            >
              <Paper
                elevation={1}
                style={{ minHeight: wrapper.current.offsetHeight - 3 }}
              >
                <Typography variant="body2" style={{ padding: 8 }}>
                  {value}
                </Typography>
              </Paper>
            </Popper>
          )}
        </Box>
      );
    });
  
  GridCellExpand.propTypes = {
    value: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  };
  
  function renderCellExpand(params) {
    let val;
    if (params.value){
      val = params.value.toString();
    } else val='';
    return (
      <GridCellExpand value={val || ''} width={params.colDef.computedWidth} />
    );
  }
  
  renderCellExpand.propTypes = {
    /**
     * The column of the row that the current cell belongs to.
     */
    colDef: PropTypes.object.isRequired,
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: PropTypes.string,
  };

const Chat = (props) => {
  const [pageTitle, setPageTitle] = React.useState('');
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  function handleClick() {
    setLoading(true);
    fetchData();
  }

  const notificationCtx = useContext(NotificationContext);  

  const [topicId, setTopicId] = React.useState(null);
  const handlesetTopicId = (event) => {
    setTopicId(event.target.value);
  };
  let timer;

  const fetchData  = async () => {
            try {
                if(!topicId){
                  setLoading(false);
                  return;
                }
                setTableData([]);
                axiosInstance.defaults.headers.post['x-access-token'] = getJWT();
                setProgress(0);
                var timesRun = 0;
                timer = setInterval(async () => {
                  timesRun++;
                  if(timesRun === 1000){
                    clearInterval(timer);
                  }
                  try {
                    const responseCount = await axiosInstance (`/forum/promotions/count-processed-posts?topicid=${topicId}`);
                    let num = await responseCount.data[0].percent ? responseCount.data[0].percent : 0;
                    await setProgress(parseInt(num));
                  } catch (e) {
                    clearInterval(timer);
                  }
                }, 800);
                const response = await axiosInstance (`/forum/promotions/processed-posts?topicid=${topicId}`);
                clearInterval(timer);
                setLoading(false);
                const responseJson = await response.data;
                let title = responseJson.title;
                setPageTitle(title);
                setTableData(responseJson.data.map((item, index) =>
                  {
                    let dateForumCreation = new Date(item.date)
                    let betDate = new Date(item.betCreatedat)
                    let timeDiff  = (item.date && item.betCreatedat) ? Number((dateForumCreation - betDate) / 1000 / 60 / 60).toFixed(2) : ''
                   return {
                    post_id : item.post_id,
                    post_url : item.post_url,
                    post_date : item.date,
                    bet_amount : item.bet_amount,
                    bet_payout_multiplier : item.bet_payout_multiplier,
                    stake_user : item.stake_user,
                    bet_iid : item.bet_iid,
                    forum_user_name : [item.forum_user_name,item.author_profile_url],
                    currency : item.currency,
                    betcreatedat : item.betCreatedat,
                    betValue : item.bet_value,
                    timeDiff : timeDiff,
                    gameName : item.game_name,
                   }
                   
                  })
                );
            } catch (err) {
              if (err.response.status === 400 || err.response.status === 403 || err.response.status === 401){
                 notificationCtx.error(err.response.data.message);
              }else{
                notificationCtx.error('Server error!');
              }
              clearInterval(timer);
              setTableData([]);
              setLoading(false);
              console.clear();
            }

  };

  useEffect(() => {
    //fetchData();
    }, []);
    const columns = [
      { field: 'forum_user_name', 
      headerName: 'FORUM USER', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 1,
      minWidth : 100,
      renderCell: (params) => {return(
        <Button target="_blank" href={params.value[1]} size="small">
          {params.value[0]}
        </Button>)
      }
      },
      { field: 'post_url', 
      headerName: 'POST', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 1,
      minWidth : 100,
      renderCell: (params) => {return(
        <Button target="_blank" href={params.value} size="small">Post url</Button>)
      }
      },
      { field: 'post_date', 
      headerName: 'POST DATE', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 1,
      minWidth : 100
      },
      { field: 'timeDiff', 
        headerName: 'Bet-Post hours diff', 
        headerClassName: 'super-app-theme--header',
        headerAlign: 'center',
        flex : 1,
        minWidth : 100
      },
      { field: 'bet_iid', 
      headerName: 'BET IID', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 1,
      minWidth : 100,
      renderCell: renderCellExpand
      },
      { field: 'bet_amount', 
      headerName: 'BET AMOUNT', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 1,
      minWidth : 100,
      renderCell: renderCellExpand
      },
      { field: 'bet_payout_multiplier', 
      headerName: 'PAYOUT MULTIPLIER', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 1,
      renderCell: renderCellExpand
      },
      { field: 'stake_user', 
      headerName: 'STAKE USER', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 1,
      renderCell: renderCellExpand
      },
      { field: 'currency', 
      headerName: 'CURRENCY', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 1,
      renderCell: renderCellExpand
      },
      { field: 'betcreatedat', 
      headerName: 'BET DATE', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 1,
      renderCell: renderCellExpand
      },
      { field: 'betValue', 
      headerName: 'BET VALUE', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 1,
      renderCell: renderCellExpand
      },
      { field: 'gameName', 
      headerName: 'GAME NAME', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 1,
      renderCell: renderCellExpand
      }
    ];
  return (
    <div className="userList" style={{ height: 800, width: '100%',margin:5 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container   spacing={3} my={2} alignItems="center">
            <Grid item>
                <TextField size="small" id="topic_id" onChange={handlesetTopicId} label="PROMOTION ID" variant="outlined" />
            </Grid>
            <Grid item>
              <LoadingButton
                size="small"
                onClick={handleClick}
                endIcon={<SendIcon />}
                loading={loading}
                loadingPosition="end"
                variant="contained"
                >
                Process promotion posts
              </LoadingButton>
            </Grid>
            <Grid item>
              <CircularProgressWithLabel  variant="determinate" value={progress} />
            </Grid>
          </Grid>
        </LocalizationProvider>
        <Typography variant="h5" gutterBottom>{pageTitle}</Typography>
        <DataGrid  
            rows={tableData} 
            columns={columns} 
            getRowId={row => row.post_id}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            sx={{
                height: 800,
                width: '100%',
                '& .super-app-theme--header': {
                    fontSize: 14,
                    fontWeight:700
                },
            }}
        />
    </div>
  )
}

export default Chat;
