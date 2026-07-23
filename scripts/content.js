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

const targetNode = document.body;
const config = { subtree: true, childList: true };
const callback = (mutationsList, observer) => {
  // 비디오 페이지가 아니면 종료
  if (!checkVideoPage()) {
    return;
  }

  // <video> 태그가 존재하면 속도 조절
  const video = findVideo();
  if (!video) {
    return;
  }

  const newVideoId = getCurrentVideoId();
  if (currentVideoId !== newVideoId) {
    handleVideoChange(video);
    currentVideoId = newVideoId;
  }

  // for (const mutation of mutationsList) {
  //   if (mutation.type === "childList") {
  //     const newVideoId = getCurrentVideoId();
  //     if (currentVideoId !== newVideoId) {
  //       handleVideoChange(video);
  //       currentVideoId = newVideoId;
  //     }
  //   }
  // }
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
