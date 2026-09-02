import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import {Card, Stack, Link, Container, Typography, CircularProgress} from '@mui/material';
// layouts
import {useEffect} from "react";
import {useSnackbar} from "notistack";
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import {loginUser, useAuthDispatch} from "../context";
import {exchangeCodeForToken, orderIdFromState} from "../api/AuthApi";

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

export default function Login() {

  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAuthDispatch()
  const {enqueueSnackbar} = useSnackbar()

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.has("error")) {
      enqueueSnackbar(`Ошибка входа: ${params.get("error_description") || params.get("error")}`, {variant: "error"})
      return
    }
    if (!params.has("code")) {
      return
    }
    const state = params.get("state")
    const orderId = orderIdFromState(state)

    exchangeCodeForToken(params.get("code"), state)
        .then((data) => loginUser(dispatch, data.access_token))
        .then(() => {
          enqueueSnackbar("Вы авторизованы", {variant: "success"})
          navigate(`/apelsin/?id=${orderId}`, { replace: true })
        })
        .catch(reason => {
          console.log(reason)
          enqueueSnackbar(`Ошибка: ${reason.message || reason}`, {variant: "error"})
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <RootStyle title="Авторизация | Apelsin pay">
      <AuthLayout>
        Нет аккаунта? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
          Создать
        </Link>
      </AuthLayout>

      <SectionStyle sx={{ display: { xs: 'none', md: 'flex' } }}>
        <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
          Привет, с возвращением!
        </Typography>
        <img src="/static/illustrations/illustration_login.png" alt="login" />
      </SectionStyle>

      <Container maxWidth="sm" >
        <ContentStyle>
          <Stack
              direction="column"
              justifyContent="center"
              alignItems="center"
              spacing={2}
          >
            <Typography variant="h4" gutterBottom>
              Производим вход в Апельсин
            </Typography>
            <CircularProgress />
          </Stack>
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
