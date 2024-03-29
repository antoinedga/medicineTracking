import React from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux'
import SettingsIcon from '@material-ui/icons/Settings';
import Tooltip from '@material-ui/core/Tooltip';
import { Typography } from '@material-ui/core';

const loginAction = require('../../../../store/actions/login.action')

const useStyles = makeStyles((theme) => ({
    userBtn: {
        color: 'white',
    },
    paper: {
        marginRight: theme.spacing(2),
    },
}));

export default function SimpleMenu(props) {
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const classes = useStyles();
    const dispatch = useDispatch();
    const name = useSelector(state => state.login.name)
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    const handleLogOut = () => {
        loginAction.logoutPayload(dispatch)
    }

    return (
        <div>
            <div style={{ width: "7rem", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap", display: "inline", align: "right" }}>
                {name}
            </div>
            <Tooltip title="Settings" arrow placement="left-start">
                <Button
                    ref={anchorRef}
                    aria-controls={open ? 'menu-list-grow' : undefined}
                    aria-haspopup="true"
                    onClick={handleToggle}
                    className={classes.userBtn}
                >
                    <SettingsIcon />
                </Button>
            </Tooltip>
            <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                    <MenuItem onClick={handleLogOut}>Logout</MenuItem>
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
        </div >
    );
}