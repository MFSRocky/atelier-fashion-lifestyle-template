/**
 * ATELIER — Site Configuration & Data Tokens
 * -------------------------------------------------------------
 * Customize your brand metadata, contact information, navigation,
 * and live backend endpoints without modifying HTML markup.
 */
window.SITE_CONFIG = {
  brand: {
    name: 'ATELIER',
    tagline: 'For a life\nwell lived.',
    announcement: 'Complimentary delivery on orders over $250 · A little more room to move',
    founded: '2018',
    story: 'Clothing with room to breathe. Thoughtfully made, beautifully lived in.'
  },
  contact: {
    email: 'hello@atelier.studio',
    locations: 'Paris · New York · Everywhere',
    studioNote: 'By appointment only'
  },
  social: {
    instagram: 'https://instagram.com/',
    pinterest: 'https://pinterest.com/'
  },
  currency: '$',
  /**
   * Remote Form Endpoint:
   * To connect live submissions for the Newsletter and Contact forms,
   * paste your Formspree, Basin, Getform, or Netlify Forms URL below:
   * e.g. formEndpoint: 'https://formspree.io/f/your_form_id'
   *
   * If left blank (''), forms run with client-side validation and demonstration status.
   */
  formEndpoint: ''
};
