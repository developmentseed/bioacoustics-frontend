import T from 'prop-types';

const TMatch = T.shape({
  id: T.number.isRequired,
  distance: T.number.isRequired,
  enitiy: T.shape({
    site_name: T.string.isRequired,
    subsite_name: T.string.isRequired,
    file_timestamp: T.number.isRequired,
  }).isRequired
});

export default TMatch;
