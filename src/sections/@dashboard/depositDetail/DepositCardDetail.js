import PropTypes from 'prop-types';
// material
import { alpha, styled } from '@mui/material/styles';
import {Card, Grid, Typography, CardContent, CardHeader, Stack} from '@mui/material';
// utils
import {fNumberDeposit} from '../../../utils/formatNumber';
//
import SimpleAccordion from "../../../components/SimpleAccordion";
import {fCurrencyByEnum} from "../../../utils/formatEnum";
import SimpleDataVisible from "../../../components/SimpleDataVisible";

// ----------------------------------------------------------------------

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),

}));

// ----------------------------------------------------------------------

DepositCardDetail.propTypes = {
  deposit: PropTypes.object.isRequired
};

export default function DepositCardDetail({ deposit }) {
  const { balance, currency, lock, number, typeId, typeName, userId, validType } = deposit

  return (
    <Grid item xs={12} sm={6} md={6} padding={1}>
      <Card sx={{
        position: 'relative',
        ...((lock) && {
          '&:after': {
            top: 0,
            content: "''",
            width: '100%',
            height: '100%',
            position: 'absolute',
            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.3)
          }
        })
      }}>
        <CardHeader title="Информация о счете" />
        <CardContent>
          <Stack justifyContent="flex-start" direction="column" >
            <SimpleDataVisible label="Тип счета" text={typeName} />
            <SimpleDataVisible label="Номер счета" text={fNumberDeposit(number)} />
          </Stack>
          <InfoStyle>
            {lock && <Typography color="warning">Счет заблокирован</Typography>}
            <Typography style={{ fontWeight: 600 }}>{`${balance} ${fCurrencyByEnum(currency).label}`}</Typography>
          </InfoStyle>
        </CardContent>
      </Card>
    </Grid>
  );
}
