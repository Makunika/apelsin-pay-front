import PropTypes from 'prop-types';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import {Box, Link, Card, Grid, Avatar, Typography, CardContent, Stack} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from '../../../components/Iconify';

// ----------------------------------------------------------------------

const CardMediaStyle = styled('div')({
  position: 'relative',
  paddingTop: 'calc(100% * 3 / 4)'
});

const TitleStyle = styled(Typography)({
  height: 44,
  overflow: 'hidden',
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical'
});

const AvatarStyle = styled(Avatar)(({ theme }) => ({
  zIndex: 9,
  width: 32,
  height: 32,
  position: 'absolute',
  left: theme.spacing(3),
  bottom: theme.spacing(-2)
}));

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),

}));

const CoverImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

DepositCardDetail.propTypes = {
  deposit: PropTypes.object.isRequired
};

export default function DepositCardDetail({ deposit }) {
  const { balance, currency, lock, number, typeId, typeName, userId, validType } = deposit

  return (
    <Grid item xs={12} sm={6} md={4} padding={1}>
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

        <CardContent
        >
          <Typography variant="h4" gutterBottom>
            Информация о счете
          </Typography>

          <Typography variant="body2">
            {`Тип счета: ${typeName}`}
          </Typography>
          <Typography variant="body2">
            {`Номер счета: ${number}`}
          </Typography>

          <InfoStyle>
            {lock && <Typography color="warning">Счет заблокирован</Typography>}
            <Typography >{`Баланс ${balance} ${currency}`}</Typography>
          </InfoStyle>
        </CardContent>
      </Card>
    </Grid>
  );
}
