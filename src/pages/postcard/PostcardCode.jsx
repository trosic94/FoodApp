import { Button,TextField,InputAdornment,Alert,Stack,Divider,Box,Paper,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Tab,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,
  Accordion,AccordionSummary,AccordionDetails,Typography} from '@mui/material';
import {TabContext,TabList,TabPanel  } from '@mui/lab';
import {AccountCircle,MarkAsUnreadOutlined,AttachEmailOutlined,MarkunreadOutlined,MoreTime,Person,EventAvailable,MailLock} from '@mui/icons-material';
import React,{useEffect,useContext} from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axiosInstance from '../../helpers/axiosConfigured'
import SendIcon from '@mui/icons-material/Send';
import Clear from '@mui/icons-material/Clear';
import LoadingButton from '@mui/lab/LoadingButton';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import NotificationContext from '../../context/notificationContext';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import List from '@mui/material/List';
import ListItemText from '@mui/material/ListItemText';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}
const latestClaimedCodesLimitToShow = 10;

const dailyPostcardUtilizationLimitForBot = 60;
const userWagerMinimumAlert = 2000;

const PostcardCode = (props) => {

  const [expanded, setExpanded] = React.useState('panel1');
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };

  const [postcardIdValidator, setpostcardIdValidator] = React.useState(false)

  const notificationCtx = useContext(NotificationContext);  

  const [username, setusername] = React.useState()
  const [usernameSuggestions, setusernameSuggestions] = React.useState([])

  const [postcardid, setpostcardid] = React.useState()
  const [userdata, setuserdata] = React.useState([]);
  const [postcardCode, setpostcardCode] = React.useState()

  const [submitCodeButtonStatusDisabled, setsubmitCodeButtonStatusDisabled] = React.useState(true);

  const [codeApprovingDetails, setCodeApprovingDetails] = React.useState();

  const [verifDetails, setverifDetails] = React.useState([]);
  const [verifHistory, setverifHistory] = React.useState([]);

  const [tabValue, setTabValue] = React.useState('1');

  const [isOpenRejectDialog, setisOpenRejectDialog] = React.useState(false);

  const [usersLastClaimedCodesToShow, setusersLastClaimedCodesToShow] = React.useState([]);

  const [rejectCommentGroup, setrejectCommentGroup] = React.useState([]);

  const [postcardCodeSearchClaimed, setpostcardCodeSearchClaimed] = React.useState({code:null})
  const [postcardCodeSearchClaimedRes, setpostcardCodeSearchClaimedRes] = React.useState([])
  const [postcardCodeSearchUnClaimed, setpostcardCodeSearchUnClaimed] = React.useState({code:null})
  const [postcardCodeSearchUnClaimedRes, setpostcardCodeSearchUnClaimedRes] = React.useState([])

  const [rejectReason, setrejectReason] = React.useState()
  const [rejectNote, setrejectNote] = React.useState()

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUsernameChange = async (newUsername) => {
    setusername(newUsername)
    setsubmitCodeButtonStatusDisabled(true)
    //setuserdata([])
    setpostcardCode()
  };

  const handleCodeSearchClaimedChange = async (newParam) => {
    setpostcardCodeSearchClaimedRes([])
    if(!username || !newParam?.code || newParam?.code.length < 6) return;
    setpostcardCodeSearchClaimedRes((await axiosInstance.get(`/postcard/PostcardGetUserSpecificCode`,{params:{username:username,filter:'claimed',code:newParam?.code}}))?.data?.user?.postcardCodeList||[])
  }
    useEffect(()=> {
      handleCodeSearchClaimedChange(postcardCodeSearchClaimed)
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[postcardCodeSearchClaimed]);
  
  const handleCodeSearchUnClaimedChange = async (newParam) => {
    setpostcardCodeSearchUnClaimedRes([])
    if(!username || !newParam?.code || newParam?.code.length < 6) return;
    setpostcardCodeSearchUnClaimedRes((await axiosInstance.get(`/postcard/PostcardGetUserSpecificCode`,{params:{username:username,filter:'unclaimed',code:newParam?.code}}))?.data?.user?.postcardCodeList||[])
  }
  useEffect(()=> {
    handleCodeSearchUnClaimedChange(postcardCodeSearchUnClaimed)
    // eslint-disable-next-line react-hooks/exhaustive-deps
},[postcardCodeSearchUnClaimed]);


  useEffect(() => {
    const onMessage = (event) => {
      try {
        let response = event.data.split("/")
        if (response.at(-1) === `mail-${postcardid}-front.jpg`){
          setpostcardIdValidator(true)
        }else{
          setpostcardIdValidator(false);
        }
      } catch (error) {
        
      }
    };
    window.addEventListener('message', onMessage);
    return () => {
      window.removeEventListener('message', onMessage);
    }
  }, [postcardid]) // empty array => run only once




  const handlePosctcardIdChange = (postcardId) => {
    setpostcardid(postcardId)
    console.clear();
  };
  
  const handleCloseRejectDialog = () => {
    setisOpenRejectDialog(false)
  }
  const handleOpenRejectDialog = async () => {
    setrejectCommentGroup((await axiosInstance.get(`/postcard/PostcardGetRejectCommentGroupSuggestions`)).data)

    setCodeApprovingDetails();
    if (!postcardCode){
      notificationCtx.error('Enter code!');
      return;
    }
    if(postcardCode.length < 6){
      notificationCtx.error('Code length is minimum 6 charachters!');
      return;
    }
    if (!postcardid || postcardid.length < 6){
      notificationCtx.error('Enter valid postcard ID!');
      return;
    }

    if(!postcardIdValidator){
      notificationCtx.error('No image available!');
      return;
    }
    
    setisOpenRejectDialog(true)
  }

  const handleSubmitRejection = async () => {

    if (!rejectReason){
      notificationCtx.error('Add reject reason!');
      return;
    }
    let rejectLogModel = {
      username:username,
      code: postcardCode,
      postcard_id: postcardid,
      payed_status_stake: false,
      payed_status_mebit: 'REJECTED',
      comment_group: rejectReason,
      notes : rejectNote||''
    }

    let rejectResult; 
    try {
      rejectResult = (await axiosInstance.get(`/postcard/PostcardCreatePayoutLog`,{params:{payoutmodel:rejectLogModel}})).data;
    } catch (error) {
      notificationCtx.error(error.response.data.message);
      console.clear();
      return;
    }
    if(rejectResult?.status){
      setCodeApprovingDetails(<Alert variant="filled" severity="success">{rejectResult.message}</Alert>)
      setpostcardCode()
      handleCloseRejectDialog()
    }
  }


  const handleUsernameSuggestion = async (userInput) => {
    if (userInput.length < 3) return;
    let data = (await axiosInstance.get(`/postcard/PostcardGetUsersSuggestions`,{params:{username:userInput,limit:5}})).data
    setusernameSuggestions(data?.suggestUser||[])
  };

  useEffect(()=> {
    if (username?.length > 2){
      getUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[username]);


  const refreshClaimedList = async () => {
              let latestClaimedCodes = (await axiosInstance.get(`/postcard/PostcardGetUsersClaimedPostcards`,{params:{username:username,limit:latestClaimedCodesLimitToShow}})).data;
                    let claimedCodes = [];
                    for (let index = 0; index < latestClaimedCodes.user.postcardCodeList.length; index++) {
                      const element = latestClaimedCodes.user.postcardCodeList[index];
                      claimedCodes.push(createData(element?.code||'-', 
                      element?.status||'-', 
                      element?.createdAt||'-', 
                      element?.claimedAt||'-', 
                      element?.authId.name||'-', 
                      ))
                    }
                    setusersLastClaimedCodesToShow(claimedCodes)
  };
  
  

  
  const handlePayoutClick = async () => {
    

    setCodeApprovingDetails();
    if (!postcardCode){
      notificationCtx.error('Enter code!');
      return;
    }
    if(postcardCode.length < 6){
      notificationCtx.error('Code length is minimum 6 charachters!');
      return;
    }
    if (!postcardid || postcardid.length < 6){
      notificationCtx.error('Enter valid postcard ID!');
      return;
    }

    if(!postcardIdValidator){
      notificationCtx.error('No image available!');
      return;
    }
    // if (username != "Milan" && username != "MilosTr") return;
    let codePayingResult; 
    try {
      codePayingResult = (await axiosInstance.get(`/postcard/PostcardActivateCode`,{params:{username:username,postcardid:postcardid,code:postcardCode}})).data;
    } catch (error) {
      notificationCtx.error(error.response.data.message);
      console.clear();
      return;
    }
    refreshClaimedList();
    // console.log(postcardCode+'---'+username+'---'+postcardid)
  
    // let latestClaimedCodes = (await axiosInstance.get(`/postcard/PostcardGetUsersClaimedPostcards`,{params:{username:username,limit:latestClaimedCodesLimit}})).data;
    let latestClaimedCodes = (await axiosInstance.get(`/postcard/PostcardGetUserSpecificCode`,{params:{username:username,filter:'claimed',code:postcardCode}}))?.data;
    let findIfCodeClaimed = latestClaimedCodes?.user.postcardCodeList.find(e => e.code === postcardCode);
    if (findIfCodeClaimed?.code === postcardCode) {
      setCodeApprovingDetails(<Alert variant="filled" severity="success">{`Code ${findIfCodeClaimed.code} successfully claimed - ${new Date(findIfCodeClaimed.claimedAt).toLocaleString()}`}</Alert>);

      setpostcardCodeSearchClaimed({code:postcardCode})
      setpostcardCodeSearchUnClaimed({code:postcardCode})
      // setpostcardCode()
        try {
          axiosInstance.get(`/postcard/PostcardUpdatePayoutLog`,{params:{payoutmodel:{rowid:codePayingResult.rowid,payed_status_mebit:'PAYED_EXACT_USER',comment_group:'',notes:''}}})
        } catch (error) {
        }
      }else{
        if(!codePayingResult.status){//ako nije isplaceno
          setCodeApprovingDetails(<Alert variant="filled" severity="warning">{`Code ${postcardCode} is not executed!`}</Alert>)
        }else{//PROBLEM - isplaceno pogresnom korisniku
          setCodeApprovingDetails(<Alert variant="filled" severity="error">{`Code ${postcardCode} is executed, but not for ${username}!`}</Alert>)
          try {
            axiosInstance.get(`/postcard/PostcardUpdatePayoutLog`,{params:{payoutmodel:{rowid:codePayingResult.rowid,payed_status_mebit:'PAYED_WRONG_USER',comment_group:'',notes:''}}})
          } catch (error) {
          }
        }
      }
      
    
    
    // await axiosInstance.get(`/postcard/PostcardUpdatePayoutLog`,{params:{payoutmodel:{rowid:5,payed_status_mebit:'PAYED_EXACT_USER',comment_group:'',notes:''}}})
  };

  

  const getUserData  = async () => {
            try {
              let usernameVal = username
                if (!usernameVal) return;          
                setpostcardCodeSearchClaimed({code:null})
                setpostcardCodeSearchUnClaimed({code:null})
                setverifDetails([])
                setverifHistory([])
                setusersLastClaimedCodesToShow([])
                setuserdata([])
                let data = (await axiosInstance.get(`/postcard/PostcardGetUserData`,{params:{username:usernameVal}})).data;
                    let botDetection = (await axiosInstance.get(`/analytics/pc/PcData/pc_v_bot_probability/json`)).data;
                    let botPosibility = [false,0];
                    for (let index = 0; index < botDetection.length; index++) {
                      const element = botDetection[index];
                      if(element.username.toUpperCase() === usernameVal.toUpperCase() && Number(element.daily_utilization) >= dailyPostcardUtilizationLimitForBot){
                        botPosibility[0] = true;
                        botPosibility[1]++;
                      }
                    }

                    let userInfo = data.user;
                    if(!userInfo) {
                      setuserdata([{type:"error",text:"User not found!"}])
                      return;
                    }
                    setsubmitCodeButtonStatusDisabled(false)
                    let wageredData = []
                    if (Number(userInfo.snapshotSummary.betValue) < userWagerMinimumAlert ){
                      wageredData.push('error')
                      wageredData.push('Wagered -> '+userInfo.snapshotSummary.betValue)
                    }else{
                      wageredData.push('success')
                      wageredData.push('Wagered -> '+userInfo.snapshotSummary.betValue)
                    }
              
                    let userRoles = [];
                    let rolestype = 'success';
                    for (let index = 0; index < userInfo.roles.length; index++) {
                      const role = userInfo.roles[index];
                      userRoles.push(role.name);
                      if (role.name.toUpperCase() === 'BANNED' || role.name.toUpperCase() === 'SUSPENDED' || role.name.toUpperCase() === 'KYCBANNED' || role.name.toUpperCase() === 'ABUSER') rolestype = 'error'
                    }
                    if (userRoles.length === 0) userRoles.push('No roles')

                    let userDataArr = [];
                    userDataArr.push({
                      type:"info",
                      text:userInfo.email
                    },{
                      type:wageredData[0],
                      text:wageredData[1]
                    },{
                      type:rolestype,
                      text:userRoles.join(' | ')
                    })

                    let abuserRoleExist = false;
                    for (let index = 0; index < userInfo.roles.length; index++) {
                      const role = userInfo.roles[index];
                      if (role.name.toUpperCase() === 'ABUSER') abuserRoleExist = true;
                    }

                    if (abuserRoleExist){
                      userDataArr.push({
                        type:"warning",
                        text:`${username} has ABUSER role!!!`
                      })
                    } 

                    if (botPosibility[0]){
                      userDataArr.push({
                        type:"error",
                        text:`High possibility of BOT, user has minimum ${botPosibility[1]} days with over ${dailyPostcardUtilizationLimitForBot}% of daily maximum number of envelops`
                      })
                    }                 
                    setuserdata(userDataArr)
                    setverifDetails([createData(userInfo.veriffUser.additionalDetails?.street||'-', 
                                                userInfo.veriffUser.additionalDetails?.city||'-', 
                                                userInfo.veriffUser.additionalDetails?.residenceCountry||'-', 
                                                userInfo.veriffUser.additionalDetails?.addressString||'-', 
                                                userInfo.veriffUser?.status||'-', 
                                                ),
                                    ])

                    let verifHistoryArr = [];
                    for (let index = 0; index < userInfo.veriffSessionList.length; index++) {
                      const element = userInfo.veriffSessionList[index];
                      verifHistoryArr.push(createData(element?.firstName||'-', 
                      element?.lastName||'-', 
                      element?.status||'-', 
                      element?.createdAt||'-', 
                      element?.updatedAt||'-', 
                      ))
                    }
                    setverifHistory(verifHistoryArr)
                    refreshClaimedList()
            } catch (err) {
              if (err.response.status === 403 || err.response.status === 400){
                notificationCtx.error(err.response.data.message);
              }else{
                notificationCtx.error('Server error!');
              }
            }

  };


  return (
    <div className="userList" style={{ height: 800, width: '100%',margin:5,marginTop:0}}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container   spacing={3} my={1} alignItems="center">
          <Grid item>
              <Autocomplete
                  // value={username||''}
                  // onChange={(e,val) => {handleUsernameChange(val);}}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  autoHighlight={true}
                  id="free-solo-demo"
                  sx={{ my: 2,minWidth:200 }}
                  autoComplete
                  options={usernameSuggestions.map((option) => option?.name)}
                  onChange={(event, newInputValue) => {
                    handleUsernameChange(newInputValue);
                  }}
                  onInputChange={(event, newInputValue) => {
                    handleUsernameSuggestion(newInputValue);
                  }}
                  renderInput={(params) => 
                      <TextField
                        {...params}
                        id="outlined-username"
                        label="Username"
                        InputProps={{
                          ...params.InputProps,
                          startAdornment: (
                            <InputAdornment position="start">
                              <AccountCircle />
                            </InputAdornment>
                          ),
                        }}
                      />
                    }
                />
            </Grid>
            <Grid item>
              {/* <LoadingButton 
                size="small"
                color="success"
                endIcon={<HowToRegOutlined />}
                loadingPosition="end"
                variant="contained"
                onClick={handleCheckClick}
                >
                Check
              </LoadingButton> */}
            </Grid>
            <Grid item>
                <TextField
                  id="outlined-username"
                  label="Postcard ID"
                  onChange={(e) => {
                    handlePosctcardIdChange(e.target.value);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachEmailOutlined />
                      </InputAdornment>
                    ),
                  }}
                />
            </Grid>

            <Grid item>
              <TextField
                id="outlined-number"
                label="Code"
                type="number"
                color="error"
                focused 
                value={postcardCode||""}
                onChange={(e) => {
                  setpostcardCode(e.target.value);
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
              <LoadingButton 
                disabled={submitCodeButtonStatusDisabled}
                size="small"
                endIcon={<SendIcon />}
                loadingPosition="end"
                variant="contained"
                onClick={handlePayoutClick}
                >
                Submit Code
              </LoadingButton>
            </Grid>
            <Grid item>
            <Dialog open={isOpenRejectDialog} onClose={handleCloseRejectDialog}>
              <DialogTitle>Reject {username}'s envelope({postcardid}) for CODE: {postcardCode} </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Code and Postcard ID will be proccessed and unavailable for future usage.
                </DialogContentText>
                <Autocomplete
                  value={rejectReason||''}
                  onChange={(e) => {setrejectReason(e.target.innerText);}}
                  id="free-solo-demo"
                  sx={{ my: 2 }}
                  freeSolo
                  options={rejectCommentGroup.map((option) => option.comment_group)}
                  renderInput={(params) => <TextField   {...params} label="Reject reason" />}
                />
                <TextField
                  value={rejectNote||''}
                  onChange={(e) => {
                    setrejectNote(e.target.value);
                  }}
                  autoFocus
                  margin="dense"
                  id="notes"
                  label="Notes"
                  type="text"
                  fullWidth
                  variant="standard"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseRejectDialog}>Cancel</Button>
                <Button onClick={handleSubmitRejection} variant="contained" color="error">Reject</Button>
              </DialogActions>
            </Dialog>
              <LoadingButton 
                disabled={submitCodeButtonStatusDisabled}
                size="small"
                color='error'
                endIcon={<Clear />}
                loadingPosition="end"
                variant="contained"
                onClick={() => handleOpenRejectDialog(true)}
                >
                Reject code
              </LoadingButton>
            </Grid>
            <Grid item>
              {codeApprovingDetails}
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6} lg={6}>
              <Grid xs={12} md={12} lg={12} item>
                <Stack divider={<Divider orientation="horizontal" flexItem />} spacing={1}>
                  {userdata.map((detail,index) => 
                    <Alert variant="filled" key={index} severity={detail.type}>{detail.text}</Alert>
                  )}
                </Stack>
              </Grid>
              {(verifDetails.length > 0) &&
                  <Grid xs={12} md={12} lg={12} item>
                            <Box sx={{ width: '100%', typography: 'body1' }}>
                              <TabContext value={tabValue}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                  <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                    <Tab label="Veriff details" value="1" />
                                    <Tab label="Verif history" value="2" />
                                  </TabList>
                                </Box>
                                <TabPanel value="1">
                                  <TableContainer component={Paper}>
                                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                      <TableHead>
                                        <TableRow>
                                          <TableCell>Veriff</TableCell>
                                          <TableCell>Street</TableCell>
                                          <TableCell align="right">City</TableCell>
                                          <TableCell align="right">Country</TableCell>
                                          <TableCell align="right">Raw&nbsp;Address</TableCell>
                                        </TableRow>
                                      </TableHead>
                                      <TableBody>
                                        {verifDetails.map((row) => (
                                          <TableRow
                                            key={row.name}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                          >
                                            <TableCell component="th" scope="row">
                                              {row.protein}
                                            </TableCell>
                                            <TableCell component="th" scope="row">
                                              {row.name}
                                            </TableCell>
                                            <TableCell align="right">{row.calories}</TableCell>
                                            <TableCell align="right">{row.fat}</TableCell>
                                            <TableCell align="right">{row.carbs}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </TableContainer>
                                </TabPanel>
                                <TabPanel value="2">
                                  <TableContainer component={Paper}>
                                      <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>First name</TableCell>
                                            <TableCell align="right">Last name</TableCell>
                                            <TableCell align="right">Status</TableCell>
                                            <TableCell align="right">Created at</TableCell>
                                            <TableCell align="right">Updated at</TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          {verifHistory.map((row) => (
                                            <TableRow
                                              key={row.protein}
                                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                              <TableCell component="th" scope="row">
                                                {row.name}
                                              </TableCell>
                                              <TableCell align="right">{row.calories}</TableCell>
                                              <TableCell align="right">{row.fat}</TableCell>
                                              <TableCell align="right">{(new Date(row.carbs)).toLocaleString()}</TableCell>
                                              <TableCell align="right">{(new Date(row.protein)).toLocaleString()}</TableCell>
                                            </TableRow>
                                          ))}
                                        </TableBody>
                                      </Table>
                                    </TableContainer>
                                </TabPanel>
                              </TabContext>
                            </Box>
                    
                  </Grid>
              }
              {(usersLastClaimedCodesToShow.length > 0) &&
              <Grid xs={12} md={12} lg={12} item>
              <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Typography>User last {latestClaimedCodesLimitToShow} claimed codes</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Code</TableCell>
                              <TableCell align="right">Status</TableCell>
                              <TableCell align="right">Created at</TableCell>
                              <TableCell align="right">Claimed at</TableCell>
                              <TableCell align="right">Auth by</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {usersLastClaimedCodesToShow.map((row) => (
                              <TableRow
                                key={row.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.name}
                                </TableCell>
                                <TableCell align="right">{row.calories}</TableCell>
                                <TableCell align="right">{(new Date(row.fat)).toLocaleString()}</TableCell>
                                <TableCell align="right">{(new Date(row.carbs)).toLocaleString()}</TableCell>
                                <TableCell align="right">{row.protein}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              }
              {(userdata.length > 1) &&
                <Grid container spacing={2}>
                  <Grid item xs={6} md={6}>
                    <TextField
                      id="outlined-number"
                      label="Claimed code search"
                      type="number"
                      focused 
                      value={postcardCodeSearchClaimed?.code||''}
                      onChange={(e) => {
                        setpostcardCodeSearchClaimed({code:e.target.value});
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
                  <Grid item xs={6} md={6}>
                      <TextField
                          id="outlined-number"
                          label="Unclaimed code search"
                          type="number"
                          focused 
                          value={postcardCodeSearchUnClaimed?.code||''}
                          onChange={(e) => {
                            setpostcardCodeSearchUnClaimed({code:e.target.value});
                          }}
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <MarkunreadOutlined />
                              </InputAdornment>
                            ),
                          }}
                        />
                  </Grid>
                  <Grid item xs={6} md={6}>
                  {(postcardCodeSearchClaimedRes.length > 0) ?
                    <List dense={true}> 
                        <ListItem>
                            <ListItemIcon>
                              <MoreTime />
                            </ListItemIcon>
                            <ListItemText
                              sx={{ m: 0 }}
                              primary={'Code: '+postcardCodeSearchClaimedRes[0].code}
                              secondary={'Created at: '+(new Date(postcardCodeSearchClaimedRes[0].createdAt)).toLocaleString()}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                              <EventAvailable />
                            </ListItemIcon>
                            <ListItemText
                                primary={'Claimed at: '+(new Date(postcardCodeSearchClaimedRes[0].claimedAt)).toLocaleString()}
                                secondary={'Status: '+postcardCodeSearchClaimedRes[0].status}
                              />
                        </ListItem>
                        <ListItem>
                            <ListItemIcon>
                              <Person />
                            </ListItemIcon>
                            <ListItemText
                                primary={'Auth by: '+postcardCodeSearchClaimedRes[0].authId.name}
                              />
                        </ListItem>
                        
                    </List>
                    :<>
                    {(postcardCodeSearchClaimed?.code?.length > 0) &&
                          <Alert severity="warning">Not found!</Alert>
                    }</>
                  }
                  </Grid>
                  <Grid item xs={6} md={6}>
                  {(postcardCodeSearchUnClaimedRes.length > 0) ?
                      <List dense={true}> 
                          <ListItem>
                              <ListItemIcon>
                                <MoreTime />
                              </ListItemIcon>
                              <ListItemText
                                sx={{ m: 0 }}
                                primary={'Code: '+postcardCodeSearchUnClaimedRes[0].code}
                                secondary={'Created at: '+(new Date(postcardCodeSearchUnClaimedRes[0].createdAt)).toLocaleString()}
                              />
                          </ListItem>
                          <ListItem>
                              <ListItemIcon>
                                <MailLock />
                              </ListItemIcon>
                              <ListItemText
                                  primary={'Status: '+postcardCodeSearchUnClaimedRes[0].status}
                                />
                          </ListItem>
                      </List>
                      :<>
                      {(postcardCodeSearchUnClaimed?.code?.length > 0) &&
                            <Alert severity="warning">Not found!</Alert>
                      }</>
                  }
                  </Grid>
                </Grid>
              }
            </Grid>
            <Grid xs={12} md={6} lg={6} item>
              <Box
                sx={{
                  maxHeight: { xs: 400, md: 600 },
                  height: { xs: 400, md: 600 },
                  maxWidth: { xs: 1, md: 1 },
                }}
              >
                <iframe id='postcardIframe' title='Postcard hosting' src={`${process.env.REACT_APP_LOCAL_IMAGE_BASE_URL}/envelops/?imageName=mail-${postcardid}-front.jpg`} style={{
                  height:"100%",
                  width: "100%",
                }} />
              </Box>
            </Grid>
          </Grid>
        </LocalizationProvider>
    </div>
  )
}

export default PostcardCode;
