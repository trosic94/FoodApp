import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthService from '../../components/services/auth.service'
import {useNavigate,Link as RouterLink,useSearchParams} from "react-router-dom";
import {validateJWT} from '../../helpers'
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google';
import Logo from '../../components/logo';
import jwtDecode from 'jwt-decode'

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mebit.io/">
        Mebit
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const theme = createTheme({palette: {
    mode: "light"
  }});



export default function SignIn() {

  const navigate = useNavigate();
  React.useEffect(() => {
      if(validateJWT()) navigate("/");  
  });
  const [searchParams] = useSearchParams();
  React.useEffect(() => {
    let message = searchParams.get("message");
    if(message) handleOpenSuccess(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const handleOpen = (message) => {
    setMessage(message);
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [messageSuccess, setMessageSuccess] = React.useState('');
  const handleOpenSuccess = (message) => {
    setMessageSuccess(message);
    setOpenSuccess(true);
  };
  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
    const logInData = await AuthService.login(data.get('email'),data.get('password'));
    if(validateJWT()) navigate("/");
    axios.defaults.headers.common["x-access-token"] = logInData.accessToken;
    
    } catch (err) {
      handleOpen(err.response.data.message);
    }

  };
 


  return (
    <ThemeProvider theme={theme}>
    <Grid container component="main" sx={{ height: '100%' }}>
      <CssBaseline />
        <Box
          sx={{
            my: 8,
            mx: 4,
            width:'100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',           
            justifyContent:'center',
          }}
        >
          <Logo/>
          
          <Box component="form" noValidate sx={{ mt: 5,width:'100%',display: 'flex',alignItems:'center',flexDirection: 'column' }}>
          <Typography component="h1" variant="h5" sx={{mb:5}}>
            Foody
          </Typography>
          <GoogleLogin
            theme="filled_blue"
            shape="circle"
            onSuccess={async credentialResponse => {
              // console.log(credentialResponse);
              if (credentialResponse.credential != null) {
                const USER_CREDENTIAL = jwtDecode(credentialResponse.credential);
                let serverResponse = await AuthService.login(credentialResponse.credential)
                if(validateJWT()) navigate("/");
                axios.defaults.headers.common["x-access-token"] = serverResponse.accessToken;
               }
            }}
            onError={() => {
              console.log('Login Failed');
            }}
          />
            <Snackbar anchorOrigin={{vertical: "bottom",horizontal: "right"}} open={open} autoHideDuration={6000} onClose={handleClose}>
              <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
                {message}
              </Alert>
            </Snackbar>
            <Snackbar anchorOrigin={{vertical: "bottom",horizontal: "right"}} open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
              <Alert onClose={handleCloseSuccess} severity="info" sx={{ width: '100%' }}>
                {messageSuccess}
              </Alert>
            </Snackbar>
          </Box>
        </Box>
    </Grid>
  </ThemeProvider>
  );
}