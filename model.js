export const STATUSES = Object.freeze(['To do', 'In progress', 'Done']);
export const PRODUCTS = Object.freeze([
  { id: 'headphones', name: 'Studio headphones', category: 'Equipment', price: 280 },
  { id: 'keyboard', name: 'Compact keyboard', category: 'Equipment', price: 190 },
  { id: 'backpack', name: 'Everyday backpack', category: 'Accessories', price: 150 },
  { id: 'lamp', name: 'Desk light', category: 'Accessories', price: 120 }
]);
export function taskTitle(value) {
  if (typeof value !== 'string') throw new Error('Enter a task title.');
  const title = value.trim().replace(/\s+/g, ' ');
  if (!title) throw new Error('Enter a title for your task.');
  if (title.length > 80) throw new Error('Use 80 characters or fewer.');
  return title;
}
export function makeTask(id, title) {
  return { id, title: taskTitle(title), status: 0 };
}
export function nextStatus(status) {
  if (!Number.isInteger(status) || status < 0 || status >= STATUSES.length) throw new Error('Unknown task status.');
  return (status + 1) % STATUSES.length;
}
export function updateCart(cart, productId, change) {
  if (!PRODUCTS.some(product => product.id === productId)) throw new Error('Unknown product.');
  if (!Number.isInteger(change)) throw new Error('Quantity must be a whole number.');
  return { ...cart, [productId]: Math.max(0, Math.min(99, (cart[productId] || 0) + change)) };
}
export function cartItems(cart) {
  return PRODUCTS.filter(product => cart[product.id] > 0).map(product => ({ ...product, quantity: cart[product.id] }));
}
export function cartTotal(cart) {
  return cartItems(cart).reduce((total, product) => total + product.price * product.quantity, 0);
}
export function cartCount(cart) {
  return cartItems(cart).reduce((total, product) => total + product.quantity, 0);
}
export function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));
}
