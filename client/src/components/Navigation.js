import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Home as HomeIcon, Mail as MailIcon, Message as MessageIcon, Share as ShareIcon, AccountBox as AccountBoxIcon, MenuBook as MenuBookIcon } from '@material-ui/icons';

const drawerWidth = 180
const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
    height: '100vh',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    height: '20%',
    marginBottom: '40px'

  },
  listItemText: {
    marginTop: theme.spacing(1),
    textAlign: 'center',
    marginRight: '35px',
  },
}));

const Navigation = () => {
  const classes = useStyles();

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.drawerContainer} style={{marginTop: '15px'}}>
        <List>
          <ListItem button component={Link} to="/home" className={classes.listItem}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" className={classes.listItemText} />
          </ListItem>
          <ListItem button component={Link} to="/mail" className={classes.listItem}>
            <ListItemIcon>
              <MailIcon />
            </ListItemIcon>
            <ListItemText primary="Mail" className={classes.listItemText} />
          </ListItem>
          <ListItem button component={Link} to="/sms" className={classes.listItem}>
            <ListItemIcon>
              <MessageIcon />
            </ListItemIcon>
            <ListItemText primary="SMS Text" className={classes.listItemText} />
          </ListItem>
          <ListItem button component={Link} to="/social-media" className={classes.listItem}>
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText primary="Social Media" className={classes.listItemText} />
          </ListItem>
          <ListItem button component={Link} to="/menu" className={classes.listItem}>
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText primary="Menu" className={classes.listItemText} />
          </ListItem>
          <ListItem button component={Link} to="/account" className={classes.listItem}>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary="Account" className={classes.listItemText} />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Navigation;
