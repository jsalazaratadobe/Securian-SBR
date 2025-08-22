export default function decorate(block) {
  block.classList.add('primary-cta');

  const title = block.querySelector('h1, h2, h3');
  if (title) title.classList.add('primary-cta-title');

  const body = block.querySelector('p');
  if (body) body.classList.add('primary-cta-body');

  const button = block.querySelector('a');
  if (button) button.classList.add('primary-cta-button');

  // Wrap text content in a container
  const contentWrapper = document.createElement('div');
  contentWrapper.classList.add('primary-cta-content');
  [...block.children].forEach(child => contentWrapper.appendChild(child));
  block.appendChild(contentWrapper);
}
