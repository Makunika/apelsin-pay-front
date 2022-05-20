import PropTypes from "prop-types";
import {Box, Divider, Typography} from "@mui/material";

SimpleDataVisible.propTypes = {
  label: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  withDivider: PropTypes.bool,
  mb: PropTypes.number,
  colorTitle: PropTypes.oneOf(
    ["text.disable", "text.error"]
  )
}

export default function SimpleDataVisible({
                                            label,
                                            text,
                                            withDivider = true,
                                            mb = 1,
                                            colorTitle = 'text.disable'
}) {
  return (
    <Box mb={mb} >
      <Typography variant="caption" color={colorTitle}>{label}</Typography>
      <Typography variant="body1">{text}</Typography>
      {withDivider && (
        <Divider />
      )}
    </Box>
  )
}