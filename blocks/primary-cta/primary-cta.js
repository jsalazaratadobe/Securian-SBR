const primaryCta = document.getElementById('primary-cta');

const ctaData = {
  imageUrl: 'https://your.cdn.com/path-to-image.jpg',
  title: 'Financial wellness tips – in your inbox',
  body: 'Receive monthly emails to help keep your finances in shape.',
  buttonText: 'Sign up today',
  buttonUrl: '/signup'
};

// Set background image dynamically
primaryCta.style.backgroundImage = `url('${ctaData.imageUrl}')`;
primaryCta.style.backgroundPosition = 'right center';
primaryCta.style.backgroundRepeat = 'no-repeat';
primaryCta.style.backgroundSize = 'cover';

// Inject the rest of the content
primaryCta.innerHTML = `
  <div class="primary-cta-content">
    <h2 class="primary-cta-title">${ctaData.title}</h2>
    <p class="primary-cta-body">${ctaData.body}</p>
    <a href="${ctaData.buttonUrl}" class="primary-cta-button">${ctaData.buttonText}</a>
  </div>
`;
