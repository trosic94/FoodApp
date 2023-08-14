import "./sidebar.css"
import {Timeline,Home,CurrencyBitcoin,TrendingUp,ChatBubbleOutlineOutlined,SellOutlined,QueryStats,AddModeratorOutlined,MailOutline,GroupRemoveOutlined} from "@mui/icons-material"
import { Link } from "react-router-dom";
import {Button} from "@mui/material";
import { useState } from "react";
import {validateJWT} from '../../helpers'


export default function Sidebar(props) {
    const [activeMenu, setActiveMenu] = useState();
    const [activeSide, setActiveSide] = useState();
    const handleClick= () => {
        props.stateChanger(activeSide);
        setActiveSide(!activeSide);
    }
    if(!validateJWT()) return null;
    if (!props.isMobile){
            return (
                <div className="sidebar">
                    <div className="sidebarWrapper">
                            <ul className="sidebarList">
                                <li id="home"
                                    className={activeMenu === 'home' ? 'active sidebarListItem' : 'sidebarListItem'}
                                    >
                                        <Home className="sidebarIcon"/>
                                        <Button component={Link} to="/" onClick={() => { setActiveMenu('home') }}>
                                            Home
                                        </Button>
                                </li>
                            </ul>
                        <div className="sidebarMenu">
                            <h3 className="sidebarTitle">Customer support</h3>
                            <ul className="sidebarList">
                                {/* <li id="home"
                                className={activeMenu == 'home' ? 'active sidebarListItem' : 'sidebarListItem'}
                                >
                                    <Home className="sidebarIcon"/>
                                    <Button component={Link} to="/" onClick={() => { setActiveMenu('home') }}>
                                        Home
                                    </Button>
                                </li> */}
                                <li id="chat"
                                className={activeMenu === 'chat' ? 'active sidebarListItem' : 'sidebarListItem'}
                                >
                                    <ChatBubbleOutlineOutlined className="sidebarIcon"/>
                                    <Button component={Link} to="/chat" onClick={() => { setActiveMenu('chat') }}>
                                        chat log
                                    </Button>
                                    
                                </li>
                                <li id="userChatAnalytics"
                                className={activeMenu === 'userChatAnalytics' ? 'active sidebarListItem' : 'sidebarListItem'}
                                >
                                    <QueryStats className="sidebarIcon"/>
                                    <Button component={Link} to="/userchatanalytics" onClick={() => { setActiveMenu('userChatAnalytics') }}>
                                        user chat analytics
                                    </Button>
                                    
                                </li>
                                {/* <li className="sidebarListItem">
                                    <Timeline className="sidebarIcon"/>
                                    Analytics
                                </li>
                                <li className="sidebarListItem">
                                    <TrendingUp className="sidebarIcon"/>
                                    Sales
                                </li> */}
                            </ul>
                        </div>
                        <div className="sidebarMenu">
                            <h3 className="sidebarTitle">Forum</h3>
                            <ul className="sidebarList">
                                <li id="forum_promotions"
                                    className={activeMenu === 'forum_promotions' ? 'active sidebarListItem' : 'sidebarListItem'}
                                    >
                                        <SellOutlined className="sidebarIcon"/>
                                        <Button component={Link} to="/forum_promotions" onClick={() => { setActiveMenu('forum_promotions') }}>
                                            promotions
                                        </Button>
                                </li>
                            </ul>
                        </div>
                        <div className="sidebarMenu">
                            <h3 className="sidebarTitle">KYC</h3>
                            <ul className="sidebarList">
                                <li id="postcard"
                                    className={activeMenu === 'postcard' ? 'active sidebarListItem' : 'sidebarListItem'}
                                    >
                                        <MailOutline className="sidebarIcon"/>
                                        <Button component={Link} to="/postcard" onClick={() => { setActiveMenu('postcard') }}>
                                            postcard code
                                        </Button>
                                </li>
                                <li id="kycbulkreject"
                                    className={activeMenu === 'kycbulkreject' ? 'active sidebarListItem' : 'sidebarListItem'}
                                    >
                                        <GroupRemoveOutlined className="sidebarIcon"/>
                                        <Button component={Link} to="/kycbulkreject" onClick={() => { setActiveMenu('kycbulkreject') }}>
                                            bulk reject - Level 1
                                        </Button>
                                </li>
                            </ul>
                        </div>
                        <div className="sidebarMenu">
                            <h3 className="sidebarTitle">Administration</h3>
                            <ul className="sidebarList">
                                <li id="permissions"
                                    className={activeMenu === 'permissions' ? 'active sidebarListItem' : 'sidebarListItem'}
                                    >
                                        <AddModeratorOutlined className="sidebarIcon"/>
                                        <Button component={Link} to="/permissions" onClick={() => { setActiveMenu('permissions') }}>
                                            permissions
                                        </Button>
                                </li>
                            </ul>
                        </div>
                        {/* <div className="sidebarMenu">
                            <h3 className="sidebarTitle">Notifications</h3>
                            <ul className="sidebarList">
                                <li className="sidebarListItem ">
                                    <Mail className="sidebarIcon"/>
                                    Mail
                                </li>
                                <li className="sidebarListItem">
                                    <DynamicFeed className="sidebarIcon"/>
                                    Feedback
                                </li>
                                <li className="sidebarListItem">
                                    <ChatBubbleOutline className="sidebarIcon"/>
                                    Messages
                                </li>
                            </ul>
                        </div>
                        <div className="sidebarMenu">
                            <h3 className="sidebarTitle">Staf</h3>
                            <ul className="sidebarList">
                                <li className="sidebarListItem">
                                    <WorkOutline className="sidebarIcon"/>
                                    Manage
                                </li>
                                <li className="sidebarListItem">
                                    <TrendingUp className="sidebarIcon"/>
                                    Analytics
                                </li>
                                <li className="sidebarListItem">
                                    <Report className="sidebarIcon"/>
                                    Reports
                                </li>
                            </ul>
                        </div> */}
                    </div>
                </div>  
            )
        }else if (props.statusMobileMenu){
            return (
            <div className="menu">
            <button className="cancel-button" onClick={handleClick}>✕</button>
                            <ul className="sidebarList">
                                <li id="home"
                                className={activeMenu === 'home' ? 'active sidebarListItem' : 'sidebarListItem'}
                                onClick={() => { setActiveMenu('home') }}
                                >
                                    <Home className="sidebarIcon"/>
                                    <Button component={Link} to="/">
                                        Home
                                    </Button>
                                </li>
                                <li id="bets"
                                className={activeMenu === 'bets' ? 'active sidebarListItem' : 'sidebarListItem'}
                                onClick={() => { setActiveMenu('bets') }}
                                >
                                    <CurrencyBitcoin className="sidebarIcon"/>
                                    <Button component={Link} to="/bets">
                                        bets
                                    </Button>
                                    
                                </li>
                                <li className="sidebarListItem">
                                    <Timeline className="sidebarIcon"/>
                                    Analytics
                                </li>
                                <li className="sidebarListItem">
                                    <TrendingUp className="sidebarIcon"/>
                                    Sales
                                </li>
                            </ul>
          </div>
            )
        }
}
