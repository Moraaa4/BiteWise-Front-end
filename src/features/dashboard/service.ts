// Front-only dashboard service (SOA): data fetching stubs for the dashboard.
// Replace with real API integration later.

export async function fetchSuggestedRecipes() {
  // Simulate a fetch
  await new Promise((r) => setTimeout(r, 300));
  return [
    { id: 'r1', title: 'Pollo en salsa jitomate', time: '15min', img: '' },
    { id: 'r2', title: 'Arroz con verduras', time: '20min', img: '' },
    { id: 'r3', title: 'Tacos rápidos', time: '12min', img: '' },
  ];
}

export async function fetchIngredients() {
  await new Promise((r) => setTimeout(r, 200));
  return [
    { id: 'i1', name: 'Jitomate', qty: 4 },
    { id: 'i2', name: 'Pechuga pollo', qty: 2 },
    { id: 'i3', name: 'Cebolla', qty: 3 },
  ];
}
