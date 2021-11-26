
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

describe('User journey', () => {

  before(async () => {
    await browser
      .setWindowSize(1920, 1080);
  });

  it('Open homepage', async () => {

    await browser
      .url(browser.config.baseUrl);

    await expect($('.c-category-tiles__item'))
      .toBeDisplayedInViewport();
  });

  it('Performance audit', async () => {
    await browser.performAudit(await browser.getUrl());
  });

  it('Go to category', async () => {

    const menuItem = await $('a[href="/nove-skladem"]');
    await menuItem
      .click();

    await expect(browser)
      .toHaveUrlContaining('/nove-skladem');
  });

  it('Performance audit category page', async () => {
    await browser.performAudit(await browser.getUrl());
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
      
    await expect($('.c-flash-message--info'))
      .toBeDisplayedInViewport();

    await expect($('#c-product-list__item-container'))
      .toBeDisplayedInViewport();
  });

  it('Search product', async () => {

    await lookForProduct('ponožky');
  });

  it('Choose product', async () => {

    await chooseProduct(1);
  });

  it('Open product popup', async () => {

    await addToCart();
  });

  it('Go to cart', async () => {

    await expect(browser)
      .toHaveUrlContaining('/kosik');

    await expect($('[href="/doprava-a-platba"]'))
      .toBeDisplayedInViewport();
  });

  it('Go to 2nd step in cart', async () => {

    const continueTo2ndStepBtn = await $('[href="/doprava-a-platba"]')
    await continueTo2ndStepBtn
      .click();

    await expect(browser)
      .toHaveUrlContaining('/doprava-a-platba');
  });

  it('Choose shipping', async () => {

    const shippingMethod = await $(`[for="${order.shippingMethod}"]`)
    await shippingMethod
      .click();

    await browser.waitUntil(
      async () => {
        const summaries = await $$('.c-summary-box__footer-item-label');
        const summariesTexts = await Promise.all(summaries.map(async el => {
          const text = await el.getText();
          return text;
        }));
        return summariesTexts.includes('DPD') === true;
      }
    );
  });

  it('Choose payment', async () => {

    const paymentMethod = await $(`[for="${order.paymentMethod}"]`);
    await paymentMethod
      .click();

    await browser.waitUntil(
      async () => {
        const summaries = await $$('.c-summary-box__footer-item-label');
        const summariesTexts = await Promise.all(summaries.map(async el => {
          const text = await el.getText();
          return text;
        }));
        return summariesTexts.includes('Bankovní převod') === true;
      }
    );
  });

  it('Go to 3rd step in cart', async () => {

    const goToPersonalInfoBtn = await $('[href="/osobni-udaje"]');
    await goToPersonalInfoBtn
      .click();

    await expect(browser)
      .toHaveUrlContaining('/osobni-udaje');
  });

  it('Fill in personal info', async () => {
    const firstName = await $('#FirstName');
    await firstName
      .setValue(order.name);

    const lastName = await $('#LastName');
    await lastName
      .setValue(order.surname);

    const street = await $('#Street');
    await street
      .setValue(order.street);

    const city = await $('#City');
    await city
      .setValue(order.city);

    const zip = await $('#ZipCode');
    await zip
      .setValue(order.zip);

    const email = await $('#Email');
    await email
      .setValue(order.email);

    const phone = await $('#Phone');
    await phone
      .setValue(order.phone);

    const consent = await $('[for="OrderConsents_0__IsChecked"]');
    await consent
      .click();
  });

  it('Confirm order', async () => {

    const submitBtn = await $('#submit-button');
    await submitBtn
      .click();

    await expect(browser)
      .toHaveUrlContaining('/souhrn-objednavky');
  });
});
