
import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CheckIcon from '@mui/icons-material/Check';
import { styled } from "@mui/material/styles";


const CardContentNoPadding = styled(CardContent)(`
  padding: 8px;
  &:last-child {
    padding-bottom: 8px;
  }
`);

export default function FoodItem(props) {
  return (
    <Card sx={{ maxWidth: 250,minWidth:200 }}>
      <CardMedia
        sx={{ height: 170,transform: 'rotate(10deg) translate(-15px, -30px)',borderRadius: 3  }}
        image='/logo.jpg'
        title="green iguana"
      />
      <CardContentNoPadding >
        <Typography gutterBottom variant="h5" component="div">
          Fish
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Fish&Sweet
        </Typography>
      </CardContentNoPadding>
      <CardActions>
        <Button variant="contained" endIcon={<CheckIcon />}>
            Make choice
        </Button>
      </CardActions>
    </Card>
  )
}
