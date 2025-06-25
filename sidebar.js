browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "updateSidebar") {
        document.getElementById("response").innerHTML = markdown(message.content);
    }
});