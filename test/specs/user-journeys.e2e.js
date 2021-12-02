
const order = {
  name: 'Test',
  surname: 'Inveo',
  phone: '+420777666888',
  email: 'pavel.saman@inveo.cz',
  street: 'Testovičova 15',
  city: 'Test',
  zip: '14000',
  shippingMethod: 'delivery_1008',
  paymentMethod: 'payment_1009_for_'
}

describe('User journey', () => {

  before(async () => {
    await browser
      .setWindowSize(1920, 1080);

    await browser
      .url('https://alpinepro.cz/');

    await browser
      .setCookies({
        name: 'voucherPopupClosed',
        value: '1',
        domain: '.alpinepro.cz',
        path: '/',
      });

    await browser
      .cdp('Network', 'clearBrowserCache');
  });

  it('Open homepage', async () => {

    await browser
      .url('https://alpinepro.cz/');

    const infoStripe = await $('.info-stripe-item');
    await expect(infoStripe)
      .toBeDisplayedInViewport();
  });

  it('Performance audit', async () => {
    await browser.performAudit(await browser.getUrl());
  });

  it('Go to category', async () => {

    const menuItem = await $('a[href="/olympijska-kolekce"]');
    await menuItem
      .click();

    const mainCatPic = await $('#category-headline');
    await expect(mainCatPic)
      .toBeDisplayedInViewport();

    await expect(browser)
      .toHaveUrlContaining('/olympijska-kolekce');
  });

  it('Performance audit category page', async () => {
    await browser.performAudit(await browser.getUrl());
  });

  it('Open login popup', async () => {

    const myProfileBtn = await $('.ico-login-blue');
    await myProfileBtn
      .click();

    const email = await $('#Username');
    await expect(email)
      .toBeDisplayedInViewport();
  });

  it('Fill in credentials', async () => {

    const email = await $('#Username');
    await email
      .setValue('pavel.saman@inveo.cz');

    const pwd = await $('#Password')
    await pwd
      .setValue('12345');
  });

  it('Log in', async () => {

    const loginBtn = await $('[value=Přihlásit]');
    await loginBtn
      .click();
      
    const flashMsg = await $('.success');
    await expect(flashMsg)
      .toBeDisplayedInViewport();

    const products = await $('.listing')
    await expect(products)
      .toBeDisplayedInViewport();
  });

  it('Search product', async () => {

    const searchInput = await $('#search_query_top')
    await searchInput
      .setValue('ponožky');

    const searchResults = await $('#autocomplete');
    await expect(searchResults)
      .toBeDisplayedInViewport();
  });

  it('Choose product', async () => {

    const item = await $(`//div[@id="autocomplete"]//a`)
    await item
      .click();

    const addToCartBtn = await $('#add_to_cart');
    await expect(addToCartBtn)
      .toBeDisplayedInViewport();
    await expect(addToCartBtn)
      .toBeClickable();
  });

  it('Open product popup', async () => {

    const addToCart = await $('#add_to_cart')
    await addToCart
      .click();

    const continueToCartBtn = await $('.popup-form-item [href="/Order/Step1"]');
    await expect(continueToCartBtn)
      .toBeDisplayedInViewport();    
  });

  it('Go to cart', async () => {

    const toCartBtn = await $('.popup-form-item [href="/Order/Step1"]')
    await toCartBtn
      .click();

    await expect(browser)
      .toHaveUrlContaining('/Order/Step1');

    const toNextStepBtn = await $('#continueTo2step');
    await expect(toNextStepBtn)
      .toBeDisplayedInViewport();
  });

  it('Go to 2nd step in cart', async () => {

    const continueTo2ndStepBtn = await $('#continueTo2step');
    await continueTo2ndStepBtn
      .click();

    await expect(browser)
      .toHaveUrlContaining('/Order/Step2?');
  });

  it('Choose shipping', async () => {

    const shippingMethod = await $(`[for="${order.shippingMethod}"]`)
    await shippingMethod
      .click();

    await browser.waitUntil(
      async () => {
        const summaries = await $$('.payments .item .left');
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
        const summaries = await $$('.payments .item .left');
        const summariesTexts = await Promise.all(summaries.map(async el => {
          const text = await el.getText();
          return text;
        }));
        return summariesTexts.includes('Bankovní převod') === true;
      }
    );
  });

  it('Go to 3rd step in cart', async () => {

    const goToPersonalInfoBtn = await $('[value="Pokračovat"]');
    await goToPersonalInfoBtn
      .click();

    await expect(browser)
      .toHaveUrlContaining('/Order/Step3');
  });

  it('Fill in personal info', async () => {
    const firstName = await $('#InvoiceFirstName');
    await firstName
      .setValue(order.name);

    const lastName = await $('#InvoiceLastName');
    await lastName
      .setValue(order.surname);

    const street = await $('#InvoiceStreet');
    await street
      .setValue(order.street);

    const city = await $('#InvoiceCity');
    await city
      .setValue(order.city);

    const zip = await $('#InvoiceZipCode');
    await zip
      .setValue(order.zip);

    const email = await $('#Email');
    await email
      .setValue(order.email);

    const phone = await $('#InvoicePhone');
    await phone
      .setValue(order.phone);

    const consent = await $('[for="GeneralTermsAndConditions"]');
    await consent
      .click();
  });

  it('Confirm order', async () => {

    const submitBtn = await $('#order-complete');
    await submitBtn
      .click();

    await expect(browser)
      .toHaveUrlContaining('/Order/Step4?hash');
  });
});
