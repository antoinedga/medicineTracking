
import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { FormHelperText } from '@material-ui/core';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { useForm } from "react-hook-form";
import Brand from '../../resources/logo_1.png'
import { Redirect, Link } from 'react-router-dom'

import { useSelector, useDispatch } from 'react-redux'
import constant from '../../store/actions/actionType/login'
import { loginPayload } from '../../store/actions/login.action'
import { refreshToken } from '../../util/refreshTokenMethod'
import Cookies from 'universal-cookie';
const cookies = new Cookies();
var jwt = require('jsonwebtoken');


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

export default function SignIn(props) {
    const classes = useStyles();
    const { register, errors, handleSubmit, setError, getValues, setValue } = useForm({ mode: 'onTouched' });

    let isLogin = useSelector(state => state.login.login)
    let isLoading = useSelector(state => state.login.loading)
    let errorMsg = useSelector(state => state.login.error)
    const [open, setOpen] = React.useState(false);
    const [remember, setRemember] = React.useState(false)
    const dispatch = useDispatch()

    const onSubmit = () => {
        let formData = getValues();
        loginPayload(formData.email, formData.password, dispatch).then(data => {

            if (data.response) {
                handleRememberMe(formData)
            }

            if (errorMsg == "INCORRECT CREDENTIAL") {
                setError("password", {
                    message: "INCORRECT CREDENTIAL"
                })
            } else {
                setError("email", { message: errorMsg })
            }
        }).catch(error => {
            setError("password", {
                message: "INCORRECT CREDENTIAL"
            })
        })


    };

    const handleRememberMe = (data) => {
        if (remember) {
            localStorage.setItem("credential", JSON.stringify(data))
            console.log(localStorage.getItem("credential"))
        } else {
            localStorage.setItem("credential", "")
        }
    }

    // for the alert 

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    useEffect(() => {
        if (cookies.get("token") != "logged out" && cookies.get("token") != null && cookies.get("token") != undefined) {

            dispatch({ type: constant.LOGIN_SUCCESS, payload: { token: cookies.get('token'), refresh: cookies.get("refreshToken"), name: cookies.get("name") } })
            refreshToken(dispatch)
        }

        if (props.location.state?.msg) {
            setOpen(true)
        }

        if (localStorage.getItem("credential") != null && localStorage.getItem("credential") != "") {
            let credential = localStorage.getItem("credential");
            credential = JSON.parse(credential)
            setValue('email', credential.email, { shouldValidate: true })
            setValue('password', credential.password, { shouldValidate: true })
            setRemember(true)
        }
    }, []);

    if (isLogin) {
        return (<Redirect to="/dashboard/inventory" />);
    }
    else {
        return (
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <img className={classes.image} src={Brand} />
                    <Typography component="h1" variant="h5">
                        Sign in
                </Typography>
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
                        <TextField
                            variant="outlined"
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            inputRef={register({
                                required: "Password Field cannot be empty"
                            })}
                        />
                        <FormHelperText error={errors.password != undefined}>
                            {errors?.password?.message}
                        </FormHelperText>



                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" checked={remember} onChange={() => setRemember(!remember)} />}
                            label="Remember me"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={handleSubmit(onSubmit)}
                        >
                            Sign In
                    </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link to="/password_reset">
                                    Forgot password?
                            </Link>
                            </Grid>
                            <Grid item>
                                <Link to="/signup">
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
                <Snackbar open={open} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    autoHideDuration={6000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error">
                        You must be signed in to access dashboard
                    </Alert>
                </Snackbar>
            </Container>
        );
    }
}

