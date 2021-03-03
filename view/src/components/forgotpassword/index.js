
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
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { FormHelperText } from '@material-ui/core';
import { useForm } from "react-hook-form";
import { Input } from "@material-ui/core";
import Brand from '../../resources/logo_1.png'

import { Redirect } from 'react-router-dom'

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
    }
}));

export default function SignIn() {
    const classes = useStyles();
    const { register, errors, handleSubmit, setError, clearErrors } = useForm({ mode: 'onTouched' });
    const [successful, setLogin] = useState(false)

    const onSubmit = () => {



        setLogin(true)
    };

    if (successful) {
        return (<Redirect to="/dashboard" />);
    }
    else {
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

                        <FormHelperText error={errors.password != undefined}>
                            {errors?.password?.message}
                        </FormHelperText>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={onSubmit}
                        >
                            Sign In
                    </Button>
                        <Grid container>
                            <Grid item xs>
                                <Link href="#" variant="body2">
                                    Forgot password?
                            </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/register" variant="body2">
                                    {"Don't have an account? Sign Up"}
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
                <Box mt={8}>

                </Box>
            </Container>
        );
    }
}