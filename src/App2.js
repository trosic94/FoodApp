import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./app.css"
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Routes, Route,Outlet } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import ChatLog from "./pages/chat/ChatLog";
import UserChatAnalytics from "./pages/userChatAnalytics/UserChatAnalytics";
import PromotionsWinners from "./pages/forum/promotions/PromotionsWinners";
import Permissions from "./pages/administration/Permissions";
import PostcardCode from "./pages/postcard/PostcardCode";
import KycBulkReject from "./pages/kycBulkReject/KycBulkReject";
import { useState,useEffect } from "react";
import MyImage from './images/crossedphone.png';
import RouteGuard from "./components/RouteGuard"
import PageNotFound from "./components/PageNotFound"
import LogIn from './components/authentication/LogIn'
import SignUp from './components/authentication/SignUp'
import Resend from './components/authentication/Resend'
import PasswordReset from './pages/passwordReset/PasswordReset'
import NewPassword from './pages/passwordReset/NewPassword'
import { NotificationProvider } from './context/notificationContext';
import NotificationBar from './components/notification';
import ThemeProvider from './theme';
import DashboardLayout from './layouts/dashboard';
import {CssBaseline,} from "@mui/material";
import { GoogleOAuthProvider } from '@react-oauth/google';


function App() {
  
  const [open, setOpen] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
      setWidth(window.innerWidth);
  }
  useEffect(() => {
    handleWindowSizeChange()
  }, [])
  const isMobile = width <= 768;
  document.title = "Foody 1.0";
  const ParentLayout = () => (
    <>
      <Topbar stateChanger={setOpen}/>
        <div className="container">
        <Sidebar statusMobileMenu={open} isMobile={isMobile} stateChanger={setOpen}/>
          <Outlet />
        </div>
    </>
  );

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_OAUTH_CLIENT_ID}>
      <HelmetProvider>
        <ThemeProvider>
          <NotificationProvider>
            <NotificationBar />
            <CssBaseline />
            <Router>
              <Routes>
                      <Route element={<RouteGuard redirectTo="/login"><DashboardLayout /></RouteGuard>}>
                        <Route path="/" element={<RouteGuard redirectTo="/login"><Home /></RouteGuard>} />
                        <Route path="/forum_promotions" element={<RouteGuard redirectTo="/login"><PromotionsWinners /></RouteGuard>} />
                        <Route path="/chat" element={<RouteGuard redirectTo="/login"><ChatLog /></RouteGuard>} />
                        <Route path="/userchatanalytics" element={<RouteGuard redirectTo="/login"><UserChatAnalytics /></RouteGuard>} />
                        <Route path="/permissions" element={<RouteGuard redirectTo="/login"><Permissions /></RouteGuard>} />
                        <Route path="/postcard" element={<RouteGuard redirectTo="/login"><PostcardCode /></RouteGuard>} />
                        <Route path="/kycbulkreject" element={<RouteGuard redirectTo="/login"><KycBulkReject /></RouteGuard>} />
                      </Route>
                      <Route path="/login" element={<LogIn/>} />
                      <Route path="*" element={<PageNotFound />} />
                    </Routes>
            </Router>
          </NotificationProvider>
        </ThemeProvider>
      </HelmetProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
