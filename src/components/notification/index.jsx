import React from 'react';
import { useContext } from 'react';
import NotificationContext from '../../context/notificationContext';
import MuiAlert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

const NotificationBar = () => {
  const notificationCtx = useContext(NotificationContext);
return (
    notificationCtx.notification !== null && (
        <Snackbar anchorOrigin={{vertical: "bottom",horizontal: "right"}} open={notificationCtx.openStatus} autoHideDuration={6000} onClose={notificationCtx.clear}>
            <Alert onClose={notificationCtx.clear} severity={notificationCtx.notification} sx={{ width: '100%' }}>
                {notificationCtx.notificationText}
            </Alert>
        </Snackbar>
    )
  );
};
export default NotificationBar;