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

  chrome.storage.local.get("playbackRate", ({ playbackRate }) => {
    const storedVideoSpeed = playbackRate ?? 1;

    console.log(`playbackRate: ${storedVideoSpeed}`);
    applyPlaybackRate(video, storedVideoSpeed);
  });

  // console.log("loadedmetadata 리스너 등록");
  // video.addEventListener("loadedmetadata", () => {
  //   chrome.storage.local.get("playbackRate", ({ playbackRate }) => {
  //     applyPlaybackRate(video, playbackRate);
  //   });
  // });
}

document.addEventListener("yt-navigate-finish", () => {
  console.log("navigate finish");

  const video = findVideo();
  handleVideoChange(video);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const video = findVideo();
  applyPlaybackRate(video, message.playbackRate);
});
