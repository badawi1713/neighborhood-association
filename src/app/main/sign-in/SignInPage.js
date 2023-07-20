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
  email: yup
    .string()
    .email('Alamat email harus valid, contoh: zonapay@mail.com.')
    .required('Diharuskan untuk mengisi alamat email.'),
  password: yup.string().required('Diharuskan untuk memasukkan password.'),
});

const defaultValues = {
  email: '',
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

  function onSubmit({ email, password }) {
    setLoading(true);
    const payload = {
      email,
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
          <img className="w-[240px] mx-auto" src="assets/images/logo/logo-text.svg" alt="logo" />

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
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Email"
                  autoFocus
                  type="email"
                  error={!!errors.email}
                  helperText={errors?.email?.message}
                  variant="outlined"
                  required
                  fullWidth
                  placeholder="zonapay@mail.com"
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
          backgroundImage: "url('assets/images/etc/sign-in-cover.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }}
      >
        <div className="bg-opacity-30 bg-black h-full w-full absolute" />
        <div className="z-10 relative w-full max-w-2xl p-20">
          <div className="text-7xl font-bold leading-none text-gray-50">
            <div>Dashboard Zonapay,</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-gray-100">
            Pakai Zonapay bebas bayar apa saja dan menguntungkan!
          </div>
          <div className="flex items-center mt-40">
            <AvatarGroup
              sx={{
                '& .MuiAvatar-root': {
                  borderColor: 'white',
                },
              }}
            >
              <Avatar src="assets/images/avatars/female-18.jpg" />
              <Avatar src="assets/images/avatars/female-11.jpg" />
              <Avatar src="assets/images/avatars/male-09.jpg" />
              <Avatar src="assets/images/avatars/male-16.jpg" />
            </AvatarGroup>

            <div className="ml-16 font-medium tracking-tight text-gray-200">
              Sudah banyak yang menggunakan aplikasi Zonapay, saatnya giliran Kamu!
            </div>
          </div>
        </div>
      </Box>
    </div>
  );
}

export default SignInPage;
