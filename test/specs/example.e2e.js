
const baseUrl = 'https://alpinepro-outlet.cz';

describe('User journeys', () => {

  it('Put one item to cart', async () => {

    await browser
      .url(baseUrl);

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
});
