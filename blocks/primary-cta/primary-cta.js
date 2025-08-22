export default function decorate(block) {
  block.classList.add('is-ready');

  // 1. Handle the image as background
  const pic = block.querySelector('picture, img');
  if (pic) {
    const img = pic.querySelector('img') || pic;
    const src = img.getAttribute('src');
    if (src) block.style.setProperty('--bg-img', `url("${src}")`);
    pic.remove(); // remove original image after use
  }

  // 2. Extract content fields: title, body, button
  const rows = [...block.children];
  const fields = {
    title: '',
    body: '',
    button: '',
  };

  rows.forEach((row, i) => {
    const text = row.textContent?.trim();
    if (!text) return;

    if (i === 0) fields.title = text;
    else if (i === 1) fields.body = text;
    else if (i === 2) fields.button = text;

    row.remove(); // clean up original
  });

  // 3. Build CTA panel structure
  const panel = document.createElement('div');
  panel.className = 'panel';

  if (fields.title) {
    const titleEl = document.createElement('h2');
    titleEl.textContent = fields.title;
    panel.append(titleEl);
  }

  if (fields.body) {
    const bodyEl = document.createElement('p');
    bodyEl.textContent = fields.body;
    panel.append(bodyEl);
  }

  if (fields.button) {
    const buttonEl = document.createElement('a');
    buttonEl.className = 'button';
    buttonEl.textContent = fields.button;
    buttonEl.href = '#'; // or dynamically set this if you support link input
