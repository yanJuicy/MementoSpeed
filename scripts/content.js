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
  console.log("영상 변경!");
  console.log(video);
  console.log(`video readyState: ${video.readyState}`);
  console.log(`video playbackRate: ${video.playbackRate}`);

  console.log("loadedmetadata 리스너 등록");
  video.addEventListener(
    "loadedmetadata",
    () => {
      applyPlaybackRate(video, 2);
    },
    { once: true },
  );
}

let currentVideoId = getCurrentVideoId();
let previousVideo = null;

const targetNode = document.body;
const config = { subtree: true, childList: true };
const callback = (mutationsList, observer) => {
  const video = findVideo();

  if (!video) return;
  if (previousVideo !== video) {
    console.log("영상 변경!");

    console.log(video);
    console.log(video.currentSrc);
  }
  previousVideo = video;
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);

document.addEventListener("yt-navigate-finish", () => {
  console.log("navigate finish");

  const video = findVideo();
  applyPlaybackRate(video, 2);
});
