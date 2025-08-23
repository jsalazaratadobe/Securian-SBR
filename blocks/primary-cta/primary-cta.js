export default function decorate(block) {
  // Prefer UE-driven data attributes if present
  const title = block.dataset.title || block.querySelector('h1, h2')?.textContent || '';
  const body = block.dataset.body || block.querySelector('p')?.textContent || '';
  const ctaText = block.dataset.ctaText || block.querySelector('input')?.value || 'Learn More';
  const ctaHref = block.dataset.ctaLink || block.querySelector('a')?.getAttribute('href') || '#';
  const image = block.querySelector('img');

  // Build the structure UE expects
  block.innerHTML = `
    <div class="primary-cta-content-wrapper">
      ${title ? `<h2>${title}</h2>` : ''}
      ${body ? `<p>${body}</p>` : ''}
      <a class="cta-button" href="${ctaHref}">${ctaText}</a>
    </div>
  `;

  // Set background image
  if (image) {
    block.style.backgroundImage = `url(${image.src})`;
    image.remove(); // we rely on bg instead
  }

  block.classList.add('primary-cta');
}
