import PropTypes from 'prop-types';
// material
import {
    Card,
    Grid,
    CardContent,
    CardHeader,
    Stack,
    TextField,
    InputAdornment,
    MenuItem
} from '@mui/material';
// utils
//
import {useSnackbar} from "notistack";
import * as Yup from "yup";
import {Form, FormikProvider, useFormik} from "formik";
import axios from "axios";
import {DesktopDatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import {LoadingButton} from "@mui/lab";
import {BASE_URL, URL_INFO_PERSONAL} from "../../../api/ApiSecured";

// ----------------------------------------------------------------------

const currencies = [
    {
        value: 'USD',
        label: '$',
        valueStr: 'Доллар'
    },
    {
        value: 'EUR',
        label: '€',
        valueStr: 'Евро'
    },
    {
        value: 'RUB',
        label: '฿',
        valueStr: 'Рубль'
    }
];

TransactionOpenForm.propTypes = {
    number: PropTypes.string.isRequired
};

function TransactionOpenForm({ number }) {

    const {enqueueSnackbar} = useSnackbar();

    const RegisterSchema = Yup.object().shape({
        number: Yup.string()
            .length(20, 'Номер счета состоит из 20 символов')
            .required('Номер счета обязателен'),
        money: Yup.number()
            .positive("Число должно быть положительным")
            .required('Обязательно')
    });

    const formik = useFormik({
        initialValues: {
            number: '',
            money: 0.00,
            currency: currencies[2]
        },
        validationSchema: RegisterSchema,
        onSubmit: (values) => {
            console.log(values)
            console.log(JSON.stringify(values))
        }
    });

    const { errors, touched, values, handleSubmit, isSubmitting, getFieldProps } = formik;

    return (
        <FormikProvider value={formik}>
            <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        type="text"
                        label="Номер счета"
                        placeholder="00000000000000000000"
                        {...getFieldProps('number')}
                        error={Boolean(touched.number && errors.number)}
                        helperText={touched.number && errors.number}
                    />

                    <TextField
                        fullWidth
                        autoComplete="money"
                        type="number"
                        label="Количество денег"
                        startAdornment={<InputAdornment position="start">{values.currency.label}</InputAdornment>}
                        {...getFieldProps('money')}
                        error={Boolean(touched.money && errors.money)}
                        helperText={touched.money && errors.money}
                        onBlur={() => {
                            console.log("Хехе")
                        }}
                    />

                    <TextField
                        select
                        label="Валюта"
                        {...getFieldProps('currency')}
                        error={Boolean(touched.currency && errors.currency)}
                        helperText={touched.currency && errors.currency}
                    >
                        {currencies.map((option) => (
                            <MenuItem key={option.value} value={option}>
                                {option.valueStr}
                            </MenuItem>
                        ))}
                    </TextField>

                    <LoadingButton
                        fullWidth
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isSubmitting}
                    >
                        Отправить
                    </LoadingButton>
                </Stack>
            </Form>
        </FormikProvider>
    )
}

TransactionOpen.propTypes = {
    number: PropTypes.string.isRequired
};

export default function TransactionOpen({ number }) {


    return (
        <Grid item xs={12} sm={6} md={6} padding={1} id="transactionOpen">
            <Card>
                <CardHeader title="Перевести деньги" />
                <CardContent>
                    <TransactionOpenForm number={number} />
                </CardContent>
            </Card>
        </Grid>
    );
}
