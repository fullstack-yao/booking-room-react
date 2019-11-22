import React, { useState } from 'react';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Fab from "@material-ui/core/Fab";
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { DEFAULT_BOOKING_MINUTES, MIN_MINS } from '../config';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: '#00FF00',
    height: 300
  },
  actions: {
    marginTop: 50,
    padding: theme.spacing(1),
  },
}));

const PrettoSlider = withStyles({
  root: {
    color: '#6200EE',
    height: 8,
    marginTop: 30
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#6200EE',
    border: '5px solid currentColor',
    marginTop: -8,
    marginLeft: -18,
    '&:focus,&:hover,&$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 12,
    borderRadius: 6,
  },
  rail: {
    height: 12,
    borderRadius: 6,
  },
})(Slider);

export default function Booking(props) {
  const { closeModal, maxMins, insertEvent } = props;
  const classes = useStyles();
  const titleStyles = theme => ({
    root: {
      margin: theme.spacing(2),
      padding: theme.spacing(2),
    },
    closeButton: {
      position: 'absolute',
      right: theme.spacing(1),
      top: theme.spacing(1),
      color: theme.palette.grey[500],
    },
  });

  const [ bookingMins, setBookingMins ] = useState(0);

  const DialogTitle = withStyles(titleStyles)(props => {
    const { children, classes, onClose, ...other } = props;
    return (
      <MuiDialogTitle disableTypography className={classes.root} {...other}>
        <Typography variant="h6">{children}</Typography>
        {onClose ? (
          <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
            <CloseIcon />
          </IconButton>
        ) : null}
      </MuiDialogTitle>
    );
  });

  const handleChange = (event, value) => {
    setBookingMins(value);
  };

  const handleConfirm = () => {
    insertEvent(bookingMins);
  };

  return (
    <Dialog open={true} disableBackdropClick={true} maxWidth='sm' fullWidth={true}>
      <Paper className={classes.root}>
        <DialogTitle onClose={closeModal} >
        </DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Minutes</Typography>
          <PrettoSlider valueLabelDisplay="on" aria-label="pretto slider" defaultValue={DEFAULT_BOOKING_MINUTES}
          max={maxMins} min={MIN_MINS} onChange={(event, value) => handleChange(event, value)} />
        </DialogContent>
        <DialogActions className={classes.actions}>
          <Fab variant="extended" color="primary" aria-label="add" onClick={handleConfirm}>
            Comfirm
          </Fab>
        </DialogActions>
      </Paper>
    </Dialog>
  )
}
