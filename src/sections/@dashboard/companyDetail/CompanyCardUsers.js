import PropTypes from 'prop-types';
// material
import {Card, CardContent, CardHeader, Grid, IconButton, Stack} from '@mui/material';
// utils
//
import {LoadingButton} from "@mui/lab";
import {useEffect, useState} from "react";
import {useSnackbar} from "notistack";
import SimpleDataVisible from "../../../components/SimpleDataVisible";
import apiSecured, {URL_INFO_BUSINESS, URL_INFO_PERSONAL} from "../../../api/ApiSecured";
import {fRoleCompany} from "../../../utils/formatEnum";
import Iconify from "../../../components/Iconify";
import {useAuthState} from "../../../context";

CompanyCardUsers.propTypes = {
  companyUser: PropTypes.object.isRequired,
  refresh: PropTypes.func,
  refreshState: PropTypes.number
};

export default function CompanyCardUsers({ companyUser, refresh, refreshState }) {
  const [isLoading, setLoading] = useState(true)
  const [isShowing, setShowing] = useState(false)
  const [users, setUsers] = useState([])
  const {enqueueSnackbar} = useSnackbar();
  const {user} = useAuthState();

  useEffect(() => {
    apiSecured.get(`${URL_INFO_BUSINESS}company/${companyUser.company.id}/users`)
      .then(res => res.data)
      .then(async users => {
        try {
          console.log(users)
          const data = await Promise.all(users.map(async (u) => ({
              ...u,
              name: (await apiSecured.get(`${URL_INFO_PERSONAL}api/persons/user/${u.userId}/name`)).data
            })));
          console.log(data)
          setUsers(data)
          setLoading(false)
        } catch (e) {
          console.log("catch")
        }
      })
      .catch(reason => {
        console.log(reason)
        enqueueSnackbar(`Ошибка. Статус: ${reason.response.status} сообщение: ${reason.response.data.message}`, {variant: "error"})
      })
  }, [refreshState])

  return (
    <Grid item xs={12} sm={6} md={6} padding={1}>
      <Card >
        <CardHeader title="Доступ к компании" />
        <CardContent>
          <Stack direction="column" justifyContent="flex-start" spacing={2}>
            {users.map((cu, index) => (
              <Stack key={index} direction="row" justifyContent="space-between">
                <SimpleDataVisible
                  label={fRoleCompany(cu.roleCompany)}
                  text={cu.name}
                  withDivider={false}
                />
                {cu.userId !== user.id && (
                  <IconButton
                    onClick={() => console.log("[eq")}
                    color="secondary"
                  >
                    <Iconify icon="eva:close-outline" />
                  </IconButton>
                )}
              </Stack>
            ))}

            <LoadingButton
              loading={isLoading}
            >
              Добавить пользователя
            </LoadingButton>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
}
