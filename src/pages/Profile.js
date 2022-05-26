// material
import {
  Button,
  Container,
  Stack,
  Typography,
  CircularProgress, Grid
} from '@mui/material';
// components
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import Page from '../components/Page';
//
import API_SECURED, {
  URL_INFO_PERSONAL
} from "../api/ApiSecured";
import ProfileCard from "../sections/@dashboard/profile/ProfileCard";
import ChangePasswordCard from "../sections/@dashboard/profile/ChangePasswordCard";

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
        <Grid container spacing={3} >
          <Grid item xs={12}>
            <ProfileCard profile={profile} />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <ChangePasswordCard profile={profile} />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}