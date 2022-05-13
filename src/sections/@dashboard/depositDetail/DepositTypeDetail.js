import PropTypes from 'prop-types';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
// material
import { alpha, styled } from '@mui/material/styles';
import {
  Box,
  Link,
  Card,
  Grid,
  Avatar,
  Typography,
  CardContent,
  Stack,
  Accordion,
  AccordionSummary, AccordionDetails, CardHeader
} from '@mui/material';
// utils
import {useState} from "react";
import {LoadingButton} from "@mui/lab";
import { fDate } from '../../../utils/formatTime';
import { fShortenNumber } from '../../../utils/formatNumber';
//
import SvgIconStyle from '../../../components/SvgIconStyle';
import Iconify from '../../../components/Iconify';
import SimpleAccordion from "../../../components/SimpleAccordion";

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

DepositTypeDetail.propTypes = {
  type: PropTypes.object.isRequired,
  showTitle: PropTypes.bool,
  titleButton: PropTypes.string,
  handleButton: PropTypes.func,
  defaultExpanded: PropTypes.bool,
  loading: PropTypes.bool,
};

export default function DepositTypeDetail({ loading, type, showTitle, titleButton, handleButton, defaultExpanded }) {
  const { currency, description, maxSum, maxSumForPay, minSumToStartWork, name, requiredToFirstPay, typeRequiredConfirmed, valid } = type
  return (
    <Grid item xs={12} sm={6} md={6} padding={1}>
      <Card>
        {showTitle && (
          <CardHeader title="Информация о типе счете" />
        )}
        <CardContent>

          <Typography variant="h6">
            {`${name}`}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {`${description}`}
          </Typography>
          <SimpleAccordion defaultExpanded={defaultExpanded} title="Максимальная сумма на счете" body={`${maxSum} ${currency}`} />
          <SimpleAccordion defaultExpanded={defaultExpanded} title="Максимальная сумма для перевода" body={`${maxSumForPay} ${currency}`} />
          {minSumToStartWork && (
              <SimpleAccordion defaultExpanded={defaultExpanded} title="Минимальная сумма для активации счета" body={`${minSumToStartWork} ${currency}`} />
          )}
          <SimpleAccordion defaultExpanded={defaultExpanded} title="Необходимость подтверждения профиля" body={typeRequiredConfirmed ? "Да" : "Нет"} />
          <InfoStyle>
            {!valid && <Typography color="warning">Архивный</Typography>}
            {handleButton && (
                <LoadingButton
                  loading={loading}
                  onClick={() => {
                    handleButton(type)
                  }}
                >
                  {titleButton}
                </LoadingButton>
            )}
          </InfoStyle>
        </CardContent>
      </Card>
    </Grid>
  );
}
