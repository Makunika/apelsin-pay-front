import { styled } from '@mui/material/styles';
import {Box, Card, Link, Container, Typography, CircularProgress, Stack, Button, Divider} from '@mui/material';
// layouts
import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
// components
import {useSnackbar} from "notistack";
import axios from "axios";
import Page from '../components/Page';
import PaymentForm from "../sections/PaymentForm";
import apiSecured, {BASE_URL, URL_ACCOUNT_PERSONAL, URL_PAYMENTS, URL_TRANSACTION} from "../api/ApiSecured";
import {errorHandler} from "../utils/errorUtils";
import {fCurrencyByEnum} from "../utils/formatEnum";
import {fTime} from "../utils/formatTime";
import PaymentApelsinForm from "../sections/PaymentApelsinForm";

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

const currency = [
  'EUR',
  'RUB',
  'USD'
]

function getLast(c) {
  return currency.filter(cu => cu !== c)
}

// ----------------------------------------------------------------------

export default function ApelsinPage() {
  const {search} = useLocation();
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState(null)
  const [deposits, setDeposits] = useState(null)
  const [otherCurrencies, setOtherCurrencies] = useState([])
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const [ms, setMs] = useState(0)
  const params = new URLSearchParams(search);
  const id = params.get('id');

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
    let interval
    let timeout
    setLoading(true)
    axios.get(`${BASE_URL}${URL_PAYMENTS}public/order/${id}`,
      {
        responseType: "json"
      }
    )
      .then(res => {
        console.log(res)
        const now = new Date(Date.now());
        const endDate = new Date(res.data.endDate);
        if (endDate.getTime() < now.getTime() || res.data.orderStatus === 'HOLD' || res.data.orderStatus === 'COMPLETED' || res.data.orderStatus === 'CANCEL') {
          navigate(`/?orderId=${id}`)
        }
        const ms = endDate.getTime() - now.getTime()
        setMs(ms)
        interval = setInterval(() => {
          setMs(endDate.getTime() - Date.now())
        }, 1000)

        timeout = setTimeout(() => {
          navigate(`/?orderId=${id}`)
        }, ms)

        setOrder(res.data)
        const currencies = getLast(res.data.currency);
        return {
          currencies,
          amount: res.data.amount,
          current: res.data.currency
        };

      })
      .then(async currency => {
        console.log(currency)
        if (currency) {
          const result = await Promise.all(currency.currencies.map(async c => {
            const data = {
              currencyTo: c,
              currencyFrom: currency.current,
              amount: currency.amount
            }
            const result = await axios.post(`${BASE_URL}${URL_TRANSACTION}public/currency`, data);
            return result.data
          }))
          setOtherCurrencies(result)
        }
        return apiSecured.get(`${URL_ACCOUNT_PERSONAL}api/personal`)
      })
      .then(res => {
        setDeposits(res.data)
        setLoading(false)
      })
      .catch(reason => {
        errorHandler(enqueueSnackbar, reason)
      })
    return () => {
      clearInterval(interval)
      clearTimeout(timeout)
    }
  }, [search])

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

  return (
    <RootStyle title="Оплатить | Apelsin pay">
      <Container>
        {order && (
          <ContentStyle>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" gutterBottom>
                {order.fullName}
              </Typography>
              {order.shortName && (
                <Typography sx={{ color: 'text.secondary' }}>
                  {order.shortName}
                </Typography>
              )}
              <Divider sx={{ mt: 1 }} />
              <Typography variant="h3" mt={1} align="right">
                {order.amount} {fCurrencyByEnum(order.currency).label}
              </Typography>
              {otherCurrencies.map((c, index) => (
                <Typography key={index} variant="body1"  align="right" color="text.disabled">
                  {c.amount} {fCurrencyByEnum(c.currency).label}
                </Typography>
              ))}
            </Box>

            <PaymentApelsinForm order={order} deposits={deposits} />

            <Stack justifyContent="space-between" direction="row" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Заказ номер {order.id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {fTime(ms)}
              </Typography>
            </Stack>


            <Typography variant="body2" align="center" sx={{ color: 'text.secondary', mt: 3 }}>
              Оплачивая, я соглашаюсь с Апельсин.&nbsp;
              <Link underline="always" color="textPrimary">
                Условия сервиса
              </Link>
              &nbsp;и&nbsp;
              <Link underline="always" color="textPrimary">
                Политика конфиденциальности
              </Link>
              .
            </Typography>
          </ContentStyle>
        )}
      </Container>
    </RootStyle>
  );
}