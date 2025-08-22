export default function decorate(block) {
  block.classList.add('is-ready');
  // Optional normalization: if author pasted flat content, add hooks
  const imgs = block.querySelectorAll('img');
  if (imgs.length) {
    const media = document.createElement('div');
    media.className = 'media';
    media.append(imgs[0].closest('picture') || imgs[0]);
    block.append(media); // ensure media is last → image right on desktop
  }
  if (!block.querySelector('.content')) {
    const content = document.createElement('div');
    content.className = 'content';
    Array.from(block.children)
      .filter((el) => el !== block.querySelector('.media'))
      .forEach((el) => content.append(el));
    block.prepend(content);
  }
}