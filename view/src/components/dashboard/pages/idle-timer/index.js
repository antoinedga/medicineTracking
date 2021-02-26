import React, { useEffect, useState } from 'react'
import { useIdleTimer } from 'react-idle-timer'
import { Dialog, DialogContent, Button, DialogTitle, DialogActions, DialogContentText } from '@material-ui/core'
import { Redirect } from 'react-router-dom'

export default function IdleTimerComp(props) {
    // needs to be in mili seconds
    const timeout = 1000 * 60 * (3) // right now 3 minutes for idle and remaining idle, total 6 minutes
    const [redirect, setRedirect] = useState(false)
    const [open, setOpen] = useState(false)
    const [remaining, setRemaining] = useState(timeout)
    const [elapsed, setElapsed] = useState(0)
    const [isTimedOut, setTimedOut] = useState(false)
    const [isIdle, setIsIdle] = useState(false)


    const handleActive = () => {
        console.log(isTimedOut)
        setTimedOut(false)
    }

    const handleOnIdle = () => {
        setIsIdle(true)
        setOpen(true)

        if (isTimedOut) {
            setRedirect(true)
        } else {
            setOpen(true)
            reset();
            setTimedOut(true)
        }
    }

    const logout = () => {
        setOpen(false)
        setRedirect(true)
    }
    const handleContinue = () => {
        setOpen(false)
        setTimedOut(false)
        reset()
        resume()
        setElapsed(timeout)
    }


    const {
        reset,
        resume,
        getRemainingTime,
        getElapsedTime
    } = useIdleTimer({
        timeout,
        onIdle: handleOnIdle,
        onActive: handleActive,
        debounce: 250
    })

    useEffect(() => {
        setRemaining(getRemainingTime())
        setElapsed(getElapsedTime())

        setInterval(() => {
            setRemaining(getRemainingTime())
            setElapsed(getElapsedTime())
        }, 1000)
    }, [])

    const millisToMinutes = () => {
        let remain = timeout - elapsed;
        let minutes = Math.floor(remain / 60000);
        let seconds = ((remain % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    if (redirect) {
        return <Redirect to="/" />
    }
    else {
        return (
            <>
                <Dialog open={open} disableBackdropClick={true} disableEscapeKeyDown={true}	>
                    <DialogTitle id="alert-dialog-title">{"You have been Idle a bit too long "}</DialogTitle>

                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            You will be log out in:
                            <h4>Time Remaining: {millisToMinutes()}</h4>
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={logout} color="primary">
                            Logout
                        </Button>
                        <Button onClick={handleContinue} color="primary" autoFocus>
                            Continue
                        </Button>
                    </DialogActions>
                </Dialog>

            </>
        );
    }

}