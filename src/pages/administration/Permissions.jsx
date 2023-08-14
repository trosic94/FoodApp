import "./permissions.css"
import { DataGrid,GridToolbar  } from '@mui/x-data-grid';
import { TextField,Switch  } from '@mui/material';
import React,{useEffect,useState,useContext} from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axiosInstance from '../../helpers/axiosConfigured'
import SendIcon from '@mui/icons-material/Send';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import NotificationContext from '../../context/notificationContext';

const labelSwitch = { inputProps: { 'aria-label': 'Switch demo' } };

const Chat = (props) => {
  const [tableData, setTableData] = useState([]);
  const notificationCtx = useContext(NotificationContext);  

  const [loading, setLoading] = React.useState(false)

  function handleClick() {
    fetchData()
  }
  
  const [namesFilter, setNamesFilter] = React.useState([]);
  const [selectedUsers, setSelectedUSers] = React.useState([]);

  const fetchData  = async () => {
    if(!selectedUsers?.id){
        notificationCtx.error('Select user!');
        return;
    } 
    let userid = selectedUsers?.id;
    setLoading(true);
            try {
              const response = await axiosInstance.get('/administration/data/user-permissions',{params:{userid:userid}});
              const responseJson = await response.data;
                setTableData(responseJson.map((item, index) =>(
                  {
                    id : item.id,
                    username : item.username,
                    permission: item.permision,
                    updatedat: new Date(item.updatedAt).toLocaleString(),
                    confirmed: item.confirmed,
                  }))
                );
                setLoading(false);
            } catch (err) {
                setLoading(false);
                if (err.response.status === 403 || err.response.status === 400 || err.response.status === 401){
                  notificationCtx.error(err.response.data.message);
                }else{
                  notificationCtx.error('Server error!');
                }
            }

  };


  const populateUsersList  = async () => {
            try {
              const response = await axiosInstance.get('/administration/data/portal-users');
              const responseJson = await response.data;
              setNamesFilter(responseJson);
            } catch (err) {
              if (err.response.status === 403 || err.response.status === 400 || err.response.status === 401){
                notificationCtx.error(err.response.data.message);
              }else{
                notificationCtx.error('Server error!');
              }
            }

  };

  useEffect(() => {
    populateUsersList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
    const columns = [
      { field: 'username', 
      headerName: 'USERNAME', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align:'center',
      flex : 4,
      minWidth : 20,
      maxWidth : 200,
      },
      { field: 'permission', 
      headerName: 'PERMISSION', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align:'center',
      flex : 1,
      minWidth : 30,
      },
      { field: 'updatedat', 
      headerName: 'UPDATED AT', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align:'center',
      flex : 1,
      disableColumnFilter : false,
      },
      { field: 'confirmed', 
      headerName: 'ACTIVE', 
      headerClassName: 'super-app-theme--header',
      headerAlign: 'center',
      align:'center',
      flex : 1,
      disableColumnFilter : false,
      renderCell: (params) => {
        const handleSwitchChange = async () => {
            await axiosInstance.get('/administration/data/set-user-permissions',{params:{permissionid:params.row.id,value:!params.value}});
            fetchData();
          };
        return <Switch onChange={handleSwitchChange} {...labelSwitch} checked={params.value}/>;
      },
      
      },
    ];
  return (
    <div className="userList" style={{ height: 800, width: '100%',margin:5,marginTop:0}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container   spacing={3} my={1} alignItems="center">
            <Grid item>
                  <Autocomplete
                    onChange={(event, value) => setSelectedUSers(value)}
                    size={'small'}
                    limitTags={1}
                    id="multiple-limit-tags"
                    options={namesFilter}
                    getOptionLabel={(option) => option.username}
                    renderInput={(params) => (
                      <TextField {...params} label="Select User" placeholder="Select User" />
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
                Get permissions
              </LoadingButton>
            </Grid>
          </Grid>
        </LocalizationProvider>
        <DataGrid  
            rows={tableData} 
            getRowHeight={() => 'auto'}
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
