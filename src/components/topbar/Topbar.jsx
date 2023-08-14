import React, { useState } from 'react'
import "./topbar.css"
import {Settings} from '@mui/icons-material';
import {validateJWT} from '../../helpers'
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AuthService from '../../components/services/auth.service'
import {useNavigate} from "react-router-dom";
import Avatar from '@mui/material/Avatar';

export default function Topbar ({stateChanger}) {
    const [activeMenu, setActiveMenu] = useState(true);
    const navigate = useNavigate();
    const handleClick= () => {
        stateChanger(activeMenu);
        setActiveMenu(!activeMenu);
    }
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleSettingsClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleSettingsClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        AuthService.logout();
        if(!validateJWT()) navigate("/login");
    }

    if(!validateJWT()) return null;

    return (
        <div className='topbar'>
            <div className="topbarWrapper">
                <div className="topLeft">
                    <h3 className='logo' >&#60;ME<span>BIT/&#62;</span></h3>
                    <button className="hamburger" onClick={handleClick}>
                        {/* icon from heroicons.com */}
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="white"
                        >
                        <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                            clipRule="evenodd"
                        />
                        </svg>
                    </button>
                </div>
                <div className="topRight">
                    {/* <div className="topbarIconContainer">
                        <Language/>
                        <span className="topIconBadge">2</span>
                    </div> */}
                    <div className="topbarIconContainer">
                        <Settings 
                            id="basic-button"
                            aria-controls={open ? 'settings-menu' : undefined}
                            aria-haspopup="true"
                            aria-expanded={open ? 'true' : undefined}
                            onClick={handleSettingsClick}
                        />
                    </div>
                    <Avatar onClick={handleSettingsClick} sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <img alt='Mebit' src={`/mebit_large.jpg`} />
                    </Avatar>
                    {/* <img src={`/mebit_large.jpg`} alt="" className="topAvatar" /> */}
                </div>
                <Menu
                    id="settings-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleSettingsClose}
                    MenuListProps={{
                    'aria-labelledby': 'basic-button',
                    }}
                >
                    {/* <MenuItem onClick={handleSettingsClose}>Profile</MenuItem>
                    <MenuItem onClick={handleSettingsClose}>My account</MenuItem> */}
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </div>
        </div>
    )
} 
