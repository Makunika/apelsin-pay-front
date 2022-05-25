// material
import {
  Card,
  Stack,
  Container,
  Typography
} from '@mui/material';
import Page from '../components/Page';
import CompanyConfirmedTable from "../sections/@dashboard/companyModerate/CompanyConfirmedTable";

export default function CompanyModerator() {

  return (
    <Page title="Модерация | Apelsin pay">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Компании
          </Typography>
        </Stack>
        <Typography variant="h6" mb={3}>
          Список для проверки на подтверждение
        </Typography>
        <Card>
          <CompanyConfirmedTable />
        </Card>
      </Container>
    </Page>
  );
}
