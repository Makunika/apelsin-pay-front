import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  Link,
  Stack,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import {useSnackbar} from "notistack";
import Iconify from '../../../components/Iconify';
import {loginUser, useAuthDispatch} from "../../../context";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAuthDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const LoginSchema = Yup.object().shape({
    login: Yup.string().required('Логин обязателен').min(3, "Никнейм должен быть больше 3 символов"),
    password: Yup.string().required('Пароль обязателен')
  });

  const formik = useFormik({
    initialValues: {
      login: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (values) =>
        loginUser(dispatch, values)
            .then(result => {
                  if (result) {
                    enqueueSnackbar("Вы авторизованы!", { variant: 'success' });
                  } else {
                    console.log(result)
                    enqueueSnackbar("Неправильный логин/пароль", { variant: 'error' });
                  }
                },
                reason => {
                  const {response} = reason
                  if (response.status === 401) {
                    enqueueSnackbar("Такого пользователя не существует", {variant: "error"})
                  } else if (response.status === 400) {
                    enqueueSnackbar("Неверный пароль", {variant: "error"})
                  } else {
                    console.log(reason)
                    enqueueSnackbar(`Ошибка: ${response.data.error}`, {variant: 'error'});
                  }
                })
  })

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="text"
            label="Логин"
            {...getFieldProps('login')}
            error={Boolean(touched.login && errors.login)}
            helperText={touched.login && errors.login}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            label="Пароль"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            Забыли пароль?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Войти
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}
