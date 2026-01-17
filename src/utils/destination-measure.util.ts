import haversine from 'haversine';
export const destinationMeasure = (
  latPerson: number,
  lonPerson: number,
  latSite: number,
  lonSite: number,
  allowedKm: number = 0.1,
) => {
  const person = { latitude: latPerson, longitude: lonPerson };
  const site = { latitude: latSite, longitude: lonSite };
  const distanceKm = haversine(person, site, { unit: 'km' });
  return distanceKm <= allowedKm;
};
