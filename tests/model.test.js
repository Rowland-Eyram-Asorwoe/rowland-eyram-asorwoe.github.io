import test from 'node:test';
import assert from 'node:assert/strict';
import { makeTask, taskTitle, nextStatus, updateCart, cartTotal, cartCount, escapeHTML } from '../model.js';
test('blank and oversized task titles are rejected without losing useful text', () => {
  assert.throws(() => makeTask(1, '   '), /Enter a title/);
  assert.throws(() => taskTitle('a'.repeat(81)), /80 characters/);
  assert.equal(makeTask(1, '  Review   the interface  ').title, 'Review the interface');
});
test('a task completes and can be reopened without an invalid status', () => {
  let status = 0;
  status = nextStatus(status); assert.equal(status, 1);
  status = nextStatus(status); assert.equal(status, 2);
  status = nextStatus(status); assert.equal(status, 0);
  assert.throws(() => nextStatus(3), /Unknown/);
});
test('cart totals correctly count multiple products and removal', () => {
  let cart = updateCart({}, 'headphones', 2);
  cart = updateCart(cart, 'backpack', 1);
  assert.equal(cartCount(cart), 3);
  assert.equal(cartTotal(cart), 710);
  cart = updateCart(cart, 'headphones', -1);
  assert.equal(cartTotal(cart), 430);
  cart = updateCart(cart, 'backpack', -1);
  assert.equal(cartCount(cart), 1);
  assert.equal(cartTotal(cart), 280);
});
test('cart quantities stay bounded and malformed additions are rejected', () => {
  const cart = updateCart({}, 'keyboard', 100);
  assert.equal(cart.keyboard, 99);
  assert.equal(updateCart(cart, 'keyboard', -100).keyboard, 0);
  assert.equal(cart.keyboard, 99);
  assert.throws(() => updateCart({}, 'fake', 1), /Unknown product/);
  assert.throws(() => updateCart({}, 'keyboard', .5), /whole number/);
});
test('visitor task content cannot become executable HTML', () => {
  const title = '<img src=x onerror="x()"> & \'hello\'';
  const safe = escapeHTML(title);
  assert.equal(safe, '&lt;img src=x onerror=&quot;x()&quot;&gt; &amp; &#39;hello&#39;');
  assert.ok(!safe.includes('<'));
});
