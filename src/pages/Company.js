import { Link as RouterLink } from 'react-router-dom';
// material
import {Grid, Button, Container, Stack, Typography, CircularProgress} from '@mui/material';
// components
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import Page from '../components/Page';
import Iconify from '../components/Iconify';
//
import API_SECURED, {URL_INFO_BUSINESS} from "../api/ApiSecured";
import CompanyCard from "../sections/@dashboard/company/CompanyCard";

export default function Company() {
  const [isLoading, setLoading] = useState(true)
  const [companies, setCompanies] = useState([])
  const {enqueueSnackbar} = useSnackbar();
  useEffect(() => {
    API_SECURED.get(`${URL_INFO_BUSINESS}/company/current`)
      .then(res => {
        setCompanies(res.data)
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
    <Page title="Компании | Апельсин pay">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Компании
          </Typography>
          <Button
            variant="contained"
            component={RouterLink}
            to="/dashboard/companies/new"
            startIcon={<Iconify icon="eva:plus-fill" />}
          >
            Создать аккаунт компании
          </Button>
        </Stack>

        <Grid container spacing={3}>
          {companies.length === 0 && (
            <Typography variant="caption">
              Компаний нет
            </Typography>
          )}
          {companies.map((company, index) => (
            <CompanyCard key={company.id} company={company} index={index} />
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
