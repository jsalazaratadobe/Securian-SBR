export default function decorate(block) {
  // Grab dataset attributes that UE binds
  const titleText = block.dataset.body || 'Your headline here'; // Body field in UI → Title on page
  const bodyText = block.dataset.title || ''; // Title field in UI → Subtext on page
  const buttonText = block.dataset.ctaText || 'Learn More';
  const buttonLink = block.dataset.ctaLink || '#';
  const img = block.querySelector('img');

  // Build HTML
  block.innerHTML = `
    <div class="primary-cta-content">
      <h2 data-rich-text="body">${titleText}</h2>
      ${bodyText ? `<p data-rich-text="title">${bodyText}</p>` : ''}
      <a class="cta-button" data-rich-text="ctaText" href="${buttonLink}">${buttonText}</a>
    </div>
  `;

  // Set background image if uploaded
  if (img) {
    block.style.backgroundImage = `url(${img.src})`;
    img.remove();
  }

  block.classList.add('primary-cta');
}
