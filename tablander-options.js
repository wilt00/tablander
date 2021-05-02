function saveOptions(e) {
  const sites = document
    .querySelector("#sites")
    .value.split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  browser.storage.sync.set({ sites });
  e.preventDefault();
}

async function restoreOptions() {
  const { sites } = await browser.storage.sync.get("sites");
  document.querySelector("#sites").value = (sites || []).join('\n');
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
