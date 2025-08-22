export default function decorate(block) {
  const image = block.querySelector('img');
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'primary-cta-content';

  let ctaText = '';
  let ctaHref = '';

  [...block.children].forEach((row) => {
    const link = row.querySelector('a');
    const input = row.querySelector('input');

    if (!row.querySelector('img')) {
      if (link) {
        // Store href and remove this row from rendering
        ctaHref = link.getAttribute('href');
      } else if (input) {
        // Store button label and remove this row from rendering
        ctaText = input.value.trim();
      } else {
        // Normal row, append to DOM
        contentWrapper.appendChild(row);
      }
    }
  });

  // Add CTA button only if both parts exist
  if (ctaText && ctaHref) {
    const button = document.createElement('a');
    button.className = 'cta-button';
    button.href = ctaHref;
    button.textContent = ctaText;
    button.setAttribute('role', 'button');
    contentWrapper.appendChild(button);
  }

  // Background image handling
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