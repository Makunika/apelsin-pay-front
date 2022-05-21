import {Link as RouterLink, useLocation, useNavigate} from 'react-router-dom';
// material
import {Button, Container, Stack, Typography, CircularProgress, Breadcrumbs, Link} from '@mui/material';
// components
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import Page from '../components/Page';
import Iconify from '../components/Iconify';
//
import API_SECURED, {URL_ACCOUNT_PERSONAL} from "../api/ApiSecured";
import DepositCardDetail from "../sections/@dashboard/depositDetail/DepositCardDetail";
import {fNumberDeposit} from "../utils/formatNumber";
import DepositTypeDetail from "../sections/@dashboard/depositDetail/DepositTypeDetail";
import TransactionOpen from "../sections/@dashboard/depositDetail/TransactionOpen";
import TransactionList from "../sections/@dashboard/depositDetail/TransactionList";
import Section404 from "../sections/404/Section404";
import {fillTypeDataPersonal} from "../utils/depositUtils";

export default function DepositDetail() {
    const [isLoading, setLoading] = useState(true)
    const [deposit, setDeposit] = useState({})
    const [isNotFound, setNotFound] = useState(false)
    const [refreshAll, setRefreshAll] = useState(Math.random())
    const {enqueueSnackbar} = useSnackbar();
    const location = useLocation();

    useEffect(() => {
        const depositData = {
            deposit: null,
            type: null
        }
        API_SECURED.get(`${URL_ACCOUNT_PERSONAL}api/personal/number/${location.search.substring(1)}`)
            .then(res => {
                depositData.deposit = res.data
                return API_SECURED.get(`${URL_ACCOUNT_PERSONAL}api/type/${res.data.typeId}`)
            })
            .then(res => {
                depositData.type = res.data
                setDeposit(depositData)
                setLoading(false)
            })
            .catch(reason => {
                console.log(reason)
                if (reason.response.status === 404) {
                    enqueueSnackbar("Счет не найден!", { variant: "error" })
                    setNotFound(true)
                    setLoading(false)
                } else {
                    enqueueSnackbar(`Ошибка: ${reason.response.data.message}`, { variant: "error" })
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
        <Page title="Cчета | Апельсин pay">
            <Container>
                <Breadcrumbs aria-label="breadcrumb" mb={5}>
                    <Link underline="hover" color="inherit" href="/dashboard/blog" >
                        Счета
                    </Link>
                    <Typography color="text.primary">{fNumberDeposit(deposit.deposit.number)}</Typography>
                </Breadcrumbs>
                <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
                    <Typography variant="h4" gutterBottom>
                        Cчет
                    </Typography>
                    <Button
                        variant="contained"
                        component={RouterLink}
                        to="/dashboard/deposits/new"
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        Открыть новый счет
                    </Button>
                </Stack>
                <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" flexWrap="wrap" mb={5}>
                    <DepositCardDetail deposit={deposit.deposit} />
                    <DepositTypeDetail showTitle
                                       type={fillTypeDataPersonal(deposit.type)}
                                       name={deposit.type.name}
                                       description={deposit.type.description}
                                       valid={deposit.type.valid}
                    />
                    <TransactionList refreshState={refreshAll} refresh={setRefreshAll} number={deposit.deposit.number} />
                    <TransactionOpen refreshState={refreshAll} refresh={setRefreshAll} number={deposit.deposit.number} />
                </Stack>
            </Container>
        </Page>
    );
}