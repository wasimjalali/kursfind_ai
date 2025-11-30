// --- LANGUAGE SWITCHER ---
function switchLanguage(lang) {
  // Save language preference
  localStorage.setItem('preferredLanguage', lang);
  
  // Redirect to appropriate page
  if (lang === 'de') {
    window.location.href = 'index-de.html';
  } else {
    window.location.href = 'index.html';
  }
}

// Auto-redirect based on saved preference (optional)
// Uncomment if you want automatic language detection
/*
window.addEventListener('DOMContentLoaded', function() {
  const savedLang = localStorage.getItem('preferredLanguage');
  const currentPage = window.location.pathname;
  
  // If on English page but German preferred
  if (savedLang === 'de' && currentPage.includes('index.html') && !currentPage.includes('index-de.html')) {
    window.location.href = 'index-de.html';
  }
  
  // If on German page but English preferred
  if (savedLang === 'en' && currentPage.includes('index-de.html')) {
    window.location.href = 'index.html';
  }
});
*/

// --- PAGE NAVIGATION ---
const homePage = document.getElementById('home-page');
const providersPage = document.getElementById('providers-page');
const aboutPage = document.getElementById('about-page');
const allPages = [homePage, providersPage, aboutPage];

function showPage(pageId) {
  allPages.forEach(page => {
    if (page) page.classList.add('hidden');
  });
  
  const pageToShow = document.getElementById(pageId + '-page');
  if (pageToShow) {
    pageToShow.classList.remove('hidden');
  }
  
  window.scrollTo(0, 0);
  
  // Re-initialize Lucide icons after page change
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 100);
}

function scrollToSection(sectionId) {
  // Check if the section is on the providers page
  const targetEl = document.getElementById(sectionId);
  if (targetEl && targetEl.closest('#providers-page')) {
    // Ensure we are on the providers page
    showPage('providers');
    // Then, scroll to the section
    setTimeout(() => {
      targetEl.scrollIntoView({
        behavior: 'smooth'
      });
    }, 100);
  } else {
    // For home page sections
    showPage('home');
    if (targetEl) {
      // Use a slight delay to ensure the page is visible before scrolling
      setTimeout(() => {
        targetEl.scrollIntoView({
          behavior: 'smooth'
        });
      }, 100);
    }
  }
}

// --- GENERAL ---

// Initialize Lucide icons
document.addEventListener('DOMContentLoaded', function() {
  lucide.createIcons();
});

// Re-initialize icons after any page change
window.addEventListener('load', function() {
  lucide.createIcons();
});

// Scroll progress (optimized): passive listener + rAF + GPU transform (scaleX)
const progressBar = document.getElementById('scroll-progress');
if (progressBar) {
  // ensure initial transform state
  progressBar.style.transformOrigin = 'left';
  progressBar.style.willChange = 'transform';
  progressBar.style.transform = 'scaleX(0)';
}

let progressTicking = false;
function updateProgress() {
  const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;
  if (progressBar) {
    // use scaleX for cheap GPU compositing instead of changing width
    progressBar.style.transform = 'scaleX(' + (progress / 100) + ')';
  }
  progressTicking = false;
}

window.addEventListener('scroll', () => {
  if (!progressTicking) {
    progressTicking = true;
    window.requestAnimationFrame(updateProgress);
  }
}, { passive: true });

// Banner close
const banner = document.getElementById('top-banner');
const bannerClose = document.getElementById('banner-close');
if (banner && bannerClose) {
  bannerClose.addEventListener('click', () => {
    banner.style.display = 'none';
  });
}

// Mobile menu
const mobileMenu = document.getElementById('mobile-menu');
const mobileToggle = document.getElementById('mobile-menu-toggle');
const mobileClose = document.getElementById('mobile-menu-close');

function openMobileMenu() {
  if (mobileMenu) mobileMenu.classList.remove('hidden');
  document.body.classList.add('modal-open');
}
function closeMobileMenu() {
  if (mobileMenu) mobileMenu.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

if (mobileToggle) mobileToggle.addEventListener('click', openMobileMenu);
if (mobileClose) mobileClose.addEventListener('click', closeMobileMenu);

// --- STUDENT MODAL ---
const studentModal = document.getElementById('student-modal');
const studentModalClose = document.getElementById('student-modal-close');
const studentModalFormContainer = document.getElementById('student-modal-form');
const studentModalSuccessContainer = document.getElementById('student-modal-success');
const studentForm = document.getElementById('student-form');

// Buttons that previously opened a modal should now smooth-scroll to
// the embedded waitlist form. We keep the old ids but rebind their
// click handlers to scroll to #student-waitlist-section and focus
// the email input after scrolling.
// Updated to use new button IDs for AI search and browse courses
const tryAISearchButtons = [
  'try-ai-search-desktop',
  'try-ai-search-mobile',
  'try-ai-search-hero',
  'browse-courses-hero',
].map(id => document.getElementById(id));

function closeStudentModal() {
  if (!studentModal) return;
  studentModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

tryAISearchButtons.forEach(btn => {
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    // Prevent any default behavior (anchors/buttons)
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    // For now, scroll to the student section
    // Later, these will link to /suchen in Next.js
    scrollToSection('student-waitlist-section');
    // After scrolling completes, focus the email input if present.
    // Use a timeout slightly longer than the scroll delay to ensure
    // the element is visible and the external form script has run.
    setTimeout(() => {
      const emailInput = document.querySelector('#student-waitlist-section input[type="email"]');
      if (emailInput) {
        try { emailInput.focus({ preventScroll: true }); } catch (err) { emailInput.focus(); }
      }
    }, 700);
  });
});

if (studentModalClose) studentModalClose.addEventListener('click', closeStudentModal);
if (studentModal) {
  studentModal.addEventListener('click', (e) => {
    if (e.target === studentModal) closeStudentModal();
  });
}

if (studentForm) {
  studentForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (studentModalFormContainer && studentModalSuccessContainer) {
      studentModalFormContainer.classList.add('hidden');
      studentModalSuccessContainer.classList.remove('hidden');
    }
    setTimeout(closeStudentModal, 2500);
  });
}

// --- PROVIDER MODAL ---
const providerModal = document.getElementById('provider-modal');
const providerModalClose = document.getElementById('provider-modal-close');
const providerModalFormContainer = document.getElementById('provider-modal-form');
const providerModalSuccessContainer = document.getElementById('provider-modal-success');
const providerForm = document.getElementById('provider-form');
const openProviderButtons = [
  'open-provider-modal-desktop',
  'open-provider-modal-mobile',
  'open-provider-modal-hero',
  'open-provider-modal-pricing',
].map(id => document.getElementById(id));

function openProviderModal() {
  // Scroll to the provider waitlist form instead of opening modal
  const formSection = document.getElementById('provider-waitlist-form');
  if (formSection) {
    formSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

function closeProviderModal() {
  if (!providerModal) return;
  providerModal.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

openProviderButtons.forEach(btn => {
  if (btn) btn.addEventListener('click', openProviderModal);
});

if (providerModalClose) providerModalClose.addEventListener('click', closeProviderModal);
if (providerModal) {
  providerModal.addEventListener('click', (e) => {
    if (e.target === providerModal) closeProviderModal();
  });
}

if (providerForm) {
  providerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (providerModalFormContainer && providerModalSuccessContainer) {
      providerModalFormContainer.classList.add('hidden');
      providerModalSuccessContainer.classList.remove('hidden');
    }
    setTimeout(closeProviderModal, 2500);
  });
}

// --- ANIMATIONS ---

// Fade-in on scroll
const fadeEls = document.querySelectorAll('.fade-on-scroll');
const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);
fadeEls.forEach(el => fadeObserver.observe(el));

// FAQ accordion
const faqButtons = document.querySelectorAll('.faq-button');
faqButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const answer = btn.parentElement.querySelector('.faq-answer');
    const icon = btn.querySelector('span:last-child');
    const expanded = btn.getAttribute('aria-expanded') === 'true';

    // Close other open FAQs
    faqButtons.forEach(otherBtn => {
      if (otherBtn !== btn && otherBtn.getAttribute('aria-expanded') === 'true') {
        otherBtn.parentElement.querySelector('.faq-answer').style.maxHeight = '0';
        otherBtn.setAttribute('aria-expanded', 'false');
        otherBtn.querySelector('span:last-child').textContent = '+';
        otherBtn.querySelector('span:last-child').style.transform = 'rotate(0deg)';
      }
    });

    // Open/close the clicked one
    if (!answer) return;
    if (!expanded) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
      if (icon) icon.textContent = '−';
      if (icon) icon.style.transform = 'rotate(45deg)';
    } else {
      answer.style.maxHeight = '0';
      btn.setAttribute('aria-expanded', 'false');
      if (icon) icon.textContent = '+';
      if (icon) icon.style.transform = 'rotate(0deg)';
    }
  });
});

// AI demo typewriter + step cycling (for homepage)
const demoTexts = [
  'Digital Marketing courses in Berlin',
  'Web Development bootcamps in Munich',
  'Data Science training in Hamburg',
  'UX Design courses in Cologne'
];
const typedTextEl = document.getElementById('typed-text');
const aiProgressEl = document.getElementById('ai-demo-progress');
const demoCards = document.querySelectorAll('.ai-demo-card');
let aiStep = 0;
let typingInterval = null;

function startTyping(text) {
  if (!typedTextEl) return;
  if (typingInterval) clearInterval(typingInterval);
  let index = 0;
  typedTextEl.textContent = '';
  typingInterval = setInterval(() => {
    if (index <= text.length) {
      typedTextEl.textContent = text.slice(0, index);
      index++;
    } else {
      clearInterval(typingInterval);
    }
  }, 120);
}

function updateAiDemo() {
  const text = demoTexts[aiStep];
  startTyping(text);

  const percent = ((aiStep + 1) / demoTexts.length) * 100;
  if (aiProgressEl) {
    aiProgressEl.style.width = percent + '%';
  }

  demoCards.forEach((card) => {
    const idx = parseInt(card.getAttribute('data-index') || '0', 10);
    card.style.opacity = aiStep >= idx ? '1' : '0.4';
  });

  aiStep = (aiStep + 1) % demoTexts.length;
}

if (demoTexts.length && typedTextEl && aiProgressEl) {
  updateAiDemo();
  setInterval(updateAiDemo, 5000);
}

// --- PRICING MODEL TOGGLE (PROVIDERS PAGE) ---
function setPricingModelProviders(model) {
  const cplBtn = document.getElementById('toggle-cpl-providers');
  const cpaBtn = document.getElementById('toggle-cpa-providers');
  const cplElements = document.querySelectorAll('.cpl-pricing-providers');
  const cpaElements = document.querySelectorAll('.cpa-pricing-providers');

  if (model === 'cpl') {
    // Show CPL pricing
    cplElements.forEach(el => el.classList.remove('hidden'));
    cpaElements.forEach(el => el.classList.add('hidden'));
    
    // Update button appearance - CPL active
    if (cplBtn) {
      cplBtn.style.background = 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)';
      cplBtn.style.color = 'white';
    }
    if (cpaBtn) {
      cpaBtn.style.background = 'transparent';
      cpaBtn.style.color = '#4B5563';
    }
  } else {
    // Show CPA pricing
    cpaElements.forEach(el => el.classList.remove('hidden'));
    cplElements.forEach(el => el.classList.add('hidden'));
    
    // Update button appearance - CPA active
    if (cpaBtn) {
      cpaBtn.style.background = 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)';
      cpaBtn.style.color = 'white';
    }
    if (cplBtn) {
      cplBtn.style.background = 'transparent';
      cplBtn.style.color = '#4B5563';
    }
  }
}

// --- PRICING MODEL TOGGLE (PROVIDERS PAGE - ENGLISH) ---
function setPricingModelProvidersEN(model) {
  const cplBtn = document.getElementById('toggle-cpl-providers-en');
  const cpaBtn = document.getElementById('toggle-cpa-providers-en');
  const cplElements = document.querySelectorAll('.cpl-pricing-providers-en');
  const cpaElements = document.querySelectorAll('.cpa-pricing-providers-en');

  if (model === 'cpl') {
    // Show CPL pricing
    cplElements.forEach(el => el.classList.remove('hidden'));
    cpaElements.forEach(el => el.classList.add('hidden'));
    
    // Update button appearance - CPL active
    if (cplBtn) {
      cplBtn.style.background = 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)';
      cplBtn.style.color = 'white';
    }
    if (cpaBtn) {
      cpaBtn.style.background = 'transparent';
      cpaBtn.style.color = '#4B5563';
    }
  } else {
    // Show CPA pricing
    cpaElements.forEach(el => el.classList.remove('hidden'));
    cplElements.forEach(el => el.classList.add('hidden'));
    
    // Update button appearance - CPA active
    if (cpaBtn) {
      cpaBtn.style.background = 'linear-gradient(135deg, #06B6D4 0%, #10B981 100%)';
      cpaBtn.style.color = 'white';
    }
    if (cplBtn) {
      cplBtn.style.background = 'transparent';
      cplBtn.style.color = '#4B5563';
    }
  }
}

// --- FAQ ACCORDION (PROVIDERS PAGE) ---
document.addEventListener('DOMContentLoaded', function() {
  // German FAQ
  const faqButtons = document.querySelectorAll('.faq-button-providers');
  
  faqButtons.forEach(button => {
    button.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const icon = this.querySelector('span:last-child');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        // Collapse
        answer.style.maxHeight = '0';
        this.setAttribute('aria-expanded', 'false');
        icon.textContent = '+';
        icon.style.transform = 'rotate(0deg)';
      } else {
        // Expand
        answer.style.maxHeight = answer.scrollHeight + 'px';
        this.setAttribute('aria-expanded', 'true');
        icon.textContent = '−';
        icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // English FAQ
  const faqButtonsEN = document.querySelectorAll('.faq-button-providers-en');
  
  faqButtonsEN.forEach(button => {
    button.addEventListener('click', function() {
      const answer = this.nextElementSibling;
      const icon = this.querySelector('span:last-child');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      if (isExpanded) {
        // Collapse
        answer.style.maxHeight = '0';
        this.setAttribute('aria-expanded', 'false');
        icon.textContent = '+';
        icon.style.transform = 'rotate(0deg)';
      } else {
        // Expand
        answer.style.maxHeight = answer.scrollHeight + 'px';
        this.setAttribute('aria-expanded', 'true');
        icon.textContent = '−';
        icon.style.transform = 'rotate(180deg)';
      }
    });
  });
});

// Smooth scroll for anchors (local page only)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    // Let the page naviation links handle themselves
    if (href === '#') {
       e.preventDefault();
       return;
    }
    
    // Handle on-page anchors
    const targetEl = document.getElementById(href.substring(1));
    if (targetEl && (targetEl.closest('#home-page') || targetEl.closest('#providers-page'))) {
       e.preventDefault();
       targetEl.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});
