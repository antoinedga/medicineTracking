import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom'
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Link, useParams } from 'react-router-dom';
import { Box, Grid, Button, TextField, CircularProgress, Backdrop, Typography } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { makeStyles } from '@material-ui/core/styles';
import { useForm } from "react-hook-form";
import { FormHelperText, Container } from "@material-ui/core";
import Copyright from '../copyRight'
import BrandNav from '../brandNav'
import Brand from '../../resources/logo_1.png'
import { registration } from '../../store/actions/register.action'
import { useSelector, useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

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
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    invalid: {
        height: "85vh",
    }
}));

export default function SignUp() {
    const classes = useStyles();
    const { register, errors, handleSubmit, setError, clearErrors, watch, setValue, getValues } = useForm({ mode: 'onTouched' });
    const loading = useSelector(state => state.register.loading)
    const success = useSelector(state => state.register.success)
    const [message, setMessage] = React.useState("")
    const dispatch = useDispatch()

    const onSubmit = (data, e) => {
        let formData = getValues();
        let toSend = {
            email: formData.email,
            password: formData.password,
            token: formData.token,
            name: `${formData.firstName} ${formData.lastName}`
        }
        registration(toSend, dispatch).then(data => {

            console.log(data)
        }).catch(error => {
            console.log(error.response.data.message)
            setMessage(error.response.data.message)
            setAlertOpen(true)
        })

    }

    let { token } = useParams();
    useEffect(() => {

        if (token != undefined) {
            setValue("invite", token)
        }

    }, []);

    const [openAlert, setAlertOpen] = React.useState(false);
    const handleClick = () => {
        setAlertOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setAlertOpen(false);
    };


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <img className={classes.image} src={Brand} />
                <Typography component="h1" variant="h5">
                    Sign up
                    </Typography>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Grid container spacing={2}>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                inputRef={
                                    register({
                                        pattern: {
                                            value: /^[a-z ,.'-]+$/i,
                                            message:
                                                "Must a valid Name"
                                        },
                                        required: "First Name Field cannot be empty"
                                    })
                                }
                            />
                            <FormHelperText error={errors.firstName != undefined}>
                                {errors?.firstName?.message}
                            </FormHelperText>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                                inputRef={
                                    register({
                                        pattern: {
                                            value: /^[a-z ,.'-]+$/i,
                                            message:
                                                "Must be a valid Name"
                                        },
                                        required: "Last Name Field cannot be empty"
                                    })
                                }
                            />

                            <FormHelperText error={errors.lastName != undefined}>
                                {errors?.lastName?.message}
                            </FormHelperText>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"

                                inputRef={
                                    register({
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                            message:
                                                "Must be a valid Email"
                                        },
                                        required: "Email cannot be empty"
                                    })
                                }
                            />
                            <FormHelperText error={errors.email != undefined}>
                                {errors?.email?.message}
                            </FormHelperText>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="invite-code"
                                label="Invitation Code"
                                name="token"
                                inputRef={
                                    register(
                                        {
                                            required: 'A Valid Token must be added to allow registration!'

                                        }
                                    )
                                }

                            />
                            <FormHelperText error={errors.invite != undefined}>
                                {errors?.invite?.message}
                            </FormHelperText>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                inputRef={
                                    register(
                                        {
                                            minLength: {
                                                value: 8,
                                                message: "Must be at least 8 characters long"
                                            },
                                            pattern: {
                                                value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/,
                                                message: "Password Must be a minimum 8 characters long, at least one uppercase letter, one lowercase letter, one number and one special character"
                                            }

                                        }
                                    )
                                }

                            />
                            <FormHelperText error={errors.password != undefined}>
                                {errors?.password?.message}
                            </FormHelperText>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password2"
                                label="Confirm Password"
                                type="password"
                                id="password"
                                autoComplete="confirm-password"

                                inputRef={register({
                                    validate: (value) => value === watch('password') || "Confirm Password Must Match Password"
                                }
                                )}
                            />
                            <FormHelperText error={errors.password2 != undefined}>
                                {errors?.password2?.message}
                            </FormHelperText>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        Sign Up
                        </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link to="/login" variant="body2">
                                Already have an account? Sign in
                                </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert onClose={handleClose} severity={success ? "success" : "error"}>
                    {message}
                </Alert>
            </Snackbar>
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}