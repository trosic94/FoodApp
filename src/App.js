import Sidebar from "./components/sidebar/Sidebar";
import Topbar from "./components/topbar/Topbar";
import "./app.css"
import Home from "./pages/home/Home";
import { BrowserRouter as Router, Routes, Route,Outlet } from "react-router-dom";
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
import {CssBaseline,} from "@mui/material";

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
  document.title = "DSS v"+process.env.REACT_APP_VERSION;
  const ParentLayout = () => (
    <>
      <Topbar stateChanger={setOpen}/>
        <div className="container">
        <Sidebar statusMobileMenu={open} isMobile={isMobile} stateChanger={setOpen}/>
          <Outlet />
        </div>
    </>
  );

  if (!isMobile){
  return (
    <ThemeProvider>
      <NotificationProvider>
        <NotificationBar />
        <CssBaseline />
        <Router>
          <Routes>
                  <Route element={<ParentLayout />}>
                    <Route path="/" element={<RouteGuard redirectTo="/login"><Home /></RouteGuard>} />
                    <Route path="/forum_promotions" element={<RouteGuard redirectTo="/login"><PromotionsWinners /></RouteGuard>} />
                    <Route path="/chat" element={<RouteGuard redirectTo="/login"><ChatLog /></RouteGuard>} />
                    <Route path="/userchatanalytics" element={<RouteGuard redirectTo="/login"><UserChatAnalytics /></RouteGuard>} />
                    <Route path="/permissions" element={<RouteGuard redirectTo="/login"><Permissions /></RouteGuard>} />
                    <Route path="/postcard" element={<RouteGuard redirectTo="/login"><PostcardCode /></RouteGuard>} />
                    <Route path="/kycbulkreject" element={<RouteGuard redirectTo="/login"><KycBulkReject /></RouteGuard>} />
                  </Route>
                  <Route path="/login" element={<LogIn/>} />
                  <Route path="/signup" element={<SignUp/>} />
                  <Route path="/resend" element={<Resend/>} />
                  <Route path="/reset" element={<PasswordReset/>} />
                  <Route path="/enternewpassword" element={<NewPassword/>} />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
        </Router>
      </NotificationProvider>
    </ThemeProvider>
  );
  }else{
    return (
      <img src={MyImage} alt="crossedphone" style={{display:'flex',height:'100vh',width:'100vw',alignItems:'center',justifyContent:'center',maxHeight:'250px',maxWidth:'250px'}}/>
    )
  }
}

export default App;
