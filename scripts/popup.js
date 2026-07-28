const videoPlaybackRate = document.getElementById("videoPlaybackRate");
const saveVideoButton = document.getElementById("saveVideoButton");

const channelPlaybackRate = document.getElementById("channelPlaybackRate");
const saveChannelButton = document.getElementById("saveChannelButton");

function sendMessageToActiveTab(type, playbackRate) {
  chrome.tabs
    .query({
      active: true,
      currentWindow: true,
    })
    .then((tabs) => {
      const tabId = tabs[0].id;
      console.log(`현재 활성 tab id: ${tabId}`);
      chrome.tabs.sendMessage(tabId, {
        type,
        playbackRate,
      });
    });
}

saveVideoButton.addEventListener("click", () => {
  const videoSpeed = Number(videoPlaybackRate.value);
  sendMessageToActiveTab("SAVE_VIDEO_SPEED", videoSpeed);
});

saveChannelButton.addEventListener("click", () => {
  const channelSpeed = Number(channelPlaybackRate.value);
  sendMessageToActiveTab("SAVE_CHANNEL_SPEED", channelSpeed);
});
