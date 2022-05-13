import {Link as RouterLink, useLocation} from 'react-router-dom';
// material
import {Grid, Button, Container, Stack, Typography, CircularProgress, Box, Breadcrumbs, Link} from '@mui/material';
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
import {AppOrderTimeline} from "../sections/@dashboard/app";

export default function DepositDetail() {
    const [isLoading, setLoading] = useState(true)
    const [deposit, setDeposit] = useState({})
    const {enqueueSnackbar} = useSnackbar();
    const location = useLocation();
    console.log(deposit)

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
                enqueueSnackbar(`Ошибка: ${reason}`, { variant: "error" })
            })
    }, [])

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
                    <DepositTypeDetail showTitle type={deposit.type} />
                    <AppOrderTimeline number={deposit.deposit.number} />
                </Stack>
            </Container>
        </Page>
    );
}