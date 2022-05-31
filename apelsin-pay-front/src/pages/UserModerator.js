// material
import {
  Card,
  Stack,
  Container,
  Typography, CardHeader, Divider, Box
} from '@mui/material';
import Page from '../components/Page';
import UserConfirmedTable from "../sections/@dashboard/userModerate/UserConfirmedTable";
import UserAllTable from "../sections/@dashboard/userModerate/UserAllTable";


// function CustomApplySortFilter(array, comparator, query) {
//   const arrayFiltered = applySortFilter(array, comparator);
//   if (query) {
//     return filter(arrayFiltered, (_user) => _user.firstName.toLowerCase().indexOf(query.toLowerCase()) !== -1);
//   }
//   return arrayFiltered;
// }

export default function UserModerator() {

  return (
    <Page title="Модерация | Apelsin pay">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Пользователи
          </Typography>
        </Stack>
        <Typography variant="h6" mb={3}>
          Список для проверки на подтверждение
        </Typography>
        <Card>
          <UserConfirmedTable />
        </Card>
        <Box mb={1} mt={3} >
          <Divider />
        </Box>
        <Typography variant="h6" mb={3}>
          Список всех пользователей
        </Typography>
        <Card>
          <UserAllTable />
        </Card>
      </Container>
    </Page>
  );
}
