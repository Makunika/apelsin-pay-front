import { styled } from '@mui/material/styles';
import {
  Box,
  Card,
  Link,
  Container,
  Typography,
  CircularProgress,
  Stack,
  Button,
  Divider,
  CardContent
} from '@mui/material';
// layouts
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
// components
import {useSnackbar} from "notistack";
import Page from '../components/Page';
import apiSecured, {BASE_URL} from "../api/ApiSecured";
import {errorHandler} from "../utils/errorUtils";
import {fCurrencyByEnum} from "../utils/formatEnum";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
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

export default function DemoOrderSuccessPage() {
  const {search} = useLocation();
  const [loading, setLoading] = useState(false)
  const [isSend, setSend] = useState(false)
  const [order, setOrder] = useState(null)
  const {enqueueSnackbar} = useSnackbar();
  const params = new URLSearchParams(search);
  const id = params.get('apelsinOrderId');

  if (id == null) {
    return (
      <RootStyle title="Оплатить | Apelsin pay">
        <Container>
          <ContentStyle>
            <Typography color="error" variant="h4" align="center">
              Нет обязательного параметра "ID заказа"
            </Typography>
          </ContentStyle>
        </Container>
      </RootStyle>
    )
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    setLoading(true)
    apiSecured.get(`public/order/${id}`)
      .then(res => {
        console.log(res)
        setOrder(res.data)
        setLoading(false)
        if (res.data.orderStatus === 'COMPLETED' || res.data.orderStatus === 'CANCEL') {
          setSend(true)
        }
      })
      .catch(reason => {
        errorHandler(enqueueSnackbar, reason)
      })
  }, [isSend])

  if (loading) {
    return (
      <RootStyle title="Оплатить | Apelsin pay">
        <Container>
          <ContentStyle>
            <Stack justifyContent="center" alignItems="center">
              <CircularProgress />
            </Stack>
          </ContentStyle>
        </Container>
      </RootStyle>
    )
  }

  const handleConfirm = () => {
    apiSecured.put(`public/order/${order.id}/confirm`)
      .then(() => {
        enqueueSnackbar('Покупка подтверждена, деньги зачислены компании', { variant: "success" })
        setSend(true)
      })
      .catch(reason => {
        errorHandler(enqueueSnackbar, reason)
      })
  };

  const handleFailed = () => {
    apiSecured.put(`public/order/${order.id}/cancel`)
      .then(() => {
        enqueueSnackbar('Покупка отменена, деньги возвращены владельцу', { variant: "success" })
        setSend(true)
      })
      .catch(reason => {
        errorHandler(enqueueSnackbar, reason)
      })
  };

  return (
    <RootStyle title="Оплатить | Apelsin pay">
      <Container>
        {order && (
          <ContentStyle>
            <Card>
              <CardContent>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h3">
                    Покупка получилась!
                  </Typography>
                  {!isSend && (
                    <Typography variant="body1" color="text.secondary" gutterBottom mb={4}>
                      Снизу вы можете подтвердить покупки или ее отменить (делается магазином)
                    </Typography>
                  )}
                  <Typography variant="h4">
                    {order.fullName}
                  </Typography>
                  {order.shortName && (
                    <Typography sx={{ color: 'text.secondary' }}>
                      {order.shortName}
                    </Typography>
                  )}
                  <Typography variant="h3" mt={2}>
                    {order.amount} {fCurrencyByEnum(order.currency).label}
                  </Typography>
                </Box>

                {isSend ? (
                  <Stack spacing={2} >
                    <Button
                      size="large"
                      variant="contained"
                      href="http://pshiblo.xyz/dashboard/company?4"
                    >
                      Перейти в аккаунт компании, куда пришла оплата
                    </Button>
                    <Button
                      size="large"
                      variant="outlined"
                      href="/"
                    >
                      Перейти обратно в демо магазин
                    </Button>
                  </Stack>
                ) : (
                  <Stack spacing={2} >
                    <Button
                      size="large"
                      variant="outlined"
                      onClick={handleConfirm}
                    >
                      Подтвердить покупку
                    </Button>
                    <Button
                      size="large"
                      variant="outlined"
                      onClick={handleFailed}
                    >
                      Отменить покупку
                    </Button>
                  </Stack>
                )}

                <Stack justifyContent="space-between" direction="row" mt={3}>
                  <Typography variant="body2" color="text.secondary">
                    Заказ номер {order.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.orderStatus === 'HOLD' && "Заказ ожидает подтверждения магазина"}
                    {order.orderStatus === 'COMPLETED' && "Заказ оплачен"}
                    {order.orderStatus === 'CANCEL' && `Заказ отменен`}
                  </Typography>
                </Stack>
                {order.orderStatus === 'CANCEL' && (
                  <Typography mt={1} variant="body2" color="text.secondary" >
                    {`Причина отмены: ${order.reasonCancel}`}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </ContentStyle>
        )}
      </Container>
    </RootStyle>
  );
}