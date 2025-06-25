function onCreated() {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

const instructions = `
You will be provided with selected quiz question, think carefully through the question, then give the answer clearly
If it doesnt seem like a question, say "not enough context"
`;

async function aiQuery(info) {
  // await updateSidebar(" Llanfairpwllgwyngyllgogerychwyrndrobwllllantysiliogogogoch ")
  let res = await browser.storage.sync.get('api_key');
  await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer `+ res.api_key
    },
    body: JSON.stringify({
      model: "o4-mini",
      reasoning: {"effort": "medium"},
      input: [
        { role: "system", content: instructions },
        { role: "user", content: info.selectionText }
      ]
    })
  })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('Response:', data);
        console.log('Generated Text:', data.output[1].content[0].text);
        updateSidebar(data.output[1].content[0].text)
      });
}

async function updateSidebar(text) {
  await browser.runtime.sendMessage({
    type: 'updateSidebar',
    content: text
  })
}

browser.menus.create({
  id: "ai_query",
  title: browser.i18n.getMessage("ai_query"),
  contexts: ["selection"]
}, onCreated);

browser.menus.onClicked.addListener(async (info, tab) => {
  switch (info.menuItemId) {
    case "ai_query": {
      await browser.sidebarAction.open()
      await aiQuery(info);
    }
  }
});





