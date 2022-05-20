import {Link as RouterLink, useLocation} from 'react-router-dom';
// material
import {Button, Container, Stack, Typography, CircularProgress, Breadcrumbs, Link} from '@mui/material';
// components
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import Page from '../components/Page';
import Iconify from '../components/Iconify';
//
import API_SECURED, {URL_ACCOUNT_PERSONAL, URL_INFO_BUSINESS} from "../api/ApiSecured";
import DepositCardDetail from "../sections/@dashboard/depositDetail/DepositCardDetail";
import {fNumberDeposit} from "../utils/formatNumber";
import DepositTypeDetail from "../sections/@dashboard/depositDetail/DepositTypeDetail";
import TransactionOpen from "../sections/@dashboard/depositDetail/TransactionOpen";
import TransactionList from "../sections/@dashboard/depositDetail/TransactionList";
import Section404 from "../sections/404/Section404";
import CompanyCardDetail from "../sections/@dashboard/companyDetail/CompanyCardDetail";

export default function CompanyDetail() {
  const [isLoading, setLoading] = useState(true)
  const [company, setCompany] = useState({})
  const [companyUser, setCompanyUser] = useState({})
  const [isNotFound, setNotFound] = useState(false)
  const [refreshAll, setRefreshAll] = useState(Math.random())
  const {enqueueSnackbar} = useSnackbar();
  const location = useLocation();

  useEffect(() => {
    API_SECURED.get(`${URL_INFO_BUSINESS}/company/current`)
      .then(res => {
        const cu = res.data.find(
          cu => cu.company.id === parseInt(location.search.substring(1), 10)
        );
        if (!cu) {
          throw new Error("404")
        }
        setCompanyUser(cu)
        setCompany(cu.company)
        setLoading(false)
      })
      .catch(reason => {
        console.log(reason)
        if (reason.message === "404") {
          setNotFound(true)
          setLoading(false)
          enqueueSnackbar(`Компания не найдена`, { variant: "error" })
        } else {
          enqueueSnackbar(`Ошибка: ${reason}`, { variant: "error" })
        }
      })
  }, [refreshAll])

  if (isLoading) {
    return (
      <Page>
        <Container>
          <Stack direction="column" alignItems="center" justifyContent="center" mt={5}>
            <CircularProgress />
          </Stack>
        </Container>
      </Page>
    )
  }

  if (isNotFound) {
    return (
      <Page>
        <Container>
          <Section404 renderBack />
        </Container>
      </Page>
    )
  }

  return (
    <Page title="Компании | Апельсин pay">
      <Container>
        <Breadcrumbs aria-label="breadcrumb" mb={5}>
          <Link underline="hover" color="inherit" href="/dashboard/blog" >
            Компании
          </Link>
          <Typography color="text.primary">{company.name}</Typography>
        </Breadcrumbs>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Компания
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/deposits/new"
          >
            Изменить данные
          </Button>
        </Stack>
        <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" flexWrap="wrap" mb={5}>
          <CompanyCardDetail companyUser={companyUser} />
        </Stack>
      </Container>
    </Page>
  );
}