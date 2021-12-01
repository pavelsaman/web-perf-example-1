const { exportWebPerfStats } = require('ps-web-perf-library');

const order = {
  name: 'Test',
  surname: 'Inveo',
  phone: '+420777666888',
  email: 'pavel.saman@inveo.cz',
  street: 'Testovičova 15',
  city: 'Test',
  zip: '14000',
  shippingMethod: 'dpd',
  paymentMethod: 'BankTransfer'
}

describe('User journey', () => {

  before(async () => {
    await browser
      .setWindowSize(1920, 1080);

    await browser
      .url(browser.config.baseUrl);

    await browser
      .setCookies({
        name: 'voucherDismissed',
        value: 'true',
        domain: '.alpinepro-outlet.cz',
        path: '/',
      });

    await browser
      .cdp('Network', 'clearBrowserCache');
  });

  it('Open homepage', async () => {

    await browser
      .url(browser.config.baseUrl);

    const categoryList = await $('.c-category-tiles__item');
    await expect(categoryList)
      .toBeDisplayedInViewport();

    const perfEntries = await browser.execute(() => {
      return window.performance.getEntries();
    });

    await exportWebPerfStats(perfEntries);
  });

  /*it('Go to category', async () => {

    const menuItem = await $('a[href="/nove-skladem"]');
    await menuItem
      .click();

    await expect(browser)
      .toHaveUrlContaining('/nove-skladem');
  });

  it('Open login popup', async () => {

    const myProfileBtn = await $('[href="/muj-profil"]');
    await myProfileBtn
      .click();

    const email = await $('#Email');
    await expect(email)
      .toBeDisplayedInViewport();
  });

  it('Fill in credentials', async () => {

    const email = await $('#Email');
    await email
      .setValue('samanpavel+01@gmail.com');

    const pwd = await $('#Password')
    await pwd
      .setValue('12345a');
  });

  it('Log in', async () => {

    const loginBtn = await $('.o-button');
    await loginBtn
      .click();
      
    const flashMsg = await $('.c-flash-message--info');
    await expect(flashMsg)
      .toBeDisplayedInViewport();

    const products = await $('#c-product-list__item-container')
    await expect(products)
      .toBeDisplayedInViewport();
  });

  it('Search product', async () => {

    const searchInput = await $('#fulltext-search-input')
    await searchInput
      .setValue('ponožky');

    const searchResults = await $('#search-result-container');
    await expect(searchResults)
      .toBeDisplayedInViewport();
  });

  it('Choose product', async () => {

    const item = await $(`#search-item-1`)
    await item
      .click();

    const addToCartBtn = await $('#add-to-cart');
    await expect(addToCartBtn)
      .toBeDisplayedInViewport();
  });

  it('Open product popup', async () => {

    const addToCart = await $('#add-to-cart')
    await addToCart
      .click();

    const popupImage = await $('.popup__image');
    await expect(popupImage)
      .toBeDisplayedInViewport();    
  });

  it('Go to cart', async () => {

    const toCartBtn = await $('//div[@id="popup-product-content"]//a[@href="/kosik"]')
    await toCartBtn
      .click();

    await expect(browser)
      .toHaveUrlContaining('/kosik');

    await expect($('[href="/doprava-a-platba"]'))
      .toBeDisplayedInViewport();
  });*/
});
