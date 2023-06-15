export default function sitenameDisplay(result) {
  const {site_name, subsite_name} = result.entity;
  return `${site_name} (${subsite_name})`;
}
