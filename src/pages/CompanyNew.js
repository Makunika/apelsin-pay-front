// material
import {Container, Stack, Typography, CircularProgress, Breadcrumbs, Link} from '@mui/material';
// components
import {useState} from "react";
import Page from '../components/Page';
//
import CompanyForm from "../sections/@dashboard/companyDetail/CompanyForm";

export default function CompanyNew() {

  return (
    <Page title="Компании | Апельсин pay">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Breadcrumbs aria-label="breadcrumb" mb={5}>
            <Link underline="hover" color="inherit" href="/dashboard/companies" >
              Компании
            </Link>
            <Typography color="text.primary">Открыть новой счет</Typography>
          </Breadcrumbs>
          <Typography variant="h4" gutterBottom>
            Новая компания
          </Typography>
        </Stack>

        <CompanyForm
          isSave
        />
      </Container>
    </Page>
  );
}
