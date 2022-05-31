// material
import { styled } from '@mui/material/styles';
import {CircularProgress, Container, Stack, Typography} from '@mui/material';
// components
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {useSnackbar} from "notistack";
import Page from '../components/Page';
import apiSecured, {URL_TRANSACTION} from "../api/ApiSecured";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function SuccessTinkoffPay() {
  const navigate = useNavigate();
  const {search} = useLocation();
  const {enqueueSnackbar} = useSnackbar();
  const params = new URLSearchParams(search);
  const number = params.get("number")
  const transactionId = params.get("id")

  if (!number || !transactionId) {
    navigate("/", { replace: true })
  }

  useEffect(() => {
    apiSecured.post(`${URL_TRANSACTION}api/transaction/success/redirect/${transactionId}`)
      .then(() => {
        setTimeout(() => {
          navigate(`/dashboard/deposit?${number}`, {replace: true})
        }, 2000)
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar("Что то пошло не так", { variant: "error" })
      })
  }, [])

  return (
    <RootStyle title="Подтверждение оплаты | Apelsin pay">
      <Container>
        <Stack
          direction="column"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Typography variant="h4" gutterBottom>
            Подтверждаем оплату
          </Typography>
          <CircularProgress />
        </Stack>
      </Container>
    </RootStyle>
  );
}
