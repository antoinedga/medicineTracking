
import React, { useEffect, useState, useRef } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
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
import Brand from '../../resources/logo_1.png'
import { sendResetPassword } from '../../store/actions/reset.action'
import { useDispatch, useSelector } from 'react-redux';
import ReCAPTCHA from "react-google-recaptcha";
import { constant } from '../../store/actions/actionType/reset';


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

const passwordRequirement = "Must have at least the following:\n" + "1. One Lower case\n2. One Upper Case\n3. One number\n4. be at least 7 characters long"

function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export default function Forgot() {
    const classes = useStyles();
    const { register, errors, handleSubmit, setError, getValues, clearErrors, watch } = useForm({ mode: 'onTouched' });
    const [human, setHuman] = useState(false);
    const [openAlerDialog, setOpen] = useState(false);
    const [alertSuccess, setAlertSuccess] = useState(false);
    const dispatch = useDispatch()
    const isLoading = useSelector(state => state.reset.loading)
    console.log(isLoading)
    const password = useRef({});
    password.current = watch("new_password", "");

    const onSubmit = () => {

        clearErrors()
        let data = getValues();
        dispatch({ type: constant.RESET_SENT })
        sendResetPassword(dispatch, data).then((result) => {
            console.log(result)
            if (result.response) {
                dispatch({ type: constant.RESET_SUCCESS })
                setAlertSuccess(true)
                setOpen(true)
            } else {
                dispatch({ type: constant.RESET_FAILURE })
                setAlertSuccess(false)
                setOpen(true)
                setError("token", {
                    message: result.message
                })
            }

        }).catch(error => {
            dispatch({ type: constant.RESET_FAILURE })
            setError("email", {
                message: "ERROR ON OUR END"
            })
        })
    };

    // for the alert 
    const verifyState = (response) => {

        if (response) {
            setHuman(true);
        } else {
            setHuman(false);
        }
    }

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
                    Form to Reset Your Password</Typography>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)} noValidate>

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Reset Token"
                        name="token"
                        type="text"
                        inputRef={register({
                            required: "Must be filed to submit password change",
                        })}

                    />
                    <FormHelperText error={errors.token != undefined}>
                        <Typography>
                            {errors?.token?.message}
                        </Typography>
                    </FormHelperText>

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        name="new_password"
                        type="password"

                        inputRef={register({
                            required: "Must Enter a Password to reset account",
                            pattern: {
                                value: /[A-Za-z]{3}/,
                                message: passwordRequirement // JS only: <p>error message</p> TS only support string
                            }
                        })}

                    />
                    <FormHelperText error={errors.new_password != undefined}>
                        {errors?.new_password?.message.split('\n').map(str => <Typography>{str}</Typography>)}
                    </FormHelperText>

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        label="Confirm Password"
                        name="confirm_password"
                        type="password"

                        inputRef={register({
                            required: true,
                            validate: value =>
                                value === password.current || "The passwords do not match"
                        })}

                    />

                    <FormHelperText error={errors.confirm_password != undefined}>
                        <Typography>
                            {errors?.confirm_password?.message}
                        </Typography>
                    </FormHelperText>

                    <div style={{ paddingTop: 10 }}>
                        <ReCAPTCHA
                            sitekey="6LencYkaAAAAAFrCw5kZmC9cXoNJZQNOvwZrEIe2"
                            onChange={verifyState}
                        />
                    </div>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={handleSubmit(onSubmit)}
                        disabled={!human}
                    >
                        Submit
                    </Button>
                    <Grid container>

                        <Grid item>
                            <Link href="/login" variant="body2">
                                {"Remembered your password? go back to login"}
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
                <Alert onClose={handleClose} severity={(alertSuccess ? "success" : "error")}>
                    {(alertSuccess) ? "Successfully reset your password" : "Error Occur"}
                </Alert>
            </Snackbar>
        </Container >
    );
}