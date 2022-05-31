// material
import { styled } from '@mui/material/styles';
import {Box, Button, Container, Typography} from '@mui/material';
// components
import {useLocation} from "react-router-dom";
import {motion} from "framer-motion";
import Page from '../components/Page';
import {MotionContainer, varBounceIn} from "../components/animate";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  display: 'flex',
  minHeight: '100%',
  alignItems: 'center',
  paddingTop: theme.spacing(15),
  paddingBottom: theme.spacing(10)
}));

// ----------------------------------------------------------------------

export default function TestTinkoffPay() {
  const {search} = useLocation();
  const redirectUrl = search.substring(1)

  return (
    <RootStyle title="Тест | Apelsin pay">
      <Container>
        <MotionContainer initial="initial" open>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <motion.div variants={varBounceIn}>
              <Typography variant="h3" paragraph>
                Как будто страница оплаты Tinkoff
              </Typography>
            </motion.div>
            <Typography sx={{ color: 'text.secondary' }} mb={5}>
              Извините, нет тестовой страницы оплаты для Tinkoff API, нажмите кнопку ниже для успешной оплаты
            </Typography>

            <motion.div variants={varBounceIn}>
              <Button href={redirectUrl} size="large" variant="contained">
                Успешная оплата
              </Button>
            </motion.div>
          </Box>
        </MotionContainer>
      </Container>
    </RootStyle>
  );
}
