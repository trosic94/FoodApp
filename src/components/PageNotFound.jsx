import React from 'react';
import { Box, Button, Container, Typography } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useNavigate } from 'react-router-dom';

function PageNotFound() {
  const navigate = useNavigate();
    return (
        <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          minWidth:'100%',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        <Container maxWidth="md">
          <Grid container spacing={2}>
            <Grid xs={6} item={true}>
              <Typography variant="h1">
                404
              </Typography>
              <Typography variant="h6">
                The page you’re looking for doesn’t exist.
              </Typography>
              <Button onClick={() => navigate('/')} variant="contained">Back Home</Button>
            </Grid>
            <Grid xs={6} item={true}>
              <img
                src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
                alt=""
                width={500} height={250}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  export default PageNotFound;