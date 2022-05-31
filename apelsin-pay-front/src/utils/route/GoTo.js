import PropTypes from 'prop-types';

function GoTo({ to }) {
  window.location = to
  return null;
}

GoTo.propTypes = {
  to: PropTypes.string.isRequired
};

export default GoTo;
