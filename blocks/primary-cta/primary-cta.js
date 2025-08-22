export default function decorate(block) {
  block.classList.add('is-ready');

  // 1. Background image from first <picture> or <img>
  const pic = block.querySelector('picture, img');
  if (pic) {
    const img = pic.querySelector?.('img') || pic;
    const src = img.getAttribute('src');
    if (src) block.style.setProperty('--bg-img', `url("${src}")`);
    pic.remove(); // remove inline image
  }

  // 2. Extract remaining rows for title, body, and button
  const rows = [...block.children];
  const fields = {
    title: '',
    body: '',
    buttonText: '',
    buttonHref: '#',
  };

  rows.forEach((row, i) => {
    const link = row.querySelector('a');

    if (i === 0) {
      fields.title = row.textContent.trim();
    } else if (i === 1) {
      fields.body = row.textContent.trim();
    } else if (i === 2) {
      if (link) {
        fields.buttonText = link.textContent.trim();
        fields.buttonHref = link.getAttribute('href');
      } else {
        fields.buttonText = row.textContent.trim();
      }
    }
    row.remove(); // clean up original content
  });

  // 3. Rebuild CTA panel structure
  const panel = document.createElement('div');
  panel.className = 'panel';

  if (fields.title) {
    const h2 = document.createElement('h2');
    h2.textContent = fields.title;
    panel.append(h2);
  }

  if (fields.body) {
    const p = document.createElement('p');
    p.textContent = fields.body;
    panel.append(p);
  }

  if (fields.buttonText) {
    const a = document.createElement('a');
    a.className = 'button';
    a.href = fields.buttonHref || '#';
    a.textContent = fields.buttonText;
    panel.append(a);
  }

  // 4. Add panel back to block
  block.append(panel);
}
