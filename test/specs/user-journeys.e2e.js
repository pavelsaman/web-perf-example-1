
const credentials = require('../../fixtures/credentials.json');

describe('User journeys', () => {

  beforeEach(async () => {
    await browser
      .reloadSession();

    await browser
      .setWindowSize(1920, 1080);
  });

  it('Put one item to cart', async () => {

    await browser
      .url(browser.config.baseUrl);

    await $('#fulltext-search-input')
      .addValue('ponožky');
      
    await $('.c-search-results__item-name')
      .click();

    await $('#add-to-cart')
      .click();

    await $('[href="/kosik"]')
      .click();

    await expect(browser)
      .toHaveUrlContaining('/kosik');
  });

  it('Log in', async () => {

    await browser
      .url(browser.config.baseUrl);

    await $('[href="/muj-profil"]')
      .click();

    await $('#Email')
      .addValue(credentials.email);

    await $('#Password')
      .addValue(credentials.password);

    await $('.o-button')
      .click();
      
    await expect(await $('.c-flash-message--info'))
      .toBeDisplayedInViewport();
  });

  it('Go to new items category', async () => {

    await browser
      .url(browser.config.baseUrl);

    await $('a[href="/nove-skladem"]')
      .click();

    await expect(browser)
      .toHaveUrlContaining('/nove-skladem');
  });
});
