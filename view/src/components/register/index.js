import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from "react-hook-form";
import {FormHelperText} from "@material-ui/core";
import Copyright from '../copyRight'
import Brand from '../../resources/logo_1.png'


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
}));

export default function SignUp() {
    const classes = useStyles();
    const { register, errors, handleSubmit, setError, clearErrors, watch } = useForm({mode: 'onTouched'});

    const onSubmit = (data, e) =>{

    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <img className={classes.image} src={Brand}/>
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
                                name="invite"
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
            <Box mt={5}>
                <Copyright />
            </Box>
        </Container>
    );
}