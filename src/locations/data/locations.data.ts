// Definimos un tipo para nuestro objeto de ubicaciones,
// indicando que puede ser indexado por cualquier string y devolverá un array de strings.
type LocationsType = {
  [key: string]: string[];
};

export const locationsData: LocationsType = {
  'Buenos Aires': ['Azul', 'Bahía Blanca', 'La Plata', 'Mar del Plata', 'Tandil'],
  'Córdoba': ['Río Cuarto', 'Capital', 'General San Martín', 'Villa María', 'Carlos Paz'],
  'Santa Fe': ['Rosario', 'La Capital', 'General López', 'Rafaela', 'Venado Tuerto'],
  'La Pampa': ['Capital', 'Maracó', 'Realicó', 'General Pico', 'Santa Rosa'],
  'Entre Ríos': ['Paraná', 'Concordia', 'Gualeguaychú', 'Colón', 'Uruguay'],
  'Salta': ['Anta', 'Cachi', 'Cafayate', 'Capital', 'Cerrillos', 'Chicoana', 'General Güemes', 'Iruya', 'La Caldera', 'La Candelaria', 'La Poma', 'La Viña', 'Los Andes', 'Metán', 'Molinos', 'Orán', 'Rivadavia', 'Rosario de la Frontera', 'Rosario de Lerma', 'San Carlos', 'Santa Victoria']
};

export const provincias = Object.keys(locationsData);
