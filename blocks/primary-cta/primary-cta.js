export default function decorate(block) {
  // Wrap content for better layering without reordering DOM
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'primary-cta-content-wrapper';

  // Move existing content into wrapper
  while (block.firstChild) {
    contentWrapper.appendChild(block.firstChild);
  }

  // Append wrapper back into block
  block.append(contentWrapper);

  // Add base block class
  block.classList.add('primary-cta');
}
