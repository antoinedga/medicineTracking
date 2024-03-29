
import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { FormHelperText } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useForm } from "react-hook-form";
import { Input } from "@material-ui/core";
import Brand from '../../resources/logo_1.png'

import { Redirect } from 'react-router-dom'
import { forgotAction } from '../../store/actions/forgot.action'
import { useDispatch, useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    image: {
        padding: 16
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    }
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Forgot() {
    const classes = useStyles();
    const { register, errors, handleSubmit, setError, getValues, clearErrors } = useForm({ mode: 'onTouched' });
    const isLoading = useSelector(state => state.forgot.loading)
    const errorMsg = useSelector(state => state.forgot.error)
    const success = useSelector(state => state.forgot.success)
    const [openAlerDialog, setOpen] = React.useState(false);
    const dispatch = useDispatch()

    const onSubmit = () => {
        clearErrors()
        let data = getValues();
        forgotAction(data.email, dispatch).then((result) => {

            if (result) {
                setOpen(true);
            } else {
                setError('email', {
                    message: "NO USER UNDER THIS EMAIL EXIST!"
                });
            }

        }).catch(error => {
            setError("email", {
                message: "ERROR ON OUR END"
            })
        })
    };

    // for the alert 

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };



    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <img className={classes.image} src={Brand} />
                <Typography component="h1" variant="h5">
                    Password Rest                </Typography>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        varient="outlined"
                        inputRef={register({
                            pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message:
                                    "Must be a Valid Email"
                            },
                            required: "Email Field cannot be empty"
                        })}
                    />

                    <FormHelperText error={errors.email != undefined}>
                        {errors?.email?.message}
                    </FormHelperText>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit(onSubmit)}
                    >
                        Submit
                    </Button>
                    <Grid container>

                        <Grid item>
                            <Link href="/signup" variant="body2">
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>

            </Box>
            <Backdrop className={classes.backdrop} open={isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>

            <Snackbar open={openAlerDialog} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="success">
                    EMAIL HAS BEEN SENT
                </Alert>
            </Snackbar>
        </Container>
    );
}