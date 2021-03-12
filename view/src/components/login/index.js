
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
import { useForm } from "react-hook-form";
import { Input } from "@material-ui/core";
import Brand from '../../resources/logo_1.png'
import { Redirect, Link } from 'react-router-dom'

import { shallowEqual, useSelector, useDispatch } from 'react-redux'
import { loginPayload } from '../../store/actions/login.action'

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

export default function SignIn(props) {
    const classes = useStyles();
    const { register, errors, handleSubmit, setError, clearErrors, getValues } = useForm({ mode: 'onTouched' });

    let isLogin = useSelector(state => state.loginReducer.login)
    let isLoading = useSelector(state => state.loginReducer.loading)
    let errorMsg = useSelector(state => state.loginReducer.error)

    const dispatch = useDispatch()

    const onSubmit = () => {
        let data = getValues();
        loginPayload(data.email, data.password, dispatch)

        if (errorMsg == "INCORRECT CREDENTIAL") {
            setError("password", {
                message: "INCORRECT CREDENTIAL"
            })
        } else {
            setError("email", { message: errorMsg })
        }

    };

    console.log(useSelector(state => state))
    if (isLogin) {
        return (<Redirect to="/dashboard" />);
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
                            control={<Checkbox value="remember" color="primary" />}
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
            </Container>
        );
    }
}

