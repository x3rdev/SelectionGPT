async function saveOptions(e) {
    e.preventDefault();
    await browser.storage.sync.set({
        api_key: document.querySelector("#api_key").value
    });
}

async function restoreOptions() {
    let res = await browser.storage.sync.get('api_key');
    document.querySelector("#api_key").value = res.api_key;
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);