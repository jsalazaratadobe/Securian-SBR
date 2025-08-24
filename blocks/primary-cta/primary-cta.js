export default function decorate(block) {
  // Ensure background wrapper exists
  if (!block.querySelector('.primary-cta-background')) {
    const bg = document.createElement('div');
    bg.className = 'primary-cta-background';
    block.prepend(bg);
  }

  // Turn any leading <img> into a CSS background and remove it
  const inlineImg = block.querySelector('img');
  const bgEl = block.querySelector('.primary-cta-background');
  if (inlineImg && bgEl) {
    bgEl.style.setProperty('--bg-url', `url("${inlineImg.src}")`);
    inlineImg.remove();
  }

  // Utility to wrap an element into a new tag while keeping data-rich-text
  function wrap(node, tag, cls) {
    if (!node) return null;
    const wrapper = document.createElement(tag);
    wrapper.className = cls;
    wrapper.setAttribute('data-rich-text', node.dataset.richText || '');
    wrapper.innerHTML = node.innerHTML;
    node.replaceWith(wrapper);
    return wrapper;
  }

  // Grab fields
  const titleNode = block.querySelector('[data-rich-text="title"]');
  const bodyNode = block.querySelector('[data-rich-text="body"]');
  const ctaTextNode = block.querySelector('[data-rich-text="ctaText"]');
  const ctaLinkNode = block.querySelector('[data-rich-text="ctaLink"]');

  // Content container
  const content = document.createElement('div');
  content.className = 'primary-cta-content';

  // Title is the big green heading
  if (titleNode && !titleNode.parentElement?.classList.contains('primary-cta-title')) {
    const h2 = wrap(titleNode, 'h2', 'primary-cta-title');
    content.appendChild(h2);
  }

  // Body is the smaller line
  if (bodyNode && !bodyNode.parentElement?.classList.contains('primary-cta-body')) {
    const p = wrap(bodyNode, 'p', 'primary-cta-body');
    content.appendChild(p);
  }

  // CTA button
  if (ctaTextNode || ctaLinkNode) {
    const button = document.createElement('a');
    button.className = 'cta-button';
    button.href = (ctaLinkNode?.textContent || '#').trim();
    button.textContent = (ctaTextNode?.textContent || 'Learn More').trim();
    button.setAttribute('role', 'button');
    content.appendChild(button);

    // Sync link text changes → button href
    if (ctaLinkNode) {
      const syncHref = () => {
        const url = (ctaLinkNode.textContent || '').trim();
        if (url) button.setAttribute('href', url);
      };
      syncHref();
      const mo = new MutationObserver(syncHref);
      mo.observe(ctaLinkNode, { childList: true, subtree: true, characterData: true });
    }

    // Sync button label changes → aria-label
    if (ctaTextNode) {
      const syncText = () => {
        const label = (ctaTextNode.textContent || '').trim();
        if (label) {
          button.textContent = label;
          button.setAttribute('aria-label', label);
        }
      };
      syncText();
      const mo2 = new MutationObserver(syncText);
      mo2.observe(ctaTextNode, { childList: true, subtree: true, characterData: true });
    }
  }

  // Replace block content with bg + content
  block.innerHTML = '';
  block.append(bgEl, content);
  block.classList.add('primary-cta');
}
