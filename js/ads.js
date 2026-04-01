// NextGen Game Radar - Ad Integration

const Ads = {
  init() {
    // Adsterra placeholders are already in HTML with data-adsterra-key attributes
    // When you get your Adsterra publisher keys, replace the placeholder content

    // Google AdSense auto-ads are loaded via the script tag in <head>
    // Publisher ID: ca-pub-7098271335538021

    // Initialize any manual AdSense slots
    this.initAdSenseSlots();
  },

  initAdSenseSlots() {
    // Manual AdSense slot
    const slot = document.getElementById('adsense-manual-slot');
    if (slot && window.adsbygoogle) {
      try {
        (adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // AdSense not loaded or blocked
      }
    }
  },

  // Inject in-feed native ad after every N cards
  injectInFeedAd(container, afterIndex = 8) {
    const cards = container.querySelectorAll('.game-card');
    if (cards.length >= afterIndex) {
      const adEl = document.createElement('div');
      adEl.className = 'ad-slot ad-native bg-card rounded-lg flex items-center justify-center text-text-secondary text-xs min-h-[100px] border border-border-dark col-span-full';
      adEl.setAttribute('data-adsterra-key', 'in-feed-native');
      adEl.innerHTML = '<span>Advertisement</span>';

      const targetCard = cards[afterIndex - 1];
      if (targetCard && targetCard.nextSibling) {
        container.insertBefore(adEl, targetCard.nextSibling);
      }
    }
  }
};
