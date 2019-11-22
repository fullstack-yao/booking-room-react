import React, { useState, useEffect }from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: '#333333'
  },
  container: {
    backgroundColor: '#333333',
    color: '#FFFFFF',
    boxShadow: 'none',
    margin: 'auto'
  },
  title: {
    flexGrow: 1,
    textAlign: 'right'
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const [ time, setTime ] = useState(moment());

  useEffect(() => {
    let interval = setInterval(() => {
      setTime(moment());
    }, 1000);
    return () => clearInterval(interval);
  }, [time]);

  return (
    <div className={classes.root}>
      <AppBar position="static" className={classes.container}>
        <Toolbar>
          <Link href="/">
            <img src="https://www.oanda.com/assets/images/oanda-logo.20eebbd07880.svg" alt="Oanda logo" />
          </Link>
          <Typography variant="h6" className={classes.title}>
            {time.format('MMMM Do YYYY, h:mm:ss a')}
          </Typography>
          <Typography variant="h6" className={classes.title}>
            Meeting Rooms
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}
