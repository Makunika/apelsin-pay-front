import { Link as RouterLink } from 'react-router-dom';
// material
import {Grid, Button, Container, Stack, Typography, CircularProgress} from '@mui/material';
// components
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import Page from '../components/Page';
import Iconify from '../components/Iconify';
import { DepositCard} from '../sections/@dashboard/deposit';
//
import API_SECURED, {URL_ACCOUNT_PERSONAL} from "../api/ApiSecured";

export default function Deposit() {
  const [isLoading, setLoading] = useState(true)
  const [deposits, setDeposits] = useState([])
  const {enqueueSnackbar} = useSnackbar();
  useEffect(() => {
    API_SECURED.get(`${URL_ACCOUNT_PERSONAL}api/personal/`)
        .then(res => {
          setDeposits(res.data)
          setLoading(false)
        })
        .catch(reason => {
          console.log(reason)
          enqueueSnackbar(`Ошибка: ${reason}`, { variant: "error" })
        })
  }, [])
  
  if (isLoading) {
    return (
        <Page title="Главная | Апельсин pay">
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
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Счета
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

        <Grid container spacing={3}>
          {deposits.map((deposit, index) => (
            <DepositCard key={deposit.number} deposit={deposit} index={index} />
          ))}
        </Grid>
      </Container>
    </Page>
  );
}

//         <Stack mb={5} direction="row" alignItems="center" justifyContent="space-between">
//           <BlogPostsSearch posts={POSTS} />
//           <BlogPostsSort options={SORT_OPTIONS} />
//         </Stack>
