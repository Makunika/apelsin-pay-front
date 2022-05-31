import {useLocation} from 'react-router-dom';
// material
import {
  Button,
  Container,
  Stack,
  Typography,
  CircularProgress,
  Breadcrumbs,
  Link,
  Dialog,
  DialogTitle, DialogContent, IconButton, DialogActions, Box, Grid
} from '@mui/material';
// components
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import Page from '../components/Page';
import Iconify from '../components/Iconify';
//
import API_SECURED, {URL_ACCOUNT_BUSINESS, URL_INFO_BUSINESS} from "../api/ApiSecured";
import Section404 from "../sections/404/Section404";
import CompanyCardDetail from "../sections/@dashboard/companyDetail/CompanyCardDetail";
import CompanyForm from "../sections/@dashboard/companyDetail/CompanyForm";
import CompanyCardApiKey from "../sections/@dashboard/companyDetail/CompanyCardApiKey";
import {isConfirmed, isOwner} from "../utils/companyUtils";
import DepositTypeDetail from "../sections/@dashboard/depositDetail/DepositTypeDetail";
import {fillTypeDataBusiness} from "../utils/depositUtils";
import CompanyDepositNewOrUpdateForm from "../sections/@dashboard/companyDetail/CompanyDepositNewOrUpdateForm";
import CompanyCardUsers from "../sections/@dashboard/companyDetail/CompanyCardUsers";
import TransactionList from "../sections/@dashboard/depositDetail/TransactionList";
import {BUSINESS_TYPE} from "../utils/formatEnum";
import DepositCardDetail from "../sections/@dashboard/depositDetail/DepositCardDetail";
import TransactionPayout from "../sections/@dashboard/depositDetail/TransactionPayout";

export default function CompanyDetail() {
  const location = useLocation();
  const idCompany = parseInt(location.search.substring(1), 10)
  const [isLoading, setLoading] = useState(true)
  const [company, setCompany] = useState({

  })
  const [companyUser, setCompanyUser] = useState({
    company: {}
  })
  const [isNotFound, setNotFound] = useState(false)
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
  const [openUpdateDepositDialog, setOpenUpdateDepositDialog] = useState(false)
  const [refreshAll, setRefreshAll] = useState(Math.random())
  const {enqueueSnackbar} = useSnackbar();
  const [deposit, setDeposit] = useState({})

  useEffect(() => {
    const depositData = {
      deposit: null,
      type: null
    }
    API_SECURED.get(`${URL_INFO_BUSINESS}/company/current`)
      .then(res => {

        const cu = res.data.find(
          cu => cu.company.id === idCompany
        );
        if (!cu) {
          setNotFound(true)
          setLoading(false)
          enqueueSnackbar(`Компания не найдена`, { variant: "error" })
          throw new Error("404")
        }
        setCompanyUser(cu)
        setCompany(cu.company)
        return API_SECURED.get(`${URL_ACCOUNT_BUSINESS}api/business/company/${idCompany}`)
      })
      .then(res => {
        console.log(res)
        if (res.data.typeId == null)
          return null;
        // eslint-disable-next-line prefer-destructuring
        depositData.deposit = res.data
        return API_SECURED.get(`${URL_ACCOUNT_BUSINESS}api/business/type/${depositData.deposit.typeId}`)
      }, reason => {})
      .then(res => {
        depositData.type = res != null ? res.data : null
        setDeposit(depositData)
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
        setNotFound(true)
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
      <Dialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Изменить данные компании</DialogTitle>
        <DialogContent>
          <Box mt={1} >
            <CompanyForm
              initCompany={{
                name: company.name,
                inn: company.inn,
                address: company.address
              }}
              id={idCompany}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <IconButton
            onClick={() => setOpenUpdateDialog(false)}
          >
            <Iconify icon="eva:close-outline" />
          </IconButton>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openUpdateDepositDialog}
        onClose={() => setOpenUpdateDepositDialog(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle
          sx={{
            bgcolor: (theme) => theme.palette.grey[100]
          }}
        >Счет компании</DialogTitle>
        <DialogContent
          sx={{
            bgcolor: (theme) => theme.palette.grey[100]
          }}
        >
          <Box mt={1} >
            <CompanyDepositNewOrUpdateForm
              companyUser={companyUser}
              updateInfo={deposit.type == null ? null : deposit}
            />
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            bgcolor: (theme) => theme.palette.grey[100]
          }}
        >
          <IconButton
            onClick={() => setOpenUpdateDepositDialog(false)}
          >
            <Iconify icon="eva:close-outline" />
          </IconButton>
        </DialogActions>
      </Dialog>
      <Container>
        <Breadcrumbs aria-label="breadcrumb" mb={5}>
          <Link underline="hover" color="inherit" href="/dashboard/companies" >
            Компании
          </Link>
          <Typography color="text.primary">{company.name}</Typography>
        </Breadcrumbs>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5} flexWrap="wrap">
          <Typography variant="h4" gutterBottom>
            Компания
          </Typography>
          <Stack direction="row" spacing={2} >
            <Button
              variant="contained"
              onClick={() => setOpenUpdateDialog(true)}
              disabled={isConfirmed(companyUser)}
            >
              Изменить данные
            </Button>
            <Button
              variant="contained"
              onClick={() => setOpenUpdateDepositDialog(true)}
              disabled={!isConfirmed(companyUser) || !isOwner(companyUser)}
            >
              {deposit.type == null ? 'Открыть счет компании' : 'Изменить тип счета компании'}
            </Button>
          </Stack>
        </Stack>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CompanyCardDetail companyUser={companyUser} />
          </Grid>
          {deposit.deposit != null && (
            <Grid item xs={12} sm={6}>
              <DepositCardDetail
                deposit={deposit.deposit}
                type={BUSINESS_TYPE}
                refresh={setRefreshAll}
              />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <CompanyCardApiKey companyUser={companyUser} />
          </Grid>
          {deposit.type != null && (
            <Grid item xs={12} sm={6}>
              <DepositTypeDetail valid={deposit.type.valid}
                                 name={deposit.type.name}
                                 description={deposit.type.description}
                                 type={fillTypeDataBusiness(deposit.type)}
                                 showTitle
              />
            </Grid>
          )}
          {deposit.type != null && (
            <Grid item xs={12} sm={6}>
              <TransactionList refreshState={refreshAll} refresh={setRefreshAll} number={deposit.deposit.number} />
            </Grid>
          )}
          <Grid item xs={12} sm={6}>
            <CompanyCardUsers companyUser={companyUser}
                              refresh={setRefreshAll}
                              refreshState={refreshAll}
            />
          </Grid>
          {deposit.deposit != null && (
            <Grid item xs={12} sm={6}>
              <TransactionPayout
                number={deposit.deposit.number}
                refresh={setRefreshAll}
                commission={deposit.type.commissionRateWithdraw == null ? 0 : deposit.type.commissionRateWithdraw}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </Page>
  );
}