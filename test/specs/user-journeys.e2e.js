
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

const lookForProduct = async seachTerm => {
  await $('#fulltext-search-input')
    .addValue(seachTerm);
};

const chooseProduct = async n => {   
  await $(`#search-item-${n}`)
    .click();
};

const addToCart = async () => {
  
  await $('#add-to-cart')
    .click();

  await $('[href="/kosik"]')
    .click();
};

describe('User journeys', () => {

  beforeEach(async () => {
    await browser
      .sendCommand('Network.clearBrowserCookies', {});
    await browser
      .sendCommand('Network.clearBrowserCache', {});

    await browser
      .setWindowSize(1920, 1080);
  });

  it('Open homepage', async () => {

    await browser
      .url(browser.config.baseUrl);
  });

  it('Performance audit', async () => {
    await browser.performAudit(await browser.getUrl());
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
      .addValue(browser.config.username);

    await $('#Password')
      .addValue(browser.config.password);

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

    await $(`[for="${order.shippingMethod}"]`)
      .click();

    let summaries = await $$('.c-summary-box__footer-item-label');
    await expect(summaries[summaries.length - 1])
      .toHaveText('DPD');

    await $(`[for="${order.paymentMethod}"]`)
      .click();

    summaries = await $$('.c-summary-box__footer-item-label');
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
