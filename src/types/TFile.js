import T from 'prop-types';

 const TFile = T.shape({
  lastModified: T.number.isRequired,
  name: T.string.isRequired,
  size: T.number.isRequired,
  type: T.string.isRequired,
});

export default TFile;
