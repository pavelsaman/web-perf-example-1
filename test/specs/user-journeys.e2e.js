
const credentials = require('../../fixtures/credentials.json');
const order = require('../../fixtures/order.json');

const lookForProduct = async seachTerm => {
  await $('#fulltext-search-input')
    .addValue(seachTerm);
};

const chooseProduct = async n => {   
  await $(`#search-item-${n}`)
    .click();
};

const addToCart = async () => {
  await browser
    .setupInterceptor();

  await $('#add-to-cart')
    .click();

  await browser
    .expectRequest('POST', '/Order/AddToCart', 200);
  await browser
    .expectRequest('POST', '/Order/InvokeCartPanel', 200);

  await $('[href="/kosik"]')
    .click();
};

describe('User journeys', () => {

  beforeEach(async () => {
    await browser
      .clear();

    await browser
      .setWindowSize(1920, 1080);
  });

  it('Search product and put one item to cart', async () => {

    await browser
      .url(browser.config.baseUrl);

    await lookForProduct('ponožky');
      
    await chooseProduct(1);

    await addToCart();

    await expect(browser)
      .toHaveUrlContaining('/kosik');

    await expect($('[href="/doprava-a-platba"]'))
      .toBeDisplayedInViewport();
  });

  it('Log in and log out', async () => {

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
      
    await expect($('.c-flash-message--info'))
      .toBeDisplayedInViewport();

    await $('.c-header__my-account ')
      .click();

    await $('.c-user-menu__logout')
      .click();

    await expect($('.c-flash-message--info'))
      .toBeDisplayedInViewport();

    await expect($('#hp-banner'))
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

  it('Create order', async () => {
    await browser
      .url(browser.config.baseUrl);

    await lookForProduct('ponožky');

    await chooseProduct(1);

    await addToCart();

    await $('[href="/doprava-a-platba"]')
      .click();

    await browser
      .setupInterceptor();

    await $(`[for="${order.shippingMethod}"]`)
      .click();

    await browser
      .expectRequest('POST', '/Order/SetShippingMethod', 200);
    await browser
      .expectRequest('POST', '/Order/InvokeOverviewBox', 200);
    const summaries = await $$('.c-summary-box__footer-item-label');
    await expect(summaries[summaries.length - 1])
      .toHaveText('DPD');

    await $(`[for="${order.paymentMethod}"]`)
      .click();

    await browser
      .expectRequest('POST', '/Order/SetPaymentMethod', 200);
    await browser
      .expectRequest('POST', '/Order/InvokeOverviewBox', 200);
    
    await expect(summaries[summaries.length - 1])
      .toHaveText('Bankovní převod');

    await $('[href="/osobni-udaje"]')
      .click();

    await $('#FirstName')
      .addValue(order.name);

    await $('#LastName')
      .addValue(order.surname);

    await $('#Street')
      .addValue(order.street);

    await $('#City')
      .addValue(order.city);

    await $('#ZipCode')
      .addValue(order.zip);

    await $('#Email')
      .addValue(order.email);

    await $('#Phone')
      .addValue(order.phone);

    await $('[for="OrderConsents_0__IsChecked"]')
      .click();

    await $('#submit-button')
      .click();

    await expect(browser)
      .toHaveUrlContaining('/souhrn-objednavky');
  });
});
