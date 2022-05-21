import {Link as RouterLink, useLocation} from 'react-router-dom';
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
  DialogTitle, DialogContent, IconButton, DialogActions, Box
} from '@mui/material';
// components
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import Page from '../components/Page';
import Iconify from '../components/Iconify';
//
import API_SECURED, {
  URL_ACCOUNT_BUSINESS,
  URL_ACCOUNT_PERSONAL,
  URL_INFO_BUSINESS,
  URL_INFO_PERSONAL
} from "../api/ApiSecured";
import Section404 from "../sections/404/Section404";
import CompanyCardDetail from "../sections/@dashboard/companyDetail/CompanyCardDetail";
import CompanyForm from "../sections/@dashboard/companyDetail/CompanyForm";
import CompanyCardApiKey from "../sections/@dashboard/companyDetail/CompanyCardApiKey";
import {isConfirmed, isOwner} from "../utils/companyUtils";
import {DepositCardDetail} from "../sections/@dashboard/depositDetail";
import DepositTypeDetail from "../sections/@dashboard/depositDetail/DepositTypeDetail";
import {fillTypeDataBusiness} from "../utils/depositUtils";
import CompanyDepositNewOrUpdateForm from "../sections/@dashboard/companyDetail/CompanyDepositNewOrUpdateForm";
import ProfileCard from "../sections/@dashboard/profile/ProfileCard";

export default function Profile() {
  const [isLoading, setLoading] = useState(true)
  const [profile, setProfile] = useState({})
  const [refreshAll, setRefreshAll] = useState(Math.random())
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    API_SECURED.get(`${URL_INFO_PERSONAL}/api/persons`)
      .then(res => {
        console.log(res.data)
        setProfile(res.data)
        setLoading(false)
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка: ${reason}`, { variant: "error" })
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

  return (
    <Page title="Профиль | Апельсин pay">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Профиль
          </Typography>
          {profile.status === 'NOT_CONFIRMED' && (
            <Button variant="contained">
              Отправить на подтверждение
            </Button>
          )}
        </Stack>
        <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" flexWrap="wrap" mb={5}>
          <ProfileCard profile={profile} />
        </Stack>
      </Container>
    </Page>
  );
}