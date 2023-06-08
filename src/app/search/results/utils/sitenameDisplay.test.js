import sitenameDisplay from './sitenameDisplay';

describe('sitenameDisplay', () => {
  it('formats site name', () => {
    const result = { entity: { site_name: 'Site A', subsite_name: 'Dry-B'}};
    const name = sitenameDisplay(result);
    expect(name).toEqual('Site A (Dry-B)');
  });
});
