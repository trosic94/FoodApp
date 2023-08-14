import { Button,TextField,InputAdornment,Chip,Checkbox,Tooltip} from '@mui/material';
import {MarkAsUnreadOutlined} from '@mui/icons-material';
import React,{useEffect,useState,useContext} from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/sr';
import axiosInstance from '../../helpers/axiosConfigured'
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import NotificationContext from '../../context/notificationContext';
import { DataGrid,GridToolbar  } from '@mui/x-data-grid';
import { DatePicker  } from '@mui/x-date-pickers/DatePicker';
import RefreshOutlined from '@mui/icons-material/RefreshOutlined';
import Refresh from '@mui/icons-material/Refresh';

const maximumNumberOfRows = 5000;
const minimumNumberOfRows = 1;

const KycBulkRejection = (props) => {

  const [dataAutoRefreshTimer, setdataAutoRefreshTimer] = useState();

  const notificationCtx = useContext(NotificationContext);  
  const fileReader = new FileReader();

  const [file, setFile] = useState();
  const [fileChip, setfileChip] = useState();
  const [rejectReason, setrejectReason] = useState();

  const [tableData, setTableData] = useState([]);

  const statusFilter = ['Not Rejected','Rejected']
  const [selectedStatus, setselectedStatus] = React.useState([]);
  const [selectedDate, setselectedDate] = React.useState(new Date((new Date()).getTime() - ((new Date())).getTimezoneOffset() * 60000));
  const handleChangeDate = (newValue) => {
    let date = new Date(newValue);
    let userTimezoneOffset = date.getTimezoneOffset() * 60000;
    setselectedDate(new Date(date.getTime() - userTimezoneOffset));
  };

  const [checkedAutoRefresh, setcheckedAutoRefresh] = React.useState(false);

  const handleChangeAutoRefresh = (event) => {
    setcheckedAutoRefresh(event.target.checked);
  };

      useEffect(()=> {
            if (checkedAutoRefresh){
              setdataAutoRefreshTimer(setInterval(() => {
                fetchTableData()
              }, 5000))
            }else{
              clearInterval(dataAutoRefreshTimer)
            }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[checkedAutoRefresh])
  useEffect(()=> {
    clearInterval(dataAutoRefreshTimer)
    setcheckedAutoRefresh(false)
    fetchTableData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[selectedStatus,selectedDate])
  const fetchTableData = async () => {
    try {
      let rejectionsData = (await axiosInstance.post(`/kyc/bulkrejectlevelone/getrejections`,{rejected:selectedStatus,date:selectedDate})).data;
      setTableData(rejectionsData)
    } catch (err) {
      if (err.response.status === 403 || err.response.status === 400 || err.response.status === 401){
        notificationCtx.error(err.response.data.message);
      }else{
        notificationCtx.error('Server error!');
      }
    }
    
  }

  const refFileUpload = React.useRef();
  function handleEmptyFileInput() {
    refFileUpload.current.value = ""
  }
  
  const [array, setArray] = useState([]);
  const csvFileToArray = preparedString => {
    let isFileValid = ([true,0]);
    const string = preparedString.replace(/\r?\n/g, "\r\n")
    const csvHeader = string.slice(0, string.indexOf("\r\n")).split(",");
    const csvRows = string.slice(string.indexOf("\r\n") + 2).split("\r\n");
  
    const array = csvRows.map((i,rownum) => {
      const values = i.split(",");
      const obj = csvHeader.reduce((object, header, index) => {
        object[header.trim().toLowerCase()] = values[index].trim();
        
        if (header.trim().toUpperCase() === 'USERID'){
            if(values[index].trim().length < 10){
              isFileValid = ([false,rownum]);
            }
        }
        if (header.trim().toUpperCase() === 'USERNAME'){
          if(values[index].trim().length < 3){
            isFileValid = ([false,rownum]);
          }
        }
        return object;
      }, {});
      return obj;
    });
    if(!isFileValid[0]){
      notificationCtx.error('Invalid data on row: '+(isFileValid[1]+2));
      return;
    }
    if (array.length > maximumNumberOfRows || array.length < minimumNumberOfRows){
      notificationCtx.error(`Number of rows must be between ${minimumNumberOfRows} and ${maximumNumberOfRows}`);
      return;
    }
    setfileChip(<Chip label={file.name+': '+array.length+' rows'} variant="outlined" onDelete={handleRemoveFile} />)
    setArray(array);
  };

    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if(!file){
          notificationCtx.error('Upload csv file!');
          return;
        }
        if(!rejectReason){
          notificationCtx.error('Enter reject reason!');
          return;
        }
        array.forEach(element => {
          element.reason = rejectReason;
        });
        try {
          await axiosInstance.post(`/kyc/bulkrejectlevelone/rejectusers`,{array,rejectReason})
        } catch (err) {
          if (err.response.status === 403 || err.response.status === 400){
            notificationCtx.error(err.response.data.message);
          }else{
            notificationCtx.error('Server error!');
          }
          fetchTableData()
          return;
        }
        fetchTableData()
        setFile()
    };
    const handleOnSubmitDelete = async (e) => {
      e.preventDefault();
      try {
        await axiosInstance.post(`/kyc/bulkrejectlevelone/deleteunrejected`)
      } catch (err) {
        if (err.response.status === 403 || err.response.status === 400){
          notificationCtx.error(err.response.data.message);
        }else{
          notificationCtx.error('Server error!');
        }
        fetchTableData()
        return;
      }
      fetchTableData()
      setFile()
    }

  // const handleExecuteRejections = async() =>{
  //   axiosInstance.post(`/kyc/bulkrejectlevelone/executerejections`)
  //   setcheckedAutoRefresh(true)
  // }

  // const handleRefreshStatus = async() =>{
  //   axiosInstance.post(`/kyc/bulkrejectlevelone/updatestatus`)
  //   setcheckedAutoRefresh(true)
  // }

  const handleOnChange = (e) => {
      setFile(e.target.files[0]);
  };
  const handleRemoveFile = (e) => {
    setFile();
};
    useEffect(()=> {
      if(!file){
        handleEmptyFileInput()
        setfileChip();
        return;
      }
      fileReader.readAsText(file);
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
        csvFileToArray(csvOutput);
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[file]);
  
  const columns = [
    { field: 'id', 
    headerName: 'Row id', 
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align:'center',
    flex : 4,
    minWidth : 20,
    maxWidth : 100,
    },
    { field: 'username', 
    headerName: 'USERNAME', 
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align:'center',
    flex : 4,
    minWidth : 20,
    maxWidth : 200,
    },
    { field: 'userid', 
    headerName: 'USER ID', 
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align:'center',
    flex : 1,
    minWidth : 30,
    },
    { field: 'reason', 
    headerName: 'REJECT REASON', 
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align:'center',
    flex : 1,
    disableColumnFilter : false,
    },
    { field: 'rejected', 
    headerName: 'REJECTED', 
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align:'center',
    flex : 1,
    disableColumnFilter : false,
    maxWidth : 120,
    },
    { field: 'reject_date', 
    headerName: 'REJECT DATE', 
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align:'center',
    flex : 1,
    disableColumnFilter : false,
    valueFormatter: params => {return params?.value ? new Date(params?.value).toLocaleString() : ''},
    },
  ];



  return (
    <div className="userList" style={{ height: 800, width: '100%',margin:5,marginTop:0}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container   spacing={3} my={1} alignItems="center">
          <Grid item>
              <Button
                variant="contained"
                component="label"
              >
                Select File
                <input
                  type="file"
                  ref={refFileUpload}
                  accept={".csv"}
                  onChange={handleOnChange}
                  hidden
                />
              </Button>
            </Grid>
            <Grid item>
              {fileChip}
            </Grid>
            <Grid item>
            <TextField
                id="outlined-number"
                label="Reason"
                focused 
                value={rejectReason||""}
                onChange={(e) => {
                  setrejectReason(e.target.value);
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MarkAsUnreadOutlined />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                component="label"
                onClick={(e) => {
                  handleOnSubmit(e);
                }}
              >
               Add all to list
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={selectedStatus === 'Rejected' ? true : false}
                variant="contained"
                component="label"
                onClick={(e) => {
                  handleOnSubmitDelete(e);
                }}
              >
               Delete today`s unrejected
              </Button>
            </Grid>
          </Grid>
          <Grid container   spacing={3} my={1} alignItems="center">
            <Grid item>
                  <Autocomplete
                    onChange={(event, value) => setselectedStatus(value)}
                    defaultValue={statusFilter[0]}
                    size={'small'}
                    limitTags={1}
                    id="multiple-limit-tags"
                    options={statusFilter}
                    getOptionLabel={(option) => option}
                    renderInput={(params) => (
                      <TextField {...params} label="Status" placeholder="Status" />
                    )}
                    sx={{ width: 200 }}
                  />
            </Grid>
            <Grid item>
                <DatePicker  
                  value={selectedDate}
                  onChange={handleChangeDate}
                  label="List date"
                  placeholder="List date"
                  disableMaskedInput={true}
                  ampm={false}
                  renderInput={(params) => <TextField size="small" {...params} 
                  sx={{ width: 200 }}
                  />
                }
                />
            </Grid>
            <Grid item>
              <Tooltip title="Refresh every 5 second">
                <Checkbox
                  checked={checkedAutoRefresh}
                  onChange={handleChangeAutoRefresh}
                  icon={<RefreshOutlined />}
                  checkedIcon={<Refresh />}
                />
              </Tooltip>
            </Grid>
          </Grid>
          <DataGrid  
            rows={tableData} 
            getRowHeight={() => 'auto'}
            disableColumnFilter = {true}
            columns={columns} 
            getRowId={row => row.id}
            density="compact"
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
                    fontSize: 20,
                    fontWeight:700
                },
            }}
        />
        </LocalizationProvider>
    </div>
  )
}

export default KycBulkRejection;
