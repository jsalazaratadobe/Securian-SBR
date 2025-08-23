export default function decorate(block) {
  // Grab content elements
  const image = block.querySelector('img');
  const buttonLink = block.querySelector('a');
  const heading = block.querySelector('h2, h1');
  const body = block.querySelector('p');

  // Wrap content in container
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'primary-cta-content-wrapper';

  const content = document.createElement('div');
  content.className = 'primary-cta-content';

  if (heading) content.appendChild(heading);
  if (body) content.appendChild(body);
  if (buttonLink) {
    buttonLink.className = 'cta-button';
    content.appendChild(buttonLink);
  }

  contentWrapper.appendChild(content);

  // Handle background image
  block.innerHTML = '';
  if (image) {
    const bg = document.createElement('div');
    bg.className = 'primary-cta-background';
    bg.style.backgroundImage = `url(${image.src})`;
    block.append(bg);
  }

  block.append(contentWrapper);
  block.classList.add('primary-cta');
}
