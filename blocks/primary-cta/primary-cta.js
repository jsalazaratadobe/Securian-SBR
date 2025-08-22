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
        ctaHref = link.getAttribute('href');
        row.remove(); // ✅ Remove the row with the raw link
      } else if (input) {
        ctaText = input.value.trim();
        row.remove(); // ✅ Remove the row with the input box
      } else {
        contentWrapper.appendChild(row);
      }
    }
  });

  if (ctaText && ctaHref) {
    const button = document.createElement('a');
    button.className = 'cta-button';
    button.href = ctaHref;
    button.textContent = ctaText;
    button.setAttribute('role', 'button');
    contentWrapper.appendChild(button);
  }

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
