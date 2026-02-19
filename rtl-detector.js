/**
 * RTL Detector for Google Translate
 * Automatically switches layouts when RTL languages are detected
 */

// List of RTL language codes
const RTL_LANGUAGES = ['ar', 'he', 'ur', 'fa', 'yi', 'ji', 'iw', 'ku', 'ps', 'sd'];

/**
 * Get the current language from Google Translate or HTML lang attribute
 */
function getCurrentLanguage() {
  // Check if Google Translate has set a language
  const googleTranslateElement = document.querySelector('.goog-te-combo');
  if (googleTranslateElement && googleTranslateElement.value) {
    return googleTranslateElement.value;
  }

  // Check the HTML lang attribute
  const htmlLang = document.documentElement.lang;
  if (htmlLang) {
    return htmlLang;
  }

  // Default to English
  return 'en';
}

/**
 * Check if a language code is RTL
 */
function isRTLLanguage(langCode) {
  // Extract language code (e.g., 'ar' from 'ar-SA')
  const baseLang = langCode.split('-')[0].toLowerCase();
  return RTL_LANGUAGES.includes(baseLang);
}

/**
 * Apply RTL or LTR layout
 */
function applyTextDirection(isRTL) {
  const htmlElement = document.documentElement;
  const bootstrapRtlLink = document.getElementById('bootstrap-rtl');

  if (isRTL) {
    // Set RTL direction
    htmlElement.setAttribute('dir', 'rtl');
    // Load Bootstrap RTL CSS
    bootstrapRtlLink.href = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.rtl.min.css';
    // Add RTL class for custom styling
    document.body.classList.add('is-rtl');
    document.body.classList.remove('is-ltr');
  } else {
    // Set LTR direction
    htmlElement.setAttribute('dir', 'ltr');
    // Unload Bootstrap RTL CSS
    bootstrapRtlLink.href = '';
    // Remove RTL class for custom styling
    document.body.classList.remove('is-rtl');
    document.body.classList.add('is-ltr');
  }
}

/**
 * Check and apply appropriate text direction
 */
function updateTextDirection() {
  const currentLang = getCurrentLanguage();
  const shouldBeRTL = isRTLLanguage(currentLang);
  applyTextDirection(shouldBeRTL);
}

/**
 * Initialize RTL detection
 */
function initRTLDetection() {
  // Apply initial direction
  updateTextDirection();

  // Monitor for Google Translate language changes
  // Google Translate changes the lang attribute on the html element
  const htmlElement = document.documentElement;
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
        updateTextDirection();
      }
    });
  });

  // Observe changes to the lang attribute
  observer.observe(htmlElement, {
    attributes: true,
    attributeFilter: ['lang']
  });

  // Also check Google Translate dropdown changes
  const checkGoogleTranslateChange = setInterval(function() {
    const googleCombo = document.querySelector('.goog-te-combo');
    if (googleCombo) {
      googleCombo.addEventListener('change', function() {
        // Delay to allow Google Translate to update the DOM
        setTimeout(updateTextDirection, 500);
      });
      // Stop checking once we find the element
      clearInterval(checkGoogleTranslateChange);
    }
  }, 100);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRTLDetection);
} else {
  initRTLDetection();
}
