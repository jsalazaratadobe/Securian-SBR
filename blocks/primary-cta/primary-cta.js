export default function decorate(block) {
  block.classList.add('is-ready');

  // Grab first image (authors paste picture/img inline)
  const pic = block.querySelector('picture, img');
  if (pic) {
    const img = pic.querySelector('img') || pic;
    const src = img.getAttribute('src');
    if (src) block.style.setProperty('--bg-img', `url("${src}")`);
    // remove the inline image since we use it as background
    pic.remove();
  }

  // Wrap remaining content in a panel
  if (!block.querySelector('.panel')) {
    const panel = document.createElement('div');
    panel.className = 'panel';
    while (block.firstChild) panel.append(block.firstChild);
    block.append(panel);
  }

  // optional alignment
  if (block.classList.contains('right')) {
    block.dataset.align = 'right';
  } else {
    block.dataset.align = 'left';
  }
}
