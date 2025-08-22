export default function decorate(block) {
  const image = block.querySelector('img');
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'primary-cta-content';

  let ctaText = '';
  let ctaHref = '';

  // Loop through and process block rows
  [...block.children].forEach((row) => {
    const link = row.querySelector('a');
    const input = row.querySelector('input');

    if (!row.querySelector('img')) {
      if (link) {
        ctaHref = link.getAttribute('href');
        return; // prevent this row from rendering
      }

      if (input) {
        ctaText = input.value.trim();
        return; // prevent this row from rendering
      }

      contentWrapper.appendChild(row);
    }
  });

  // Build the CTA button from captured input + link
  if (ctaText && ctaHref) {
    const button = document.createElement('a');
    button.className = 'cta-button';
    button.href = ctaHref;
    button.textContent = ctaText;
    button.setAttribute('role', 'button');
    contentWrapper.appendChild(button);
  }

  // Background image container
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
