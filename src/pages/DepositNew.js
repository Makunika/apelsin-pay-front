import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom';
// material
import {Grid, Button, Container, Stack, Typography, CircularProgress, Box, Breadcrumbs, Link} from '@mui/material';
// components
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import Page from '../components/Page';
//
import API_SECURED, {URL_ACCOUNT_PERSONAL} from "../api/ApiSecured";
import DepositTypeDetail from "../sections/@dashboard/depositDetail/DepositTypeDetail";
import {fillTypeDataPersonal} from "../utils/depositUtils";

export default function DepositNew() {
  const [isLoading, setLoading] = useState(true)
  const [types, setTypes] = useState([])
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    API_SECURED.get(`${URL_ACCOUNT_PERSONAL}public/type/`)
      .then(res => {
        setTypes(res.data)
        setLoading(false)
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка: ${reason}`, { variant: "error" })
      })
  }, [])

  const handleNew = (type) => {
    console.log("ok")
    setLoading(true)
    const data = {
      typeId: type.id
    }
    API_SECURED.post(`${URL_ACCOUNT_PERSONAL}api/personal/`, data)
      .then(res => {
        setLoading(false)
        enqueueSnackbar("Счет создан", {variant: "success"})
        navigate(`/dashboard/deposit?${res.data.number}`, { replace: true })
      })
      .catch(reason => {
        console.log(reason)
        setLoading(false)
        let msg = reason.response.data.message;
        if (msg.includes("Limit")) {
          msg = "Превышен лимит счетов"
        }
        enqueueSnackbar(`Ошибка: ${msg}`, { variant: "error" })
      })
  }

  if (isLoading) {
    return (
      <Page>
        <Container>
          <Breadcrumbs aria-label="breadcrumb" mb={5}>
            <Link underline="hover" color="inherit" href="/dashboard/blog" >
              Счета
            </Link>
            <Typography color="text.primary">Открыть новой счет</Typography>
          </Breadcrumbs>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h4" gutterBottom>
              Выберите тип счета
            </Typography>
          </Stack>
          <Stack direction="column" alignItems="center" justifyContent="center" mt={5}>
            <CircularProgress />
          </Stack>
        </Container>
      </Page>
    )
  }

  return (
    <Page title="Новый счет | Апельсин pay">
      <Container>
        <Breadcrumbs aria-label="breadcrumb" mb={5}>
          <Link underline="hover" color="inherit" href="/dashboard/blog" >
            Счета
          </Link>
          <Typography color="text.primary">Открыть новой счет</Typography>
        </Breadcrumbs>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Выберите тип счета
          </Typography>
        </Stack>
        <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" flexWrap="wrap" mb={5}>
          {types.map((value, index) => (
            <DepositTypeDetail
              key={value.id}
              name={value.name}
              description={value.description}
              type={fillTypeDataPersonal(value)}
              handleButton={handleNew}
              titleButton="Выбрать"
              showTitle={false}
              defaultExpanded
              valid={value.valid}
              typeReturned={value}
            />
          ))}
        </Stack>
      </Container>
    </Page>
  );
}