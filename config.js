// Configure your own hosted payment page before launching sales.
window.BIBLICAL_STORE = {
  price: 16.99,
  currency: 'EUR',
  checkoutUrl: '',
  supportEmail: '',
  sellerName: '',
  termsUrl: '',
  privacyUrl: '',
  promotion: {
    // Demo previews are labelled. Set false and supply actual offer data to launch.
    demo: true,
    countdownMinutes: 14 + 13 / 60, // 14:13 per visit; restarts after reaching zero.
    remaining: null, // Actual remaining promotional allocations; never decremented randomly.
    total: null, // Total promotional allocations; percentage = (total - remaining) / total.
    regularPrice: 34,
    purchases: [] // Consented real entries: {name:'First name L.', country:'Country', purchasedAt:'ISO timestamp'}
  }
};
