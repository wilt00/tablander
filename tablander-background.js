(() => {
  const getFilteredSites = () =>
    browser.storage.sync
      .get("sites")
      .then(({ sites }) => sites.map((u) => ({ hostContains: u })));

  async function thereCanOnlyBeOne({ tabId, url }) {
    const { cookieStoreId: containerName } = await browser.tabs.get(tabId);

    const existingTabs = await browser.tabs.query({ url });

    if (!Array.isArray(existingTabs)) return;

    const matchingTabs = existingTabs.filter(
      (t) => t.id !== tabId && t.cookieStoreId === containerName
    );

    if (matchingTabs[0]) {
      browser.tabs.remove(tabId);
      browser.tabs.highlight({
        populate: false,
        tabs: [matchingTabs[0].index],
        windowId: matchingTabs[0].windowId,
      });
    }
  }

  async function registerNavListener() {
    const filteredSites = await getFilteredSites();
    if (Array.isArray(filteredSites) && filteredSites.length >= 1) {
      browser.webNavigation.onBeforeNavigate.addListener(thereCanOnlyBeOne, {
        url: filteredSites,
      });
    }
  }

  browser.storage.onChanged.addListener(() => {
    browser.webNavigation.onBeforeNavigate.removeListener(thereCanOnlyBeOne);
    registerNavListener();
  });

  registerNavListener();
})();
