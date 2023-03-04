
import {Button, Container, Stack, Typography} from '@mui/material';
// components
import Page from '../components/Page';
//
import PRODUCTS from '../_mocks_/products';
import ProductList from "../sections/ProductList";

// ----------------------------------------------------------------------

export default function DemoShopPage() {
  return (
    <Page title="Демо магазин">
      <Container sx={{ mb: 5, mt: 5 }} >
        <Stack justifyContent="space-between" alignItems="center" direction="row"  sx={{ mb: 5 }}>
          <Typography variant="h4">
            Магазин кроссовок
          </Typography>
          <Button
            size="medium"
            href="http://graduate.pshiblo.xyz"
            variant="outlined"
          >
            Перейти в Apelsin pay
          </Button>
        </Stack>

        <ProductList products={PRODUCTS} />
      </Container>
    </Page>
  );
}
