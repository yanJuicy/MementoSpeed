const channelPlaybackRate = document.getElementById("channelPlaybackRate");
const saveChannelButton = document.getElementById("saveChannelButton");

const videoSpeedSelect = document.getElementById("videoPlaybackRate");
const channelSpeedSelect = document.getElementById("channelPlaybackRate");

function init() {
  chrome.tabs
    .query({
      active: true,
      currentWindow: true,
    })
    .then((tabs) => {
      const tabId = tabs[0].id;
      console.log(`현재 활성 tab id: ${tabId}`);
      chrome.tabs
        .sendMessage(tabId, {
          type: "GET_CURRENT_SPEED",
        })
        .then(({ videoSpeed, channelSpeed }) => {
          videoSpeedSelect.value = videoSpeed;
          channelSpeedSelect.value = channelSpeed;
        });
    });
}

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

init();

saveVideoButton.addEventListener("click", () => {
  const videoSpeed = Number(videoSpeedSelect.value);
  sendMessageToActiveTab("SAVE_VIDEO_SPEED", videoSpeed);
});

saveChannelButton.addEventListener("click", () => {
  const channelSpeed = Number(channelSpeedSelect.value);
  sendMessageToActiveTab("SAVE_CHANNEL_SPEED", channelSpeed);
});
