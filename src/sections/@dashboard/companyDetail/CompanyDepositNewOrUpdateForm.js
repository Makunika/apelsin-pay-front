import {useLocation, useNavigate} from 'react-router-dom';
// material
import {Container, Stack, Typography, CircularProgress, Box} from '@mui/material';
// components
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import PropTypes from "prop-types";
import {alpha} from "@mui/material/styles";
import Page from '../../../components/Page';
//
import API_SECURED, {URL_ACCOUNT_BUSINESS, URL_ACCOUNT_PERSONAL} from "../../../api/ApiSecured";
import DepositTypeDetail from "../depositDetail/DepositTypeDetail";
import {fillTypeDataBusiness} from "../../../utils/depositUtils";

CompanyDepositNewOrUpdateForm.propTypes = {
  companyUser: PropTypes.object.isRequired,
  updateInfo: PropTypes.shape({
    deposit: PropTypes.object.isRequired,
    type: PropTypes.object.isRequired
  })
}

export default function CompanyDepositNewOrUpdateForm({ companyUser, updateInfo }) {
  const isUpdate = updateInfo != null
  const [isLoading, setLoading] = useState(true)
  const [types, setTypes] = useState([])
  const {enqueueSnackbar} = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    API_SECURED.get(`${URL_ACCOUNT_BUSINESS}api/business/type`)
      .then(res => {
        setTypes(res.data)
        setLoading(false)
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка: ${reason}`, { variant: "error" })
      })
  }, [])

  const handleNew = (type) => {
    console.log("ok")
    setLoading(true)
    const data = {
      typeId: type.id
    }
    API_SECURED.post(`${URL_ACCOUNT_PERSONAL}api/personal/`, data)
      .then(res => {
        setLoading(false)
        enqueueSnackbar("Счет создан", {variant: "success"})
        navigate(`/dashboard/deposit?${res.data.number}`, { replace: true })
      })
      .catch(reason => {
        console.log(reason)
        setLoading(false)
        let msg = reason.response.data.message;
        if (msg.includes("Limit")) {
          msg = "Превышен лимит счетов"
        }
        enqueueSnackbar(`Ошибка: ${msg}`, { variant: "error" })
      })
  }

  if (isLoading) {
    return (
      <Page>
        <Container>
          <Stack direction="column" alignItems="center" justifyContent="center" mt={5}>
            <CircularProgress />
          </Stack>
        </Container>
      </Page>
    )
  }

  return (
    <Container>
      {isUpdate && (
        <div>
          <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
            <Typography variant="h6" gutterBottom>
              Активный тип счета
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" flexWrap="wrap" mb={5}>
            <DepositTypeDetail valid={updateInfo.type.valid}
                               name={updateInfo.type.name}
                               description={updateInfo.type.description}
                               type={fillTypeDataBusiness(updateInfo.type)}
                               showTitle
                               defaultExpanded
            />
          </Stack>
        </div>
      )}
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h6" gutterBottom>
          Выберите тип счета
        </Typography>
      </Stack>
      <Stack direction="row" justifyContent="flex-start" alignItems="flex-start" flexWrap="wrap" mb={5}>
        {types.filter(value => value.id !== updateInfo.type.id).map((value, index) => (
          <DepositTypeDetail
            key={value.id}
            name={value.name}
            description={value.description}
            type={fillTypeDataBusiness(value)}
            handleButton={handleNew}
            titleButton="Выбрать"
            showTitle={false}
            defaultExpanded
            valid={value.valid}
          />
        ))}
      </Stack>
    </Container>
  );
}