import PropTypes from 'prop-types';
// material
import { styled } from '@mui/material/styles';
import {
  Card,
  Grid,
  Typography,
  CardContent,
  CardHeader
} from '@mui/material';
// utils
import {LoadingButton} from "@mui/lab";
//
import SimpleAccordion from "../../../components/SimpleAccordion";

const InfoStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-end',
  marginTop: theme.spacing(3),

}));

DepositTypeDetail.propTypes = {
  type: PropTypes.arrayOf(PropTypes.shape({
    description: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })).isRequired,
  showTitle: PropTypes.bool,
  titleButton: PropTypes.string,
  handleButton: PropTypes.func,
  defaultExpanded: PropTypes.bool,
  loading: PropTypes.bool,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  valid: PropTypes.bool.isRequired,
  sx: PropTypes.object,
  typeReturned: PropTypes.object
};

export default function DepositTypeDetail({ loading, type, name, description, valid, showTitle, titleButton, handleButton, defaultExpanded, sx, typeReturned }) {
  return (
    <Grid item xs={12} sm={6} md={6} padding={1}>
      <Card
        sx={{ ...sx }}
      >
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

          {type.map((value, index) =>
            <SimpleAccordion key={index} title={value.description} body={value.value} defaultExpanded={defaultExpanded} />
          )}

          <InfoStyle>
            {!valid && <Typography color="warning">Архивный</Typography>}
            {handleButton && (
                <LoadingButton
                  loading={loading}
                  onClick={() => {
                    handleButton(typeReturned)
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
