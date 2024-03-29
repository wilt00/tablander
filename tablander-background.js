(() => {
  /** @returns {Promise<string[] | unknown>} */
  const getSites = () =>
    browser.storage.sync.get('sites').then(s => s.sites || []);

  /** @param {string[]} sites */
  const buildFilter = sites => ({
    url: sites.map(u => ({ urlMatches: u })),
  });

  /** @param {string[]} sites */
  const thereCanOnlyBeOne =
    sites =>
    async ({ tabId, url }) => {
      console.log({ tabId, url, sites });
      const { cookieStoreId } = await browser.tabs.get(tabId);

      // Go through list of sites - find one that matches current url - use that in tabs.query
      // sites.filter()

      const existingTabs = await browser.tabs.query({ url, cookieStoreId });

      console.log({ existingTabs });

      if (!Array.isArray(existingTabs)) return;

      const matchingTabs = existingTabs.filter(t => t.id !== tabId);

      console.log({ matchingTabs });

      if (matchingTabs[0]) {
        browser.tabs.remove(tabId);
        browser.tabs.highlight({
          populate: false,
          tabs: [matchingTabs[0].index],
          windowId: matchingTabs[0].windowId,
        });
      }
    };

  let currentListener;

  async function registerNavListener() {
    const sites = await getSites();
    if (Array.isArray(sites) && sites.length >= 1) {
      currentListener = thereCanOnlyBeOne(sites);
      browser.webNavigation.onBeforeNavigate.addListener(
        currentListener,
        buildFilter(sites)
      );
    }
  }

  browser.storage.onChanged.addListener(() => {
    if (currentListener) {
      browser.webNavigation.onBeforeNavigate.removeListener(currentListener);
    }
    registerNavListener();
  });

  registerNavListener();
})();
