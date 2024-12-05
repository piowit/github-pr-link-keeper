let currentPRLink = null;

function hasValidPRText(element) {
  const text = element.textContent.trim();
  return text.startsWith('Back to pull request #') && /\d+$/.test(text);
}

function updateFixedPRLink() {
  const originalLink = document.querySelector('.PageHeader-parentLink-label');
  const existingFixed = document.querySelector('.gh-fixed-pr-link');
  
  // Remove fixed link if original is not present or doesn't have valid PR text
  if ((!originalLink || !hasValidPRText(originalLink)) && existingFixed) {
    existingFixed.remove();
    currentPRLink = null;
    return;
  }
  
  // If original link exists with valid PR text
  if (originalLink && hasValidPRText(originalLink)) {
    const parentAnchor = originalLink.closest('a');
    if (parentAnchor) {
      const linkContent = parentAnchor.outerHTML;
      
      // Only update if content changed
      if (linkContent !== currentPRLink) {
        // Remove existing fixed link if present
        if (existingFixed) {
          existingFixed.remove();
        }
        
        // Create new fixed link
        const fixedContainer = document.createElement('div');
        fixedContainer.className = 'gh-fixed-pr-link';
        const clonedAnchor = parentAnchor.cloneNode(true);
        fixedContainer.appendChild(clonedAnchor);
        document.body.appendChild(fixedContainer);
        
        currentPRLink = linkContent;
      }
    }
  }
}

// Run when the page loads
updateFixedPRLink();

// Create an observer to handle dynamic page changes
const observer = new MutationObserver(() => {
  updateFixedPRLink();
});

// Start observing the document with the configured parameters
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Handle navigation changes
document.addEventListener('turbo:visit', () => {
  const existingFixed = document.querySelector('.gh-fixed-pr-link');
  if (existingFixed) {
    existingFixed.remove();
    currentPRLink = null;
  }
});

// Backup for regular navigation
window.addEventListener('popstate', () => {
  const existingFixed = document.querySelector('.gh-fixed-pr-link');
  if (existingFixed) {
    existingFixed.remove();
    currentPRLink = null;
  }
}); 
