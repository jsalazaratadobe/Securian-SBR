export default function decorate(block) {
  const image = block.querySelector('img');
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'primary-cta-content';

  // Move all text content into the content wrapper
  [...block.children].forEach((row) => {
    if (!row.querySelector('img')) {
      contentWrapper.appendChild(row);
    }
  });

  // If image exists, wrap it in a background div
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
