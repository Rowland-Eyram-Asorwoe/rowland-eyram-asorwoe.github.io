import { STATUSES, PRODUCTS, makeTask, taskTitle, nextStatus, updateCart, cartItems, cartTotal, cartCount, escapeHTML } from './model.js';

const menu = document.querySelector('#menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menu.setAttribute('aria-expanded', 'false');
  navigation.dataset.open = 'false';
}
function toggleMenu() {
  const opening = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(opening));
  navigation.dataset.open = String(opening);
}
navigation.addEventListener('click', event => {
  if (event.target.closest('a')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menu.focus();
  }
});
window.matchMedia('(min-width:761px)').addEventListener('change', event => {
  if (event.matches) closeMenu();
});

const dialog = document.querySelector('#project-dialog');
const root = document.querySelector('#demo-root');
const closeButton = document.querySelector('#dialog-close');
let lastTrigger;
let currentProject;
let nextTaskId = 4;
let tasks = [
  { id: 1, title: 'Design the responsive layout', status: 0 },
  { id: 2, title: 'Connect the REST endpoints', status: 1 },
  { id: 3, title: 'Validate sign-in inputs', status: 2 }
];
let deletedTask = null;
let editingTask = null;
let cart = {};
let storeCategory = 'All products';
const currency = new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS', maximumFractionDigits: 0 });

const projects = {
  tasks: { title: 'Full Stack Task Manager', eyebrow: 'Web application / sample recreation', description: 'The CV project uses React, Node.js, Express, MongoDB, and JWT. This small browser demo lets you create, edit, move, and remove tasks.' },
  store: { title: 'E-Commerce Platform', eyebrow: 'E-commerce / sample recreation', description: 'The CV project uses React, Express, PostgreSQL, and Stripe. Explore a sample catalog, manage a cart, and review an example order.' },
  ml: { title: 'AI Chest X-ray Classification', eyebrow: 'Machine learning / academic project', description: 'Rowland’s KNUST dissertation explores chest X-ray classification using machine learning. The CV describes a Python and TensorFlow project with preprocessing, CNN training, and graphical prediction visualization.' },
  portfolio: { title: 'Responsive Portfolio Website', eyebrow: 'Web development / the site you’re visiting', description: 'A new portfolio created from Rowland’s CV, using HTML5, CSS3, and JavaScript to make the work easy to explore on different screens.' }
};

function announce(message) {
  const status = root.querySelector('#demo-status') || document.querySelector('#global-status');
  status.textContent = message;
}
function focusWithin(selector) {
  root.querySelector(selector)?.focus({ preventScroll: true });
}
function openProject(key, trigger) {
  if (!projects[key]) return;
  lastTrigger = trigger;
  currentProject = key;
  editingTask = null;
  document.querySelector('#dialog-title').textContent = projects[key].title;
  document.querySelector('#dialog-eyebrow').textContent = projects[key].eyebrow;
  document.querySelector('#dialog-description').textContent = projects[key].description;
  if (key === 'tasks') mountTasks();
  if (key === 'store') mountStore();
  if (key === 'ml') mountWorkflow();
  if (key === 'portfolio') mountPortfolio();
  dialog.showModal();
  document.body.classList.add('modal-open');
  dialog.scrollTop = 0;
  closeButton.focus({ preventScroll: true });
}
dialog.addEventListener('close', () => {
  document.body.classList.remove('modal-open');
  currentProject = null;
  lastTrigger?.focus({ preventScroll: true });
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});

function mountTasks() {
  root.innerHTML = `<div class="demo-notice">Example task data · runs in your browser · refreshing the page resets the demo. No account or sign-in is needed.</div>
    <form class="add-task-form" id="add-task-form" novalidate>
      <label class="field-label" for="new-task">Add something to work on</label>
      <div class="input-row"><input class="text-input" id="new-task" name="task" placeholder="For example, review the home page" maxlength="80" autocomplete="off" aria-describedby="task-error"><button class="button button-primary" type="submit">Add task <span aria-hidden="true">＋</span></button></div>
      <p class="input-error" id="task-error"></p>
    </form><div class="task-board" id="task-board"></div><div class="demo-status" id="demo-status" role="status" aria-live="polite"></div><div id="undo-area"></div>`;
  renderTasks();
}
function renderTasks(focusSelector) {
  const board = root.querySelector('#task-board');
  board.innerHTML = STATUSES.map((status, index) => {
    const columnTasks = tasks.filter(task => task.status === index);
    return `<section class="task-column" aria-label="${status}"><h3>${status}<span>${columnTasks.length} ${columnTasks.length === 1 ? 'task' : 'tasks'}</span></h3>${columnTasks.length ? columnTasks.map(taskMarkup).join('') : '<p class="empty-column">No tasks here yet.</p>'}</section>`;
  }).join('');
  root.querySelector('#undo-area').innerHTML = deletedTask ? '<button class="undo-button" id="undo-task" onclick="window.portfolio.handleDemoClick(event)">Undo last removal</button>' : '';
  if (focusSelector) focusWithin(focusSelector);
}
function taskMarkup(task) {
  if (editingTask === task.id) {
    return `<article class="task-card"><form class="edit-form" data-edit-form="${task.id}" novalidate><label class="field-label" for="edit-title">Task title</label><input class="text-input" id="edit-title" name="title" value="${escapeHTML(task.title)}" maxlength="80" aria-describedby="edit-error"><p class="edit-error" id="edit-error"></p><div class="edit-actions"><button class="button button-primary" type="submit">Save task</button><button class="button button-secondary" type="button" data-cancel-edit="${task.id}" onclick="window.portfolio.handleDemoClick(event)">Cancel</button></div></form></article>`;
  }
  const move = task.status === 2 ? 'Reopen' : 'Move →';
  const moveLabel = task.status === 2 ? `Move ${task.title} back to To do` : `Move ${task.title} to ${STATUSES[task.status + 1]}`;
  return `<article class="task-card"><p>${escapeHTML(task.title)}</p><div class="task-actions"><button data-move="${task.id}" onclick="window.portfolio.handleDemoClick(event)" aria-label="${escapeHTML(moveLabel)}">${move}</button><button data-edit="${task.id}" onclick="window.portfolio.handleDemoClick(event)" aria-label="Edit ${escapeHTML(task.title)}">Edit</button><button data-remove="${task.id}" onclick="window.portfolio.handleDemoClick(event)" aria-label="Remove ${escapeHTML(task.title)}">Remove</button></div></article>`;
}

function productArt(id) {
  const paths = {
    headphones: '<path d="M24 63V45a36 36 0 0 1 72 0v18" fill="none" stroke="currentColor" stroke-width="11"/><rect x="16" y="51" width="20" height="38" rx="9" fill="currentColor"/><rect x="84" y="51" width="20" height="38" rx="9" fill="currentColor"/>',
    keyboard: '<rect x="10" y="31" width="100" height="46" rx="5" fill="currentColor"/><path d="M23 44h75M23 53h75M40 66h39" stroke="#e9f2ee" stroke-width="4" stroke-dasharray="6 3"/>',
    backpack: '<path d="M43 25v-6a17 17 0 0 1 34 0v6" fill="none" stroke="currentColor" stroke-width="6"/><rect x="28" y="21" width="64" height="70" rx="16" fill="currentColor"/><rect x="39" y="55" width="42" height="24" rx="7" fill="#94b9a7"/><path d="M36 44h48M44 64h32" stroke="#e9f2ee" stroke-width="2"/>',
    lamp: '<path d="M29 81h63M60 78V51l19-24" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round"/><path d="M64 19q17-10 32 5l-23 22z" fill="currentColor"/><circle cx="60" cy="51" r="6" fill="currentColor"/>'
  };
  return `<svg viewBox="0 0 120 100" aria-hidden="true">${paths[id]}</svg>`;
}
function mountStore() {
  root.innerHTML = `<div class="demo-notice">Sample catalog and prices in Ghana cedis (GHS) · no payment processing or real orders · refreshing resets the cart.</div>
    <div class="filter-buttons" aria-label="Filter sample products">${['All products', 'Equipment', 'Accessories'].map(category => `<button class="filter-button" data-category="${category}" onclick="window.portfolio.handleDemoClick(event)" aria-pressed="${category === storeCategory}">${category}</button>`).join('')}</div>
    <div class="store-layout"><div class="store-grid" id="store-products"></div><aside class="cart-panel" id="cart-panel" aria-label="Sample shopping cart"></aside></div><div class="demo-status" id="demo-status" role="status" aria-live="polite"></div>`;
  renderStore();
}
function renderStore(focusSelector) {
  const visible = PRODUCTS.filter(product => storeCategory === 'All products' || product.category === storeCategory);
  root.querySelector('#store-products').innerHTML = visible.map(product => `<article class="product-item"><div class="product-art">${productArt(product.id)}</div><h3>${product.name}</h3><p class="product-price">${currency.format(product.price)}</p><button class="button button-secondary" data-add-product="${product.id}" onclick="window.portfolio.handleDemoClick(event)" aria-label="Add ${product.name} to cart" ${(cart[product.id] || 0) >= 99 ? 'disabled' : ''}>${(cart[product.id] || 0) >= 99 ? 'Quantity limit reached' : 'Add to cart ＋'}</button></article>`).join('');
  const items = cartItems(cart);
  root.querySelector('#cart-panel').innerHTML = `<h3>Your cart <span>(${cartCount(cart)})</span></h3>${items.length ? items.map(product => `<div class="cart-item"><strong>${product.name}</strong><div class="cart-item-details"><div class="quantity-controls"><button class="quantity-button" data-minus="${product.id}" onclick="window.portfolio.handleDemoClick(event)" aria-label="Remove one ${product.name}">−</button><span aria-label="Quantity">${product.quantity}</span><button class="quantity-button" data-plus="${product.id}" onclick="window.portfolio.handleDemoClick(event)" aria-label="Add one ${product.name}" ${product.quantity >= 99 ? 'disabled' : ''}>＋</button></div><span>${currency.format(product.price * product.quantity)}</span></div></div>`).join('') : '<p class="cart-empty">Your cart is empty. Add a product to try it out.</p>'}<div class="cart-total"><span>Sample subtotal</span><strong>${currency.format(cartTotal(cart))}</strong></div><button class="button button-primary" id="review-order" onclick="window.portfolio.handleDemoClick(event)" ${items.length ? '' : 'disabled'}>Review sample order <span aria-hidden="true">↗</span></button><p class="cart-disclaimer">Example prices only. Shipping and taxes are not calculated. No payment details are collected.</p><div class="order-preview" id="order-preview" hidden></div>`;
  if (focusSelector) focusWithin(focusSelector);
}

const workflow = [
  { title: 'Prepare the image data', label: 'Prepare images', description: 'Organize the dataset, resize images to consistent dimensions, and normalize pixel values before training. This is an illustrative workflow, not the original dissertation code.', code: '# Illustrative preprocessing\nimage = resize(image, target_size)\nnormalized = image / 255.0\n# Keep training and test data separate.' },
  { title: 'Build and train a CNN', label: 'Train a CNN', description: 'Use convolutional layers to learn visual features, then train the classifier on prepared data. The CV lists Python, TensorFlow, and CNNs; no original model weights or training metrics were supplied.', code: '# Conceptual TensorFlow structure\nmodel = Sequential([\n    Conv2D(32, 3, activation="relu"),\n    MaxPooling2D(),\n    Flatten(),\n    Dense(classes, activation="softmax")\n])' },
  { title: 'Generate model predictions', label: 'Predict', description: 'A trained model can map a prepared image to class probabilities. This portfolio does not run a model, accept medical images, or produce clinical predictions.', code: '# Illustrative inference step\nprobabilities = model.predict(batch)\nclass_index = argmax(probabilities)\n# Requires a trained, evaluated model.' },
  { title: 'Visualize and review the output', label: 'Review output', description: 'Display predictions alongside the source image to make outputs easier to examine. A medical model needs rigorous validation and expert review; this sample demonstrates the workflow only.', code: '# Conceptual visualization\nshow_image(source_image)\nplot_class_probabilities(probabilities)\n# No clinical results are shown here.' }
];
function mountWorkflow() {
  const schematic = document.querySelector('.chest-frame svg').outerHTML;
  root.innerHTML = `<div class="demo-notice">Interactive workflow illustration · schematic image · no medical inference or original model results.</div><div class="workflow-buttons" aria-label="Explore the research steps">${workflow.map((step, index) => `<button class="step-button" data-step="${index}" onclick="window.portfolio.handleDemoClick(event)" aria-pressed="${index === 0}">${index + 1}. ${step.label}</button>`).join('')}</div><div class="workflow-layout"><div class="research-schematic" aria-hidden="true">${schematic}<span>Schematic illustration of a chest.<br>No patient image or medical data.</span></div><div class="workflow-panel" id="workflow-panel" aria-live="polite"></div></div><div class="demo-status" id="demo-status" role="status" aria-live="polite"></div>`;
  renderWorkflow(0);
}
function renderWorkflow(index) {
  const step = workflow[index];
  root.querySelectorAll('[data-step]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.step) === index)));
  root.querySelector('#workflow-panel').innerHTML = `<p class="workflow-heading">Step ${index + 1} of ${workflow.length}</p><h3>${step.title}</h3><p>${step.description}</p><pre><code>${escapeHTML(step.code)}</code></pre>`;
}
function mountPortfolio() {
  root.innerHTML = `<div class="demo-notice">This is the new live portfolio. Its project samples were created from CV descriptions; they do not claim to be the original deployed applications.</div><div class="portfolio-details"><div class="portfolio-detail"><h3>Built on web fundamentals</h3><p>Semantic HTML, responsive CSS, and small JavaScript modules. Fonts and visual assets are hosted with the site.</p></div><div class="portfolio-detail"><h3>Ready for different screens</h3><p>A responsive layout, mobile navigation, and project previews that adapt to smaller devices.</p></div><div class="portfolio-detail"><h3>Considerate interactions</h3><p>Keyboard-accessible controls, visible focus, reduced-motion support, and project dialogs you can close with Escape.</p></div><div class="portfolio-detail"><h3>A direct way to connect</h3><p>Working email and telephone links, plus the original CV available as a PDF download.</p></div></div><div class="portfolio-end"><a class="button button-primary" href="assets/rowland-asorwoe-cv.pdf" download>Download the CV <span aria-hidden="true">↗</span></a><a class="button button-secondary" href="mailto:rorosorwoe@gmail.com">Email Rowland <span aria-hidden="true">↗</span></a></div>`;
}

root.addEventListener('submit', event => {
  event.preventDefault();
  if (event.target.id === 'add-task-form') {
    const input = root.querySelector('#new-task');
    const error = root.querySelector('#task-error');
    try {
      const task = makeTask(nextTaskId, input.value);
      nextTaskId += 1;
      tasks.push(task);
      input.value = '';
      error.textContent = '';
      input.removeAttribute('aria-invalid');
      renderTasks();
      announce(`Added ${task.title} to To do.`);
      input.focus();
    } catch (failure) {
      error.textContent = failure.message;
      input.setAttribute('aria-invalid', 'true');
      input.focus();
    }
  }
  const editForm = event.target.closest('[data-edit-form]');
  if (editForm) {
    const input = editForm.querySelector('[name="title"]');
    const task = tasks.find(item => item.id === Number(editForm.dataset.editForm));
    try {
      task.title = taskTitle(input.value);
      editingTask = null;
      renderTasks(`[data-edit="${task.id}"]`);
      announce('Task title updated.');
    } catch (failure) {
      editForm.querySelector('#edit-error').textContent = failure.message;
      input.setAttribute('aria-invalid', 'true');
      input.focus();
    }
  }
});
root.addEventListener('input', event => {
  if (event.target.id === 'new-task') {
    root.querySelector('#task-error').textContent = '';
    event.target.removeAttribute('aria-invalid');
  }
});
function handleDemoClick(event) {
  const button = event.target.closest('button');
  if (!button || button.disabled) return;
  if (currentProject === 'tasks') {
    if (button.dataset.move) {
      const task = tasks.find(item => item.id === Number(button.dataset.move));
      task.status = nextStatus(task.status);
      editingTask = null;
      renderTasks(`[data-move="${task.id}"]`);
      announce(`${task.title} moved to ${STATUSES[task.status]}.`);
    }
    if (button.dataset.edit) {
      editingTask = Number(button.dataset.edit);
      renderTasks('#edit-title');
      root.querySelector('#edit-title').select();
    }
    if (button.dataset.cancelEdit) {
      const id = Number(button.dataset.cancelEdit);
      editingTask = null;
      renderTasks(`[data-edit="${id}"]`);
      announce('Editing cancelled.');
    }
    if (button.dataset.remove) {
      const id = Number(button.dataset.remove);
      deletedTask = { task: tasks.find(item => item.id === id), index: tasks.findIndex(item => item.id === id) };
      tasks = tasks.filter(item => item.id !== id);
      editingTask = null;
      renderTasks('#undo-task');
      announce('Task removed. Use Undo last removal to restore it.');
    }
    if (button.id === 'undo-task' && deletedTask) {
      const { task, index } = deletedTask;
      tasks.splice(index, 0, task);
      deletedTask = null;
      renderTasks(`[data-edit="${task.id}"]`);
      announce('Task restored.');
    }
  }
  if (currentProject === 'store') {
    if (button.dataset.category) {
      storeCategory = button.dataset.category;
      root.querySelectorAll('[data-category]').forEach(filter => filter.setAttribute('aria-pressed', String(filter.dataset.category === storeCategory)));
      renderStore();
      announce(`${root.querySelectorAll('.product-item').length} products shown.`);
    }
    const id = button.dataset.addProduct || button.dataset.plus || button.dataset.minus;
    if (id) {
      const decrement = Boolean(button.dataset.minus);
      cart = updateCart(cart, id, decrement ? -1 : 1);
      const selector = button.dataset.addProduct ? `[data-add-product="${id}"]` : button.dataset.minus ? `[data-minus="${id}"]` : `[data-plus="${id}"]`;
      renderStore();
      const target = root.querySelector(selector);
      if (target && !target.disabled) target.focus({ preventScroll: true });
      else if (decrement) focusWithin(`[data-add-product="${id}"]`);
      else focusWithin(`[data-minus="${id}"]`);
      announce(`Cart updated. ${cartCount(cart)} items. Sample subtotal ${currency.format(cartTotal(cart))}.`);
    }
    if (button.id === 'review-order' && cartCount(cart) > 0) {
      const preview = root.querySelector('#order-preview');
      preview.hidden = false;
      preview.innerHTML = `<h4>Sample order preview</h4><p>${cartItems(cart).map(product => `${product.quantity} × ${product.name}`).join('<br>')}</p><p><strong>Sample subtotal: ${currency.format(cartTotal(cart))}</strong></p><p>No order was placed and no payment was taken. This is a portfolio demo.</p>`;
      announce('Sample order preview is ready. No order was placed.');
    }
  }
  if (currentProject === 'ml' && button.dataset.step !== undefined) renderWorkflow(Number(button.dataset.step));
}
window.portfolio = { toggleMenu, openProject, closeProject: () => dialog.close(), handleDemoClick };
