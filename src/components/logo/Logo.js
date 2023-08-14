import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link } from '@mui/material';

import './logo.css'


// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const PRIMARY_LIGHT = theme.palette.primary.light;

  const PRIMARY_MAIN = theme.palette.primary.main;

  const PRIMARY_DARK = theme.palette.primary.dark;

  // OR using local (public folder)
  // -------------------------------------------------------
  // const logo = (
  //   <Box
  //     component="img"
  //     src="/logo/logo_single.svg" => your path
  //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
  //   />
  // );

  const logo = (
    <Box
      ref={ref}
      component="div"
      sx={{
        width: 80,
        height: 80,
        display: 'inline-flex',
        ...sx,
      }}
      {...other}
    >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-10.42 -6.353 290.727 247.211"
        >
          <defs>
            <filter
              id="a"
              width="200%"
              height="200%"
              x="-50%"
              y="-50%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation={6} />
              <feOffset />
              <feComponentTransfer result="offsetblur">
                <feFuncA type="linear" />
              </feComponentTransfer>
              <feFlood floodColor="rgba(0,0,0,0.37)" />
              <feComposite in2="offsetblur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter
              id="b"
              width="200%"
              height="200%"
              x="-50%"
              y="-50%"
              colorInterpolationFilters="sRGB"
            >
              <feGaussianBlur in="SourceAlpha" stdDeviation={6} />
              <feOffset />
              <feComponentTransfer result="offsetblur">
                <feFuncA type="linear" />
              </feComponentTransfer>
              <feFlood floodColor="rgba(0,0,0,0.37)" />
              <feComposite in2="offsetblur" operator="in" />
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            className='path'
            d="M25.426 210.626V25.378l109.591 71.119 109.591-66.258"
            style={{
              fillRule: "nonzero",
              paintOrder: "fill",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none",
              filter: "url(#a)",
              stroke: "#fff",
              strokeWidth: 30,
            }}
          />
          <path
            className='path'
            d="m70.076 210.626-.287-109.724 64.819 37.624 110-57.173v129.273h-110"
            style={{
              fillRule: "nonzero",
              paintOrder: "fill",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              fill: "none",
              filter: "url(#b)",
              stroke: "#00adef",
              strokeWidth: 30,
            }}
          />
        </svg>
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
