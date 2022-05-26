// material
import { styled } from '@mui/material/styles';
import {Box, CircularProgress, Container, Stack, Typography} from '@mui/material';
// components
import Page from '../components/Page';
import {RememberForm} from "../sections/authentication/remember";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

export default function RememberPassword() {
  return (
    <RootStyle title="Восстановления пароля | Apelsin pay">
      <Container>
        <ContentStyle>
          <Typography variant="h4" gutterBottom mb={5}>
            Восстановление пароля
          </Typography>
          <RememberForm />
        </ContentStyle>
      </Container>
    </RootStyle>
  );
}
