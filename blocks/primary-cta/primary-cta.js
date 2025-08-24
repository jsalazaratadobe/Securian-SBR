export default function decorate(block) {
  // --- 0) tag the block ----------------------------------------------------
  block.classList.add('primary-cta');

  // --- 1) ensure a single background element ------------------------------
  let bg = block.querySelector('.primary-cta-bg') ||
           block.querySelector('.primary-cta-background');
  if (!bg) {
    bg = document.createElement('div');
    bg.className = 'primary-cta-bg';
    block.prepend(bg);
  }

  // convert any pasted inline image/picture to a CSS background
  const pic = block.querySelector('picture, img');
  if (pic) {
    const img = pic.querySelector?.('img') || pic;
    if (img?.src) bg.style.setProperty('--bg-url', `url("${img.src}")`);
    pic.remove(); // critical: prevents the photo from covering the content
  }

  // --- 2) locate UE fields -------------------------------------------------
  const titleNode   = block.querySelector('[data-aue-prop="title"]');     // small line
  const bodyNode    = block.querySelector('[data-aue-prop="body"]');      // big green H1
  const btnTextNode = block.querySelector('[data-aue-prop="btn-text"]');  // button label
  const btnLinkNode = block.querySelector('[data-aue-prop="btn-link"]');  // button URL (text)

  // helper: clone a UE node into a new tag while preserving UE attributes
  const promote = (node, tag, className) => {
    if (!node) return null;
    const el = document.createElement(tag);
    // copy UE editing attributes so inline editing keeps working
    [...node.attributes].forEach((a) => {
      if (a.name.startsWith('data-aue-')) el.setAttribute(a.name, a.value);
    });
    el.className = className || '';
    el.innerHTML = node.innerHTML;
    node.replaceWith(el);
    return el;
  };

  // --- 3) build semantic structure ----------------------------------------
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'primary-cta-content-wrapper';

  const content = document.createElement('div');
  content.className = 'primary-cta-content';
  contentWrapper.appendChild(content);
  block.appendChild(contentWrapper);

  // small/top line (optional) -> styled paragraph
  if (titleNode) {
    const small = promote(titleNode, 'p', 'primary-cta-body');
    content.appendChild(small);
  }

  // main big headline -> <h2> in securian green
  if (bodyNode) {
    const h = promote(bodyNode, 'h2', 'primary-cta-title');
    content.appendChild(h);
  }

  // button
  if (btnTextNode) {
    const a = document.createElement('a');
    a.className = 'cta-button';
    a.href = '#'; // will be synced below

    // move the UE text node inside the button as a <span> (preserve edit attrs)
    const span = document.createElement('span');
    [...btnTextNode.attributes].forEach((a2) => {
      if (a2.name.startsWith('data-aue-')) span.setAttribute(a2.name, a2.value);
    });
    span.innerHTML = btnTextNode.innerHTML;
    btnTextNode.replaceWith(a);
    a.appendChild(span);
    content.appendChild(a);
  }

  // keep the link field present for UE but visually hidden
  if (btnLinkNode) btnLinkNode.classList.add('sr-only');

  // --- 4) sync button href + aria-live to editor changes -------------------
  const linkSpan = btnLinkNode;
  const ctaButton = block.querySelector('.cta-button');
  const syncHref = () => {
    if (!linkSpan || !ctaButton) return;
    const v = (linkSpan.textContent || '').trim();
    if (v) ctaButton.setAttribute('href', v);
  };
  syncHref();
  if (linkSpan) {
    new MutationObserver(syncHref).observe(linkSpan, {
      childList: true, subtree: true, characterData: true,
    });
  }

  // keep aria-label aligned with visible button text
  const ctaTextSpan = ctaButton?.querySelector('[data-aue-prop="btn-text"]');
  const syncAria = () => {
    if (ctaButton && ctaTextSpan) {
      ctaButton.setAttribute('aria-label', ctaTextSpan.textContent.trim());
    }
  };
  syncAria();
  if (ctaTextSpan) {
    new MutationObserver(syncAria).observe(ctaTextSpan, {
      childList: true, subtree: true, characterData: true,
    });
  }
}
