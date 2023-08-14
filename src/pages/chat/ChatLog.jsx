import "./chatLog.css"
import { DataGrid,GridToolbar  } from '@mui/x-data-grid';
import { Typography,Paper,Popper, Box,TextField,MenuItem,Select,FormControl ,InputLabel   } from '@mui/material';
import React,{useEffect,useState,useContext} from 'react';
import PropTypes from 'prop-types';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import axiosInstance from '../../helpers/axiosConfigured'
import CircularProgress from '@mui/material/CircularProgress';
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import flags from '../../images/flags';
import { GiSoccerBall } from 'react-icons/gi'
import { HiBadgeCheck } from 'react-icons/hi'
import NotificationContext from '../../context/notificationContext';

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
    return (
      <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
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
  const [tableData, setTableData] = useState([]);

  const [dateFrom, setValueDateFrom] = React.useState(dayjs(new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)));
  const [dateTo, setValueDateTo] = React.useState(dayjs(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)));

  const handleChangeDateFrom = (newValue) => {
    setValueDateFrom(newValue);
  };
  const handleChangeDateTo = (newValue) => {
    setValueDateTo(newValue);
  };
  
  const notificationCtx = useContext(NotificationContext);  

  const [loading, setLoading] = React.useState(false)
  const [loadingGetUsers, setLoadingGetUsers] = React.useState(false)

  function handleClick() {
    fetchData()
  }

  function handleClickGetUsers() {
    setLoadingGetUsers(true);
    populateUsersList();
  }
  
  const [namesFilter, setNamesFilter] = React.useState([]);
  const [selectedUsers, setSelectedUSers] = React.useState([]);


  const chatsIds = [
    {
      label: "English",
      src: flags.GB,
      link: " ",
      value: "f0326994-ee9e-411c-8439-b4997c187b95"
    },
    {
      label: "Sports",
      src: GiSoccerBall,
      link: " ",
      value: "5cba7c13-b384-4c52-ad59-f169b23c62f8"
    },
    {
      label: "Challenges",
      src: HiBadgeCheck,
      link: " ",
      value: "5d43c7fb-e444-4b0d-aa5e-1e78becd86eb"
    },
    {
      label: "Deutsch",
      src: flags.DE,
      link: " ",
      value: "94e807f3-a2fc-4caf-b0ff-ccc613f71879"
    },
    {
      label: "Français",
      src: flags.FR,
      link: " ",
      value: "5a6e5063-0154-47eb-9064-f69547213fe5"
    },
    {
      label: "हिन्दी",
      src: flags.IND,
      link: " ",
      value: "38530077-e0f1-4cf7-8a92-08e9b3c7b63a"
    },
    {
      label: "Português",
      src: flags.BR,
      link: " ",
      value: "366c04f5-bdea-4415-8e2e-2d6952bf409d"
    },
    {
      label: "Türkçe",
      src: flags.TUR,
      link: " ",
      value: "6ceca59c-394a-40e1-a133-0c2999d687bc"
    },
    {
      label: "Filipino",
      src: flags.FIL,
      link: " ",
      value: "688cf7f9-00d9-4e26-aa4f-bd7cc47e3ae4"
    },
    {
      label: "日本語",
      src: flags.JAP,
      link: " ",
      value: "c65b4f32-0001-4e1d-9cd6-e4b3538b43ae"
    },
    {
      label: "Polski",
      src: flags.POL,
      link: " ",
      value: "81458dff-a653-4e9d-88c8-91b77f99e45b"
    },
    {
      label: "Tiếng Việt",
      src: flags.VIE,
      link: " ",
      value: "8c9994c8-192b-44aa-ac26-f083baf29896"
    },
    {
      label: "Indonesian",
      src: flags.INDO,
      link: " ",
      value: "e824dc29-68ea-41a4-b69e-60fe31226e43"
    },
    {
      label: "Suomen",
      src: flags.FIN,
      link: " ",
      value: "36f221a6-ba29-4d7c-9fc8-5c8dbe5d0127"
    },
    {
      label: "Español",
      src: flags.SPA,
      link: " ",
      value: "76609291-6ff5-4d0c-9ed6-0fde1d27de33"
    },
    {
      label: "Pусский",
      src: flags.RUS,
      link: " ",
      value: "69b2aa0a-53b6-4eed-ada2-ad1d1f4d5bfe"
    },
    {
      label: "한국어",
      src: flags.SK,
      link: " ",
      value: "18f9a83c-0cfb-4c72-8600-23fbe0180e45"
    },
    {
      label: "中文",
      src: flags.CHI,
      link: " ",
      value: "96deb88b-ced9-4b78-b4da-8a65324c2aff"
    }
  ];
  
  const [chatId, setChatId] = React.useState("f0326994-ee9e-411c-8439-b4997c187b95");

  const handleSetChatId = (event) => {
    setChatId(event.target.value);
  };
  const fetchData  = async () => {
    setLoading(true);
            try {
              const response = await axiosInstance.post('/stake/chat/messages',{dateFrom,dateTo,selectedUsers,chatId});
              const responseJson = await response.data;
                setTableData(responseJson.map((item, index) =>(
                  {
                      id : item.message_id,
                      message: item.message,
                      user: item.user,
                      createdat: item.messageDate,
                      // serial: item.serial,
                  }))
                );
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
  useEffect(() => {
    if (chatId.length > 1) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatId]);

  const populateUsersList  = async () => {
    setLoadingGetUsers(true);
            try {
              const response = await axiosInstance.post('/stake/chat/users-list',{dateFrom,dateTo});
              const responseJson = await response.data;
              setNamesFilter(responseJson);
                setLoadingGetUsers(false);
            } catch (err) {
              setLoadingGetUsers(false);
              console.error(err);
            }

  };

  const checkIfPng = (source) => {
    try {
      source.substring(source.indexOf(":")+1, source.indexOf(";"))//check if it is base64 image(console.log to check)
      return true
    } catch (error) {
      return false
    }
  }
    const columns = [
      { field: 'message', 
      headerName: 'MESSAGE', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 4,
      minWidth : 200,
      renderCell: renderCellExpand
      },
      { field: 'user', 
      headerName: 'USER', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 1,
      minWidth : 100,
      renderCell: renderCellExpand
      },
      { field: 'createdat', 
      headerName: 'CREATED AT', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      flex : 1,
      disableColumnFilter : false,
      renderCell: renderCellExpand
      },
    ];
  return (
    <div className="userList" style={{ height: 800, width: '100%',margin:5,marginTop:0}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container   spacing={3} my={1} alignItems="center">
            <Grid item>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Room</InputLabel>
                <Select
                  size={'small'}
                  sx={{ width: 200 }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={chatId}
                  label="Age"
                  onChange={handleSetChatId}
                >
                  {chatsIds.map((option,key) => (
                    <MenuItem value={option.value} key={key}>
                      {checkIfPng(option.src) ? 
                        <img style={{verticalAlign:"middle"}} width={20} height={20} src={option.src} alt={option.label} />
                      : 
                        <option.src style={{verticalAlign:"middle"}}/>
                      }
                      {" "}{option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
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
              <LoadingButton 
                size="small"
                endIcon={<SendIcon />}
                loadingPosition="end"
                variant="contained"
                loading={loadingGetUsers}
                onClick={handleClickGetUsers}
                >
                Get users
              </LoadingButton>
            </Grid>
            <Grid item>
                  <Autocomplete
                    multiple
                    onChange={(event, value) => setSelectedUSers(value)}
                    size={'small'}
                    limitTags={1}
                    id="multiple-limit-tags"
                    options={namesFilter}
                    getOptionLabel={(option) => option.user}
                    renderInput={(params) => (
                      <TextField {...params} label="Filter users" placeholder="Filter users" />
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
                Get filtered chat
              </LoadingButton>
            </Grid>
          </Grid>
        </LocalizationProvider>
        <DataGrid  
            rows={tableData} 
            disableColumnFilter = {true}
            columns={columns} 
            getRowId={row => row.id}
            density="compact"
            components={{ Toolbar: GridToolbar }}
            loading={loading}
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
                    fontSize: 20,
                    fontWeight:700
                },
            }}
        />
    </div>
  )
}

export default Chat;
