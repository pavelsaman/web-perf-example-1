
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

  const searchInput = await $('#fulltext-search-input')
  await searchInput
    .setValue(seachTerm);
};

const chooseProduct = async n => {   

  const item = await $(`#search-item-${n}`)
  await item
    .click();
};

const addToCart = async () => {
  
  const addToCart = await $('#add-to-cart')
  await addToCart
    .click();

  const popupImage = await $('.popup__image');
  expect(popupImage)
    .toBeDisplayedInViewport();

  const toCartBtn = await $('//div[@id="popup-product-content"]//a[@href="/kosik"]')
  await toCartBtn
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

    const myProfileBtn = await $('[href="/muj-profil"]')
    await myProfileBtn
      .click();

    const email = await $('#Email')
    await email
      .setValue(browser.config.username);

    const pwd = await $('#Password')
    await pwd
      .setValue(browser.config.password);

    const loginBtn = await $('.o-button')
    await loginBtn
      .click();
      
    await expect($('.c-flash-message--info'))
      .toBeDisplayedInViewport();

    const myProfileLoggedBtn = await $('.c-header__my-account')
    await myProfileLoggedBtn
      .click();

    const logoutBtn = await $('.c-user-menu__logout')
    await logoutBtn
      .click();

    await expect($('.c-flash-message--info'))
      .toBeDisplayedInViewport();

    await expect($('#hp-banner'))
      .toBeDisplayedInViewport();
  });

  it('Go to new items category', async () => {

    await browser
      .url(browser.config.baseUrl);

    const menuItem = await $('a[href="/nove-skladem"]')
    await menuItem
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

    const continueTo2ndStepBtn = await $('[href="/doprava-a-platba"]')
    await continueTo2ndStepBtn
      .click();

    const shippingMethod = await $(`[for="${order.shippingMethod}"]`)
    await shippingMethod
      .click();

    let summaries = await $$('.c-summary-box__footer-item-label');
    await expect(summaries[summaries.length - 1])
      .toHaveText('DPD');

    const paymentMethod = await $(`[for="${order.paymentMethod}"]`)
    await paymentMethod
      .click();

    summaries = await $$('.c-summary-box__footer-item-label');
    await expect(summaries[summaries.length - 1])
      .toHaveText('Bankovní převod');

    const goToPersonalInfoBtn = await $('[href="/osobni-udaje"]')
    await goToPersonalInfoBtn
      .click();

    const firstName = await $('#FirstName')
    await firstName
      .setValue(order.name);

    const lastName = await $('#LastName')
    await lastName
      .setValue(order.surname);

    const street = await $('#Street')
    await street
      .setValue(order.street);

    const city = await $('#City')
    await city
      .setValue(order.city);

    const zip = await $('#ZipCode')
    await zip
      .setValue(order.zip);

    const email = await $('#Email')
    await email
      .setValue(order.email);

    const phone = await $('#Phone')
    await phone
      .setValue(order.phone);

    const consent = await $('[for="OrderConsents_0__IsChecked"]')
    await consent
      .click();

    const submitBtn = await $('#submit-button')
    await submitBtn
      .click();

    await expect(browser)
      .toHaveUrlContaining('/souhrn-objednavky');
  });
});
