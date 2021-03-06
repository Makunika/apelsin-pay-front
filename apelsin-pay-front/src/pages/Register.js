import {Link as RouterLink, Redirect} from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Box, Card, Link, Container, Typography } from '@mui/material';
// layouts
import React from "react";
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { RegisterForm } from '../sections/authentication/register';
import {getAuthorizationUrl} from "../api/AuthApi";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Register() {
  return (
    <RootStyle title="Регистрация | Apelsin pay">
      <AuthLayout>
        Уже есть аккаунт? &nbsp;
        <Link underline="none" variant="subtitle2" href={getAuthorizationUrl()} to="/login">
          Войти
        </Link>
      </AuthLayout>

      <SectionStyle sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
          Управляй своими финансами при помощи Апельсин pay
        </Typography>
        <img alt="register" src="/static/illustrations/illustration_register.png" />
      </SectionStyle>

      <Container>
        <ContentStyle>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h4" gutterBottom>
              Регистрация в Апельсин
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              Всегда удобно.
            </Typography>
          </Box>

          <RegisterForm />

          <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
            Регистрируясь, я соглашаюсь с Апельсин.&nbsp;
            <Link underline="always" color="textPrimary">
              Условия сервиса
            </Link>
            &nbsp;и&nbsp;
            <Link underline="always" color="textPrimary">
              Политика конфиденциальности
            </Link>
            .
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{
              mt: 3,
              textAlign: 'center',
              display: { sm: 'none' }
            }}
          >
            Уже есть аккаунт?&nbsp;
            <Link underline="hover" href={getAuthorizationUrl()}>
              Войти
            </Link>
          </Typography>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}