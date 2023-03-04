import PropTypes from 'prop-types';
// material
import {Box, Card, Typography, Stack, Button} from '@mui/material';
import { styled } from '@mui/material/styles';
// utils
import {useSnackbar} from "notistack";
import {fCurrencyByEnum} from "../utils/formatEnum";
import apiSecured from "../api/ApiSecured";
import {errorHandler} from "../utils/errorUtils";

// ----------------------------------------------------------------------

const ProductImgStyle = styled('img')({
  top: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  position: 'absolute'
});

// ----------------------------------------------------------------------

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes*60000);
}

function toISOString(date) {
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
}

ShopProductCard.propTypes = {
  product: PropTypes.object
};

export default function ShopProductCard({ product }) {
  const { name, cover, price, currency, shortName } = product;
  const {enqueueSnackbar} = useSnackbar();
  
  
  const handleBuy = () => {
    const data = {
      shortName,
      fullName: name,
      amount: price,
      currency,
      companyId: 4,
      redirectUrl: "http://demoshop.graduate.pshiblo.xyz/success",
      endDate: toISOString(addMinutes(new Date(), 30))
    }
    apiSecured.post(`public/order`, data)
      .then(res => {
        console.log(res)
        window.location.href = res.data.payUrl
      })
      .catch(reason => {
        errorHandler(enqueueSnackbar, reason)
      })
  };

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        <ProductImgStyle alt={name} src={cover} />
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <div>
          <Typography variant="subtitle2" noWrap>
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {shortName}
          </Typography>
        </div>

        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">
            {price} {fCurrencyByEnum(currency).label}
          </Typography>
          <Button
            variant="outlined"
            onClick={handleBuy}
          >
            Купить
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
