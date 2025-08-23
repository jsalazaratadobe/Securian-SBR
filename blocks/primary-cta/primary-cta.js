export default function decorate(block) {
  // 1) Read UE-bound dataset (these attributes are written on the block wrapper)
  //    We intentionally map Title -> <h2>, Body -> <p>
  const {
    title = '',
    body = '',
    ctaText = 'Learn more',
    ctaLink = '#',
  } = block.dataset;

  // 2) Get an author-selected image (UE inserts a normal <picture>/<img>)
  const pic = block.querySelector('picture, img');
  if (pic) {
    const img = pic.querySelector('img') || pic;
    // expose the image as a CSS var so CSS can paint it as a background
    block.style.setProperty('--cta-bg', `url("${img.getAttribute('src')}")`);
    pic.remove();
  }

  // 3) Build markup that supports inline editing (data-rich-text)
  const wrapper = document.createElement('div');
  wrapper.className = 'primary-cta-content-wrapper';

  const content = document.createElement('div');
  content.className = 'primary-cta-content';

  content.innerHTML = `
    <h2 class="primary-cta-title" data-rich-text="title">${title}</h2>
    <p class="primary-cta-body" data-rich-text="body">${body}</p>

    <a class="cta-button" href="${ctaLink}">
      <span data-rich-text="ctaText">${ctaText}</span>
    </a>

    <!-- Hidden holder for link so we can sync href live while editing -->
    <span data-rich-text="ctaLink" hidden>${ctaLink}</span>
  `;

  // Clear and re-append
  block.textContent = '';
  wrapper.append(content);
  block.append(wrapper);
  block.classList.add('primary-cta');

  // 4) Keep the href in sync when editing the “Button Link” field in the UE form
  const linkHolder = content.querySelector('[data-rich-text="ctaLink"]');
  const button = content.querySelector('.cta-button');
  const syncHref = () => {
    const href = (linkHolder.textContent || '').trim();
    button.setAttribute('href', href || '#');
  };
  syncHref();
  const mo = new MutationObserver(syncHref);
  mo.observe(linkHolder, { childList: true, subtree: true, characterData: true });
}
