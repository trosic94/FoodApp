import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText, ListItemButton } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
// ----------------------------------------------------------------------
import * as React from 'react';

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };

  const buttons = [
    <ListItemButton
          selected={selectedIndex === 0}
          onClick={(event) => handleListItemClick(event, 0)}
          key={0}
        >
          <ListItemText primary="11.08.2023." />
    </ListItemButton>,
    <ListItemButton
          selected={selectedIndex === 1}
          onClick={(event) => handleListItemClick(event, 1)}
          key={1}
        >
          <ListItemText primary="12.08.2023." />
    </ListItemButton>,
    <ListItemButton
        selected={selectedIndex === 2}
        onClick={(event) => handleListItemClick(event, 2)}
        key={2}
        >
        <ListItemText primary="13.08.2023." />
    </ListItemButton>,
  ];
  return (
    <Box {...other} >
          <List component="nav" aria-label="main mailbox folders">
            {buttons}
          </List>
      {/* <List disablePadding sx={{ p: 1 }}>
        {data.map((item) => (
          <NavItem key={item.title} item={item} />
        ))}
      </List> */}
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};




function NavItem({ item }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
      component={RouterLink}
      to={path}
      sx={{
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon>

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
