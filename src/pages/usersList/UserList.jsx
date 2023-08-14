import "./userList.css"
import { DataGrid,GridToolbar  } from '@mui/x-data-grid';
import { useQuery } from 'urql';
import { Typography } from '@mui/material';
import React,{useEffect} from 'react';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import { lightBlue } from "@mui/material/colors";

const FILMS_QUERY = `
query MyQuery{
    chat(chatId :"f0326994-ee9e-411c-8439-b4997c187b95"){
      id,
      messageInterval,
      name,
      rank,
      updatedAt,
      messageList{
        id
        data{
          ... on ChatMessageDataText {
            message
          }
        },
        createdAt,
        user{
          name,
          email
        }
      }
    }
  }
`;

function isOverflown(element) {
    return (
      element.scrollHeight > element.clientHeight ||
      element.scrollWidth > element.clientWidth
    );
  }
  
  const GridCellExpand = React.memo(function GridCellExpand(props) {
    const { width, value } = props;
    const wrapper = React.useRef(null);
    const cellDiv = React.useRef(null);
    const cellValue = React.useRef(null);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [showFullCell, setShowFullCell] = React.useState(false);
    const [showPopper, setShowPopper] = React.useState(false);
  
    const handleMouseEnter = () => {
      const isCurrentlyOverflown = isOverflown(cellValue.current);
      setShowPopper(isCurrentlyOverflown);
      setAnchorEl(cellDiv.current);
      setShowFullCell(true);
    };
  
    const handleMouseLeave = () => {
      setShowFullCell(false);
    };
  
    React.useEffect(() => {
      if (!showFullCell) {
        return undefined;
      }
  
      function handleKeyDown(nativeEvent) {
        // IE11, Edge (prior to using Bink?) use 'Esc'
        if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
          setShowFullCell(false);
        }
      }
  
      document.addEventListener('keydown', handleKeyDown);
  
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }, [setShowFullCell, showFullCell]);
  
    return (
      <Box
        ref={wrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{
          alignItems: 'center',
          lineHeight: '24px',
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
        }}
      >
        <Box
          ref={cellDiv}
          sx={{
            height: '100%',
            width,
            display: 'block',
            position: 'absolute',
            top: 0,
          }}
        />
        <Box
          ref={cellValue}
          sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {value}
        </Box>
        {showPopper && (
          <Popper
            open={showFullCell && anchorEl !== null}
            anchorEl={anchorEl}
            style={{ width, marginLeft: -17 }}
          >
            <Paper
              elevation={1}
              style={{ minHeight: wrapper.current.offsetHeight - 3 }}
            >
              <Typography variant="body2" style={{ padding: 8 }}>
                {value}
              </Typography>
            </Paper>
          </Popper>
        )}
      </Box>
    );
  });
  
  GridCellExpand.propTypes = {
    value: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
  };
  
  function renderCellExpand(params) {
    return (
      <GridCellExpand value={params.value || ''} width={params.colDef.computedWidth} />
    );
  }
  
  renderCellExpand.propTypes = {
    /**
     * The column of the row that the current cell belongs to.
     */
    colDef: PropTypes.object.isRequired,
    /**
     * The cell value.
     * If the column has `valueGetter`, use `params.row` to directly access the fields.
     */
    value: PropTypes.string,
  };


const UserList = () => {
    useEffect(() => {
        document.title = 'All bets overview';
      });
    const [result] = useQuery({
        query: FILMS_QUERY,
      });
      if (result.fetching) {
        return 'Loading...'
      } else if (result.error) {
        return 'There was an error :('
      }
      
      const rows1 = result.data.chat.messageList.map((item, index) =>(
        {
            id : item.id,
            message: item.data.message,
            user: item.user.name,
            createdat: item.createdAt,
            // serial: item.serial,
        }
        ));
 
    const columns = [
    { field: 'id', 
    headerName: 'ID', 
    flex : 2,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    renderCell: renderCellExpand
    },
    { field: 'message', 
    headerName: 'MESSAGE', 
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    flex : 4,
    renderCell: renderCellExpand
    },
    { field: 'user', 
    headerName: 'USER', 
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    flex : 1,
    renderCell: renderCellExpand
    },
    { field: 'createdat', 
    headerName: 'CREATED AT', 
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    flex : 1,
    renderCell: renderCellExpand
    },
    ];
  return (
    <div className="userList" style={{ height: 800, width: '100%',margin:5 }}>
        <DataGrid  
            rows={rows1} 
            columns={columns} 
            getRowId={row => row.id}
            components={{ Toolbar: GridToolbar }}
            componentsProps={{
                toolbar: {
                  showQuickFilter: true,
                  quickFilterProps: { debounceMs: 500 },
                },
              }}
            sx={{
                height: 800,
                width: '100%',
                '& .super-app-theme--header': {
                    backgroundColor: lightBlue[50],
                    fontSize: 20,
                    fontWeight:700
                },
            }}
        />
    </div>
  )
}

export default UserList;
