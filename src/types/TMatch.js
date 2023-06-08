import T from 'prop-types';

const TMatch = T.shape({
  id: T.number.isRequired,
  distance: T.number.isRequired,
  entity: T.shape({
    filename: T.string.isRequired,
    file_seq_id: T.string.isRequired,
    file_timestamp: T.number.isRequired,
    image_url: T.string.isRequired,
    site_name: T.string.isRequired,
    subsite_name: T.string.isRequired,
    clip_offset_in_file: T.number.isRequired
  }).isRequired
});

export default TMatch;
