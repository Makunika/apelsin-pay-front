import PropTypes from 'prop-types';
// material
import {Card, Grid, CardContent, CardHeader, Stack} from '@mui/material';
// utils
//
import {fRoleCompany, fStatusConfirmed} from "../../../utils/formatEnum";
import SimpleDataVisible from "../../../components/SimpleDataVisible";

CompanyCardDetail.propTypes = {
  companyUser: PropTypes.object.isRequired
};

export default function CompanyCardDetail({ companyUser }) {

  return (
    <Grid item xs={12} sm={12} md={12} padding={1}>
      <Card >
        <CardHeader title="Информация о компании" />
        <CardContent>
          <Stack direction="column" justifyContent="flex-start" >
            <SimpleDataVisible
              label="Роль"
              text={fRoleCompany(companyUser.roleCompany)}
              withDivider={false} />
            <SimpleDataVisible
              label="ИНН"
              text={companyUser.company.inn}
              withDivider={false} />
            <SimpleDataVisible
              label="Адрес"
              text={companyUser.company.address}
              withDivider={false} />
            <SimpleDataVisible
              label="Статус"
              text={fStatusConfirmed(companyUser.company.status)}
              colorTitle={companyUser.company.status === "FAILED_CONFIRMED" ? "text.error" : "text.disable"}
              withDivider={false} />
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}
