import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Fab from '@material-ui/core/Fab';
import Booking from './components/Booking';
import ButtonAppBar from './components/Header';
import { API_KEY, CLIENT_ID, DISCOVERY_DOCS, SCOPES,
  CALENDAR_ID, INTERVAL_SECONDS, ROOM_NAME } from './config';
import moment from 'moment';

const useStyles = makeStyles(theme => ({
  container: {
    flexGrow: 1,
    marginTop: 200
  },
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  paper: {
    height: 250,
    width: 200,
    margin: '10px 50px',
    padding: '10px 0px'
  },
  green: {
    backgroundColor: '#00FF00'
  },
  red: {
    backgroundColor: '#FF0000'
  },
  title: {
    textAlign: 'center',
    marginTop: '10%'
  },
  nextEvent: {
    textAlign: 'center',
    marginTop: '20%'
  },
  button: {
    marginTop: '20%'
  }
}));

export default function App() {
  const classes = useStyles();
  const gapi = window.gapi;
  const [ nextEvent, setNextEvent ] = useState(null);
  const [diffMins, setDiffMins] = useState(null);
  const [isAvailable, setIsAvailable] = useState(null);
  const [loadModal, setLoadModal] = useState(false);

  // const updateSigninStatus = (isSignedIn) => {
  //   if (isSignedIn) {
  //     listUpcomingEvents();
  //   }
  // };

  const listUpcomingEvents = useCallback(() => {
    gapi.client.calendar.events.list({
      'calendarId': CALENDAR_ID,
      'timeMin': (new Date()).toISOString(),
      'showDeleted': false,
      'singleEvents': true,
      'maxResults': 10,
      'orderBy': 'startTime'
    }).then(function(response) {
      const events = response.result.items;
      const now = moment();

      if (events.length > 0) {
        setNextEvent(events[0]);
        const startTime = moment(events[0].start.dateTime);
        const endTime = moment(events[0].end.dateTime);
        if (now.toDate() <= startTime.toDate()) {
          setIsAvailable(true);
          setDiffMins(startTime.diff(now, 'minutes'));
        } else {
          setIsAvailable(false);
          setDiffMins(endTime.diff(now, 'minutes'));
        }
      }
    });
  },[gapi]);

  const initClient = useCallback(() => {
    gapi.client.init({
      apiKey: API_KEY,
      clientId: CLIENT_ID,
      discoveryDocs: DISCOVERY_DOCS,
      scope: SCOPES
    }).then(function () {
      // Listen for sign-in state changes.
      // gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

      // // Handle the initial sign-in state.
      // updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      // gapi.auth2.getAuthInstance().signIn();
      listUpcomingEvents();
    }, function(error) {
      // appendPre(JSON.stringify(error, null, 2));
    });
  }, [gapi, listUpcomingEvents]);

  const openModal = () => {
    setLoadModal(true);
  };

  const closeModal = () => {
    setLoadModal(false);
  };

  const insertEvent = (bookingMins) => {
    const resource = {
      "summary": "Meeting",
      "start": {
        "dateTime": moment().toDate()
      },
      "end": {
        "dateTime": moment().add(bookingMins, 'minutes').toDate()
      }
    };
    const request = gapi.client.calendar.events.insert({
      'calendarId': CALENDAR_ID,
      'resource': resource
    });

    request.execute(function(resp) {
      // gapi.auth2.getAuthInstance().signIn();
      if (resp.status === 'confirmed') {
        setLoadModal(false);
        listUpcomingEvents();
      }
    });

  };

  useEffect(() => {
    gapi.load('client:auth2', initClient);
  }, [gapi, initClient]);

  useEffect(() => {
    let interval = setInterval(() => {
      listUpcomingEvents();
    }, INTERVAL_SECONDS * 1000);
    return () => clearInterval(interval);
  }, [listUpcomingEvents]);

  return (
    <div className={classes.root}>
      <ButtonAppBar />
      <Grid container className={classes.container}>
        <Grid item xs={12}>
          <Grid container justify="center">
            {/* {[0, 1].map(value => ( */}
              <Grid item>
                <Paper className={isAvailable ? `${classes.paper} ${classes.green}`
                  : isAvailable === null ? classes.paper : `${classes.paper} ${classes.red}`} >
                  <Typography variant="h5" className={classes.title}>
                    {ROOM_NAME}
                  </Typography>
                  { diffMins &&
                    <Typography variant="h6" className={classes.title}>
                      { isAvailable ? (diffMins + ' Mins') : (diffMins + ' Mins')}
                    </Typography>
                  }
                  { nextEvent &&
                    <Typography className={classes.nextEvent}>
                      {nextEvent.summary}
                    </Typography>
                  }
                  { isAvailable &&
                    <Grid container justify="center" className={classes.button}>
                      <Fab variant="extended" color="primary" aria-label="add" onClick={openModal}>
                        Book
                      </Fab>
                    </Grid>
                  }
                </Paper>
              </Grid>
              {
                loadModal && <Booking closeModal={closeModal} maxMins={diffMins} insertEvent={insertEvent} />
              }
            {/* ))} */}
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
}
