export default function decorate(block) {
  const image = block.querySelector('img');
  const buttonInput = block.querySelector('input');
  const buttonLink = block.querySelector('a');

  // Extract CTA data
  const ctaText = buttonInput?.value?.trim() || 'Learn More';
  const ctaHref = buttonLink?.getAttribute('href') || '#';

  // Build outer wrapper (for positioning white circle behind)
  const wrapper = document.createElement('div');
  wrapper.className = 'primary-cta-content-wrapper';

  // Inner content for headings + button
  const content = document.createElement('div');
  content.className = 'primary-cta-content';

  // Add heading/body rows, skip inputs, anchors, and images
  [...block.children].forEach((row) => {
    if (!row.querySelector('input') && !row.querySelector('a') && !row.querySelector('img')) {
      content.appendChild(row);
    }
  });

  // Add CTA button
  const button = document.createElement('a');
  button.className = 'cta-button';
  button.href = ctaHref;
  button.textContent = ctaText;
  content.appendChild(button);

  // Put content inside wrapper
  wrapper.appendChild(content);

  // Reset block content and add background + wrapper
  block.innerHTML = '';
  if (image) {
    const bg = document.createElement('div');
    bg.className = 'primary-cta-background';
    bg.style.backgroundImage = `url(${image.src})`;
    block.append(bg);
  }
  block.append(wrapper);

  // Tag block for styling
  block.classList.add('primary-cta');
}
