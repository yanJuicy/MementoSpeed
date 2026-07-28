// URL에서 videoId를 가져오기
function getCurrentVideoId() {
  return new URL(location.href).searchParams.get("v");
}

// video 시청 페이지인지 확인
function checkVideoPage() {
  return location.pathname === "/watch";
}

function findVideo() {
  return document.querySelector("video");
}

function applyPlaybackRate(video, playbackRate) {
  console.log(`${playbackRate}로 속도 조절`);
  video.playbackRate = playbackRate;
}

function handleVideoChange(video) {
  console.log(`video readyState: ${video.readyState}`);
  console.log(`video playbackRate: ${video.playbackRate}`);

  chrome.storage.local.get(["videos", "channels"], ({ videos, channels }) => {
    const videoId = getCurrentVideoId();
    if (videos && videos[videoId]) {
      const storedVideoSpeed = videos[videoId].speed;
      console.log(`playbackRate: ${storedVideoSpeed}`);
      applyPlaybackRate(video, storedVideoSpeed);
      return;
    }

    const channelId = getCurrentChannelId();
    if (channels && channels[channelId]) {
      const storedChannelSpeed = channels[channelId].speed;
      console.log(`playbackRate: ${storedChannelSpeed}`);
      applyPlaybackRate(video, storedChannelSpeed);
      return;
    }
  });
}

function getCurrentChannelId() {
  const channel = document.querySelector(
    "ytd-video-owner-renderer #channel-name a",
  );
  return channel.href.split("/").pop();
}

function saveVideoSpeed(videoSpeed) {
  chrome.storage.local.get("videos", ({ videos }) => {
    const newVideos = videos ?? {};
    const videoId = getCurrentVideoId();

    newVideos[videoId] = {
      videoId: videoId,
      speed: videoSpeed,
    };

    chrome.storage.local.set({
      videos: newVideos,
    });
  });
}

function saveChannelSpeed(videoSpeed) {
  chrome.storage.local.get("channels", ({ channels }) => {
    const newChannels = channels ?? {};
    const channelId = getCurrentChannelId();

    newChannels[channelId] = {
      channelId: channelId,
      speed: videoSpeed,
    };

    chrome.storage.local.set({
      channels: newChannels,
    });
  });
}

document.addEventListener("yt-navigate-finish", () => {
  console.log("navigate finish");

  const video = findVideo();
  handleVideoChange(video);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const video = findVideo();

  const type = message.type;
  const speed = message.playbackRate;

  switch (type) {
    case "SAVE_VIDEO_SPEED":
      saveVideoSpeed(speed);
      break;
    case "SAVE_CHANNEL_SPEED":
      saveChannelSpeed(speed);
      break;
  }

  applyPlaybackRate(video, speed);
});
