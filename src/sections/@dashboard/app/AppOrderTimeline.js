import PropTypes from 'prop-types';
// material
import {
  Card,
  Typography,
  CardHeader,
  CardContent,
  Button,
  Stack,
  DialogTitle,
  Dialog,
  DialogContent, DialogActions, Box, Divider, Grid
} from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineContent,
    TimelineConnector,
    TimelineSeparator,
    TimelineDot, TimelineOppositeContent
} from '@mui/lab';
// utils
import {useSnackbar} from "notistack";
import {useEffect, useState} from "react";
import { fDateTime } from '../../../utils/formatTime';
import API_SECURED, {URL_TRANSACTION} from "../../../api/ApiSecured";

// ----------------------------------------------------------------------

OrderItemDetail.propTypes = {
  item: PropTypes.object.isRequired,
  isDeposit: PropTypes.bool.isRequired,
};

function OrderItemDetail({ item, isDeposit }) {
  const { commissionRate, commissionValue, created, currency, currencyFrom, currencyTo, fromNumber, id, innerFrom, innerTo, money, moneyWithCommission, reasonCancel, status, system, toNumber, type } = item;

  return (
      <Stack justifyContent="flex-start" direction="column">
          <Box mb={2} >
              <Typography variant="subtitle1">{isDeposit ? "Пополнение" : "Перевод"}</Typography>
          </Box>
          <Box mb={1} >
              <Typography variant="caption" color="text.disable">Дата платежа</Typography>
              <Typography variant="body1">{fDateTime(new Date(created))}</Typography>
              <Divider />
          </Box>
          <Box mb={1} >
              <Typography variant="caption" color="text.disable">Платеж</Typography>
              <Typography variant="body1">{money} {currency}</Typography>
              <Divider />
          </Box>
          <Box mb={1} >
              <Typography variant="caption" color="text.disable">Платеж c комиссией для отправителя</Typography>
              <Typography variant="body1">{moneyWithCommission} {currency}</Typography>
              <Divider />
          </Box>
          <Box mb={1} >
              <Typography variant="caption" color="text.disable">Статус</Typography>
              <Typography variant="body1">{status}</Typography>
              <Divider />
          </Box>
          {status === 'CANCELED' && (
              <Box mb={1} >
                  <Typography variant="caption" color="text.error">Причина отмены</Typography>
                  <Typography variant="body1">{reasonCancel}</Typography>
                  <Divider />
              </Box>
          )}
          <Box mb={1} >
              <Typography variant="caption" color="text.disable">Тип</Typography>
              <Typography variant="body1">{type}</Typography>
              <Divider />
          </Box>
          <Box mb={1} >
              <Typography variant="caption" color="text.disable">Отправитель</Typography>
              {/* eslint-disable-next-line no-nested-ternary */}
              <Typography variant="body1">{innerTo ? toNumber : (system ? "Система" : "Внешний")}</Typography>
              <Divider />
          </Box>
          <Box mb={1} >
              <Typography variant="caption" color="text.disable">Получатель</Typography>
              <Typography variant="body1">{innerFrom ? fromNumber : "Внешний"}</Typography>
              <Divider />
          </Box>
          <Box mb={1} >
              <Typography variant="caption" color="text.disable">Комиссия в процентах для отправителя</Typography>
              <Typography variant="body1">{commissionRate * 100} %</Typography>
              <Divider />
          </Box>
          <Box mb={1} >
              <Typography variant="caption" color="text.disable">Комиссия для отправителя</Typography>
              <Typography variant="body1">{commissionValue} {currency}</Typography>
              <Divider />
          </Box>
      </Stack>
  );
}

OrderItem.propTypes = {
  item: PropTypes.object,
  isLast: PropTypes.bool,
  isDeposit: PropTypes.bool
};

function OrderItem({ item, isLast, isDeposit }) {
  const { commissionRate, commissionValue, created, currency, currencyFrom, currencyTo, fromNumber, id, innerFrom, innerTo, money, moneyWithCommission, reasonCancel, status, system, toNumber, type } = item;
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
      setOpen(true);
  };

  const handleClose = () => {
      setOpen(false);
  };
  return (
    <TimelineItem>
        <Dialog open={open} onClose={handleClose} fullWidth>
            <DialogTitle>{`Транзакция ${id}`}</DialogTitle>
            <DialogContent>
                <OrderItemDetail item={item} isDeposit={isDeposit} />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>Закрыть</Button>
            </DialogActions>
        </Dialog>
        <TimelineOppositeContent>
            <Typography variant="subtitle1">{isDeposit ? "Пополнение" : "Перевод"}</Typography>
        </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineDot
          sx={{
            bgcolor:
              (status === 'CLOSED' && 'success.main') ||
              (status === 'CANCEL' && 'error.main') ||
              (status === 'HOLD' && 'info.main') ||
              'primary.main'
          }}
        />
        {isLast ? null : <TimelineConnector />}
      </TimelineSeparator>
      <TimelineContent>
        <Typography variant="subtitle2">{`${money} ${currency}`}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {fDateTime(new Date(created))}
        </Typography>
        <Button size="small" sx={{ ml: 1 }} color="secondary" onClick={handleClickOpen}>
          ...
        </Button>
      </TimelineContent>
    </TimelineItem>
  );
}

AppOrderTimeline.propTypes = {
  number: PropTypes.string.isRequired
}

export default function AppOrderTimeline({ number }) {
  const {enqueueSnackbar} = useSnackbar();
  const [transactions, setTransactions] = useState([])
  const [page, setPage] = useState({
    number: 0,
    max: undefined
  })
  console.log(transactions)
  console.log(page)
  useEffect(() => {
    loadNewTransactions(0)
  }, [])

  const loadNewTransactions = (pageNumber) => {
    API_SECURED.get(`${URL_TRANSACTION}api/transaction/account/${number}?page=${pageNumber}&size=5`)
        .then(res => {
          console.log(res.data)
          setPage({
            number: pageNumber,
            max: res.data.totalPages
          })
          if (transactions) {
            setTransactions([...transactions, ...res.data.content])
          } else {
            setTransactions([...res.data.content])
          }
        })
        .catch(reason => {
          console.log(reason)
          enqueueSnackbar(`Ошибка: ${reason}`, { variant: "error" })
        })
  }

  return (
    <Grid item xs={12} sm={6} md={6} padding={1}>
      <Card>
        <CardHeader title="Операции" />
        <CardContent>
          {transactions.length === 0 ? (
            <Typography variant="body2" color="text.disabled" >
              Нет операций
            </Typography>
          ) : (
            <div>
              <Timeline>
                {transactions.map((item, index) => (
                  <OrderItem
                    key={item.id}
                    item={item}
                    isLast={index === transactions.length - 1 && page.number === page.max - 1}
                    isDeposit={item.fromNumber !== number}/>
                ))}
              </Timeline>
              {page.number !== page.max - 1 && (
                <Button onClick={() => loadNewTransactions(page.number + 1)}>
                  Еще...
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

//         sx={{
//           '& .MuiTimelineItem-missingOppositeContent:before': {
//             display: 'none'
//           }
//         }}
