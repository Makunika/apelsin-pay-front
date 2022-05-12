import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Stack, TextField, IconButton, InputAdornment } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import axios from "axios";
import {useSnackbar} from "notistack";
import Iconify from '../../../components/Iconify';
import {BASE_URL, URL_INFO_PERSONAL} from "../../../api/Api";
import "yup-phone";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {enqueueSnackbar} = useSnackbar();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, 'Слишком короткий!')
      .max(50, 'Слишком большой!')
      .required('Имя обязательно'),
    lastName: Yup.string()
        .min(2, 'Слишком короткий!')
        .max(50, 'Слишком большой!')
        .required('Фамилия обязательна'),
    email: Yup.string()
        .email('Email должен быть валидным!')
        .required('Email обязателен'),
    passportNumber: Yup.string()
        .length(6, "Номер паспорта должен состоять из 6 символов")
        .matches(/\d/, "Только цифры!")
        .required('Номер паспорта обязателен'),
    passportSeries: Yup.string()
        .length(4, "Серия паспорта должен состоять из 4 символов")
        .matches(/\d/, "Только цифры!")
        .required('Серия паспорта обязательна'),
    birthday: Yup.date()
        .required('Дата обязательна'),
    login: Yup.string()
        .min(2, 'Слишком короткий!')
        .max(50, 'Слишком большой!')
        .required('Логин обязателен'),
    password: Yup.string()
        .required('Пароль обязателен'),
    phone: Yup.string()
        .phone("RU", false, "Неверный формат номера")
        .required('Пароль обязателен')
  });

  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      login: '',
      passportNumber: '',
      passportSeries: '',
      birthday: '',
      password: '',
      phone: '+7'
    },
    validationSchema: RegisterSchema,
    onSubmit: (values) => {
      console.log(values)
      console.log(JSON.stringify(values))
      return axios.post(
          `${BASE_URL}${URL_INFO_PERSONAL}public/register`,
          values,
          {
            responseType: "json"
          }
          ).then(res => {
            console.log(res)
            enqueueSnackbar("Регистрация пройдена успешно, выполните вход", {variant: "success"})
            navigate('/', { replace: true });
          },
          reason => {
            console.log(reason)
            enqueueSnackbar(`Ошибка ${reason.response.statusText}`, {variant: "error"})
          })
    }
  });

  const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps } = formik;

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
              fullWidth
              label="Имя"
              {...getFieldProps('firstName')}
              error={Boolean(touched.firstName && errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              fullWidth
              label="Фамилия"
              {...getFieldProps('lastName')}
              error={Boolean(touched.lastName && errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />
          </Stack>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <TextField
                fullWidth
                label="Серия паспорта"
                {...getFieldProps('passportSeries')}
                error={Boolean(touched.passportSeries && errors.passportSeries)}
                helperText={touched.passportSeries && errors.passportSeries}
            />

            <TextField
                fullWidth
                label="Номер паспорта"
                {...getFieldProps('passportNumber')}
                error={Boolean(touched.passportNumber && errors.passportNumber)}
                helperText={touched.passportNumber && errors.passportNumber}
            />
          </Stack>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DesktopDatePicker
                label="Дата рождения"
                inputFormat="MM/dd/yyyy"
                onChange={(val) => {
                  formik.setFieldValue('birthday', val);
                }}
                value={values.birthday}
                renderInput={(params) => <TextField
                    {...params}
                    error={Boolean(touched.birthday && errors.birthday)}
                    helperText={touched.birthday && errors.birthday}
                />}
            />
          </LocalizationProvider>

          <TextField
              fullWidth
              autoComplete="phone"
              type="phone"
              label="Номер телефона"
              placeholder="+79998882233"
              {...getFieldProps('phone')}
              error={Boolean(touched.phone && errors.phone)}
              helperText={touched.phone && errors.phone}
          />

          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Email"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

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
                  <IconButton edge="end" onClick={() => setShowPassword((prev) => !prev)}>
                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                  </IconButton>
                </InputAdornment>
              )
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Регистрация
          </LoadingButton>
        </Stack>
      </Form>
    </FormikProvider>
  );
}
