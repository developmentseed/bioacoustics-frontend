import T from 'prop-types';

const TMatch = T.shape({
  id: T.number.isRequired,
  distance: T.number.isRequired,
  entity: T.shape({
    file_seq_id: T.string.isRequired,
    file_timestamp: T.number.isRequired,
    image_url: T.string.isRequired,
    site_name: T.string.isRequired,
    subsite_name: T.string.isRequired,
  }).isRequired
});

export default TMatch;
