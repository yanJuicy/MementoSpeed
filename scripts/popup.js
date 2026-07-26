const playbackRate = document.getElementById("playbackRate");
const saveButton = document.getElementById("saveButton");

saveButton.addEventListener("click", () => {
  const videoSpeed = Number(playbackRate.value);
  chrome.storage.local.set({
    playbackRate: videoSpeed,
  });

  chrome.tabs
    .query({
      active: true,
      currentWindow: true,
    })
    .then((tabs) => {
      const tabId = tabs[0].id;
      console.log(tabId);
      chrome.tabs.sendMessage(tabId, { playbackRate: videoSpeed });
    });
});
