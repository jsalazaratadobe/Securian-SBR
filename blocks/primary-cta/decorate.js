export default function decorate(block) {
  block.classList.add('is-ready');

  // Extract first image
  const pic = block.querySelector('picture, img');
  if (pic) {
    const img = pic.querySelector('img') || pic;
    const src = img.getAttribute('src');
    if (src) block.style.setProperty('--bg-img', `url("${src}")`);
    pic.remove();
  }

  // Create a panel wrapper
  const panel = document.createElement('div');
  panel.className = 'panel';

  // Move all remaining children into the panel
  [...block.children].forEach((child) => {
    panel.appendChild(child);
  });
  block.innerHTML = ''; // Clear block
  block.appendChild(panel); // Add panel back

  // Optional alignment
  block.dataset.align = block.classList.contains('right') ? 'right' : 'left';

  // Wrap link in .button-container if it exists
  const link = panel.querySelector('a');
  if (link) {
    const buttonWrap = document.createElement('div');
    buttonWrap.className = 'button-container';
    link.replaceWith(buttonWrap);
    buttonWrap.appendChild(link);
  }
}
