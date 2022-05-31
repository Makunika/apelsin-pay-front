// material
import {
  Container,
  Stack,
  Typography,
  CircularProgress,
  Box,
  Button, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
// components
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import Page from '../components/Page';
//
import API_SECURED, {URL_ACCOUNT_BUSINESS, URL_ACCOUNT_PERSONAL} from "../api/ApiSecured";
import TabsTypesList from "../sections/@dashboard/typeModerate/TabsTypesList";
import {fillTypeDataBusiness, fillTypeDataPersonal} from "../utils/depositUtils";
import Iconify from "../components/Iconify";
import BusinessNewTypeForm from "../sections/@dashboard/typeModerate/BusinessNewTypeForm";
import PersonalNewTypeForm from "../sections/@dashboard/typeModerate/PersonalNewTypeForm";
import {errorHandler} from "../utils/errorUtils";

export default function TypeModerate() {
  const [isLoading, setLoading] = useState(true)
  const [openNewBusiness, setOpenNewBusiness] = useState(false)
  const [openNewPersonal, setOpenNewPersonal] = useState(false)
  const [refreshState, refresh] = useState(1);
  const [types, setTypes] = useState({
    actualPersonalTypes: [],
    archivePersonalTypes: [],
    archiveBusinessTypes: [],
    actualBusinessTypes: []
  })
  const {enqueueSnackbar} = useSnackbar();

  useEffect(() => {
    let collectData = {
      actualPersonalTypes: [],
      archivePersonalTypes: [],
      archiveBusinessTypes: [],
      actualBusinessTypes: []
    }
    API_SECURED.get(`${URL_ACCOUNT_PERSONAL}api/type`)
      .then(res => {
        const actualType = res.data.filter(type => type.valid)
        const archiveType = res.data.filter(type => !type.valid)
        collectData = {
          ...collectData,
          actualPersonalTypes: [...actualType],
          archivePersonalTypes: [...archiveType]
        }
        return API_SECURED.get(`${URL_ACCOUNT_BUSINESS}api/business/type`)
      })
      .then(res => {
        const actualType = res.data.filter(type => type.valid)
        const archiveType = res.data.filter(type => !type.valid)
        collectData = {
          ...collectData,
          actualBusinessTypes: [...actualType],
          archiveBusinessTypes: [...archiveType]
        }
        setTypes(collectData)
        setLoading(false)
      })
      .catch(reason => {
        errorHandler(reason)
      })
  }, [refreshState])

  const handleBlockType = (isPersonal, type) => {
    const url = isPersonal ?
      `${URL_ACCOUNT_PERSONAL}api/type/${type.id}`
      :
      `${URL_ACCOUNT_BUSINESS}api/business/type/${type.id}`

    API_SECURED.delete(url)
      .then(() => {
        enqueueSnackbar("Счет успешно архивирован", { variant: "success" })
        refresh(Math.random())
      })
      .catch(reason => {
        errorHandler(reason)
      })
  }

  const handleCloseDialog = () => {
    setOpenNewPersonal(false)
    setOpenNewBusiness(false)
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
    <Page title="Типы | Апельсин pay">
      <Dialog open={openNewBusiness} onClose={handleCloseDialog}>
        <DialogTitle>Создание типа счета юридического лица</DialogTitle>
        <DialogContent>
          <Box mt={1}>
            <BusinessNewTypeForm refresh={(e) => {
              handleCloseDialog()
              refresh(e)
            }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleCloseDialog}>Отмена</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openNewPersonal} onClose={handleCloseDialog}>
        <DialogTitle>Создание типа счета юридического лица</DialogTitle>
        <DialogContent>
          <Box mt={1}>
            <PersonalNewTypeForm refresh={(e) => {
              handleCloseDialog()
              refresh(e)
            }} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button size="small" onClick={handleCloseDialog}>Отмена</Button>
        </DialogActions>
      </Dialog>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1}>
          <Typography variant="h4" gutterBottom>
            Типы счетов для физических лиц
          </Typography>
          <IconButton color="primary" size="large" onClick={() => setOpenNewPersonal(true)}>
            <Iconify icon="eva:plus-fill" />
          </IconButton>
        </Stack>
        <TabsTypesList
          archiveTypes={types.archivePersonalTypes}
          actualTypes={types.actualPersonalTypes}
          fillTypeData={fillTypeDataPersonal}
          handleArchive={(type) => handleBlockType(true, type)}
        />
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1} mt={3}>
          <Typography variant="h4" gutterBottom>
            Типы счетов для юридических лиц
          </Typography>
          <IconButton color="primary" size="large" onClick={() => setOpenNewBusiness(true)}>
            <Iconify icon="eva:plus-fill" />
          </IconButton>
        </Stack>
        <TabsTypesList
          archiveTypes={types.archiveBusinessTypes}
          actualTypes={types.actualBusinessTypes}
          fillTypeData={fillTypeDataBusiness}
          handleArchive={(type) => handleBlockType(false, type)}
        />
      </Container>
    </Page>
  );
}