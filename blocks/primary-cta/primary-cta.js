export default function decorate(block) {
  // Read UE-bound data-* attributes (from the model)
  const {
    title = '',
    body = '',
    ctaText = 'Learn More',
    ctaLink = '#',
    imageRef = '',
    alt = ''
  } = block.dataset;

  // Fallbacks if author pasted table content instead of using fields
  let fallbackTitle = title;
  let fallbackBody = body;
  let fallbackHref = ctaLink;
  let fallbackCtaText = ctaText;

  // Try to extract from existing rows when authors paste into the block
  const rows = Array.from(block.children);
  rows.forEach((row) => {
    const h = row.querySelector('h1,h2,h3');
    if (h && !fallbackTitle) fallbackTitle = h.textContent.trim();

    const p = row.querySelector('p');
    if (p && !fallbackBody) fallbackBody = p.textContent.trim();

    const a = row.querySelector('a');
    if (a) {
      if (!fallbackHref) fallbackHref = a.getAttribute('href') || '#';
      if (!fallbackCtaText) fallbackCtaText = a.textContent.trim() || ctaText;
    }

    const picOrImg = row.querySelector('picture, img');
    if (picOrImg && !imageRef) {
      const img = picOrImg.querySelector('img') || picOrImg;
      if (img && img.src) {
        // If imageRef wasn’t set in UE, take the inline image
        block.dataset.imageRef = img.src;
      }
    }
  });

  // Build new DOM
  const content = document.createElement('div');
  content.className = 'primary-cta-content';

  if (fallbackTitle) {
    const h2 = document.createElement('h2');
    h2.textContent = fallbackTitle;
    content.appendChild(h2);
  }

  if (fallbackBody) {
    const p = document.createElement('p');
    p.textContent = fallbackBody;
    content.appendChild(p);
  }

  if (fallbackCtaText && fallbackHref) {
    const btn = document.createElement('a');
    btn.className = 'cta-button';
    btn.href = fallbackHref;
    btn.textContent = fallbackCtaText;
    btn.setAttribute('role', 'button');
    content.appendChild(btn);
  }

  // Background wrapper (for bg image & circle layering)
  const bg = document.createElement('div');
  bg.className = 'primary-cta-background';

  // Clean & append
  block.innerHTML = '';
  block.append(bg, content);
  block.classList.add('primary-cta');

  // Inject background image if provided
  const src = imageRef || block.dataset.imageRef || '';
  if (src) {
    bg.style.setProperty('--bg-img', `url("${src}")`);
    // optional: alt, if you decide to render an <img> for SEO
  }

  // Alignment: default left; if block has class "right", flip panel
  if (block.classList.contains('right')) {
    block.dataset.align = 'right';
  } else {
    block.dataset.align = 'left';
  }
}
