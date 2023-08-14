import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {useNavigate,Link as RouterLink,useSearchParams} from "react-router-dom";
import AuthService from '../../components/services/auth.service'
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import {Dialog ,DialogActions,DialogContent,DialogContentText ,DialogTitle } from '@mui/material';

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
    mode: "dark",
  }});

  const divStyle = {
    width: '100%',
    height: '100vh',
    backgroundImage: `url(/casino.jpg)`,
    backgroundSize: 'cover',
    marginTop:'-65px'
  };
export default function SignUp() {
    const [openDialogConfirmEmail, setOpenDialogConfirmEmail] = React.useState(false);

    const handleClickOpenDialogConfirmEmail = () => {
        setOpenDialogConfirmEmail(true);
    };
  
    const handleCloseDialogConfirmEmail = () => {
        setOpenDialogConfirmEmail(false);
    };

    const redirectToLoginPage = () => {
        navigate('/login');
    };

    const [open, setOpen] = React.useState(false);
    const [message, setMessage] = React.useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
        await AuthService.setNewPassword(data.get('password'),searchParams.get("token"));
        handleClickOpenDialogConfirmEmail();
        
        } catch (err) {
          handleOpen(err.response.data.message);
        }
  };

  return (
    <ThemeProvider theme={theme}>
        <div className="cComponent" style={divStyle}  >
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <img alt='Mebit' src={`/mebit_large.jpg`} />
          </Avatar>
          <Typography component="h1" variant="h5">
            Enter new account password 
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3,width:'100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Confirm
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" >
                  Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
        <Snackbar anchorOrigin={{vertical: "bottom",horizontal: "right"}} open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {message}
            </Alert>
        </Snackbar>
      </div>
            <Dialog
                open={openDialogConfirmEmail}
                onClose={handleCloseDialogConfirmEmail}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                {"Password is changed successfully!"}
                </DialogTitle>
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    You can login with new password.
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={redirectToLoginPage}>Login</Button>
                </DialogActions>
            </Dialog>
    </ThemeProvider>
  );
}