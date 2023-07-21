/* eslint-disable camelcase */
import { yupResolver } from '@hookform/resolvers/yup';
import _ from '@lodash';
import { Avatar, AvatarGroup, Box } from '@mui/material';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { showMessage } from 'app/store/fuse/messageSlice';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import * as yup from 'yup';
import { useState } from 'react';
import jwtService from '../../auth/services/jwtService';

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  no_wa: yup.string().required('Diharuskan untuk mengisi nomor Whatsapp.'),
  password: yup.string().required('Diharuskan untuk memasukkan password.'),
});

const defaultValues = {
  no_wa: '',
  password: '',
  remember: true,
};

function SignInPage() {
  const dispatch = useDispatch();
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;
  const [loading, setLoading] = useState(false);

  function onSubmit({ no_wa, password }) {
    setLoading(true);
    const payload = {
      no_wa,
      password,
    };
    jwtService
      .signInWithEmailAndPassword(payload)
      .then((user) => {
        // No need to do anything, user data will be set at app/auth/AuthContext
      })
      .catch((error) => {
        dispatch(
          showMessage({
            message: error?.message,
            variant: 'error',
          })
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Masuk
          </Typography>
          {false && (
            <div className="flex items-baseline mt-2 font-medium">
              <Typography>Belum memiliki akun?</Typography>
              <Link className="ml-4" to="/sign-up">
                Daftar
              </Link>
            </div>
          )}

          <form
            name="loginForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="no_wa"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="No. Whatsapp"
                  autoFocus
                  type="text"
                  error={!!errors.no_wa}
                  helperText={errors?.no_wa?.message}
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="Masukkan nomor Whatsapp"
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Password"
                  type="password"
                  error={!!errors.password}
                  helperText={errors?.password?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
              {false && (
                <Controller
                  name="remember"
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <FormControlLabel
                        label="Remember me"
                        control={<Checkbox size="small" {...field} />}
                      />
                    </FormControl>
                  )}
                />
              )}

              <Link className="text-md font-medium" to="/pages/auth/forgot-password">
                Lupa Password?
              </Link>
            </div>

            <Button
              variant="contained"
              color="secondary"
              className=" w-full mt-16"
              aria-label="Masuk"
              disabled={_.isEmpty(dirtyFields) || !isValid || loading}
              type="submit"
              size="large"
            >
              {loading ? 'Harap Menunggu' : 'Masuk'}
            </Button>
          </form>
        </div>
      </Paper>
      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full overflow-hidden "
        sx={{
          // backgroundImage: "url('assets/images/etc/sign-in-cover.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="w-full h-full absolute top-0 left-0">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15189.128380529874!2d112.68188307573257!3d-7.362891145274552!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd7e347a02654f7%3A0x2c352fd612095d9a!2sGeluran%2C%20Taman%2C%20Sidoarjo%20Regency%2C%20East%20Java!5e0!3m2!1sen!2sid!4v1689827185756!5m2!1sen!2sid"
            width="100%"
            height="100%"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="geluran-sidoarjo"
          />
        </div>
        <div className="bg-opacity-80 bg-black h-full w-full absolute" />
        <div className="z-10 relative w-full max-w-2xl p-20">
          <div className="text-7xl font-bold leading-none text-gray-50">
            <div>Selamat datang,</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-gray-100">
            Dashboard manajemen untuk keperluan perekapan data RT 7 Geluran, Sidoarjo
          </div>
          <div className="flex items-center mt-40">
            <AvatarGroup
              sx={{
                '& .MuiAvatar-root': {
                  borderColor: 'white',
                },
              }}
            >
              <Avatar src="assets/images/logo/logo.svg" />
            </AvatarGroup>

            <div className="ml-16 font-medium tracking-tight text-gray-200">
              Ben pak RT senang dan dimudahkan untuk merekap data warganya!
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default SignInPage;
