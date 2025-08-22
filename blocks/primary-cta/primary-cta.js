export default function decorate(block) {
  const image = block.querySelector('img');
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'primary-cta-content';

  let ctaText = '';
  let ctaHref = '';

  // Move all non-image content into the content wrapper
  [...block.children].forEach((row) => {
    const link = row.querySelector('a');

    if (!row.querySelector('img')) {
      contentWrapper.appendChild(row);

      // Check if this row contains a link
      if (link) {
        ctaHref = link.getAttribute('href');
        ctaText = row.textContent.trim();
      }
    }
  });

  // Build CTA button if we have text and link
  if (ctaText && ctaHref) {
    const button = document.createElement('a');
    button.className = 'cta-button';
    button.href = ctaHref;
    button.textContent = ctaText;
    button.setAttribute('role', 'button');

    contentWrapper.appendChild(button);
  }

  // Wrap the image if it exists
  if (image) {
    const background = document.createElement('div');
    background.className = 'primary-cta-background';
    background.style.backgroundImage = `url(${image.src})`;

    block.innerHTML = '';
    block.append(background, contentWrapper);
  } else {
    block.innerHTML = '';
    block.append(contentWrapper);
  }

  block.classList.add('primary-cta');
}
