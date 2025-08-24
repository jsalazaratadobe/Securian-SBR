// Robust decorate that works with the UE markup you have today.
// It restructures the block, overlays the image, adds the white circle,
// builds a real <a> button, and keeps UE fields in sync (text + link).
export default function decorate(block) {
  try {
    // 1) Identify UE-provided fields (be flexible!)
    const titleEl =
      block.querySelector('[data-aue-prop="title"]') ||
      block.querySelector('p, h1, h2');

    // UE renders body as a richtext container; allow both div/p
    const bodyEl =
      block.querySelector('[data-aue-prop="body"]') ||
      block.querySelector('[data-aue-filter="richtext"]') ||
      block.querySelector('div');

    const btnTextEl =
      block.querySelector('[data-aue-prop="btn-text"]') ||
      block.querySelector('[data-aue-label="Button Text"]') ||
      block.querySelector('p');

    const btnLinkEl =
      block.querySelector('[data-aue-prop="btn-link"]') ||
      block.querySelector('[data-aue-label="Button Link"]') ||
      null;

    // The asset picker usually inserts <picture><img> or <img> as the last child
    const pictureEl = block.querySelector('picture, img');

    // 2) Build structure
    block.classList.add('primary-cta');

    // Create content container (keeps editing working because we MOVE nodes, not replace text)
    const content = document.createElement('div');
    content.className = 'primary-cta__content';

    if (titleEl) {
      titleEl.classList.add('primary-cta__title'); // green style via CSS
      content.appendChild(titleEl);
    }

    // Body: keep UE richtext editable but give it our display style
    if (bodyEl) {
      bodyEl.classList.add('primary-cta__body'); // large/bold black via CSS
      content.appendChild(bodyEl);
    }

    // Build real button
    const btn = document.createElement('a');
    btn.className = 'primary-cta__button';
    btn.href = '#';
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-label', 'Learn more');

    // Set initial button text from UE field
    const setBtnText = () => {
      btn.textContent = (btnTextEl?.textContent || 'Learn more').trim();
    };
    setBtnText();

    // Insert button; keep the raw link field (hidden by CSS) in the DOM for UE
    content.appendChild(btn);

    // White circle is CSS ::before on .primary-cta (no markup needed)

    // 3) Move picture/image to be the "background"
    if (pictureEl) {
      pictureEl.classList.add('primary-cta__bg');
      // Make sure it’s the first child so it can sit behind via CSS
      block.prepend(pictureEl);
    }

    // 4) Insert content after the image
    block.appendChild(content);

    // 5) Sync button href from UE "Button Link" field
    const syncHref = () => {
      const url = (btnLinkEl?.textContent || '').trim();
      if (url) btn.setAttribute('href', url);
    };
    syncHref();

    if (btnLinkEl) {
      const moLink = new MutationObserver(syncHref);
      moLink.observe(btnLinkEl, {
        childList: true, subtree: true, characterData: true, attributes: true,
      });
    }

    // 6) Keep aria-label in sync with button text for a11y
    const syncAria = () => {
      btn.setAttribute('aria-label', btn.textContent.trim());
    };
    syncAria();

    if (btnTextEl) {
      const moText = new MutationObserver(() => { setBtnText(); syncAria(); });
      moText.observe(btnTextEl, {
        childList: true, subtree: true, characterData: true, attributes: true,
      });
    }

  } catch (e) {
    // Fail safe – never let the block crash rendering
    // eslint-disable-next-line no-console
    console.warn('primary-cta decorate failed (continuing):', e);
  }
}
