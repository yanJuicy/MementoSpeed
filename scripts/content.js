// <video> 태그가 존재하면 속도 조절
const video = document.querySelector("video");
if (video) {
  video.playbackRate = 2;
}

// URL에서 videoId를 가져오기
function getCurrentVideoId() {
  return new URL(location.href).searchParams.get("v");
}

let currentVideoId = getCurrentVideoId();

// video 변경 감지
const targetNode = video;
const config = { attributes: true };
const callback = (mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "attributes" && mutation.attributeName === "src") {
      const newVideoId = getCurrentVideoId();
      if (currentVideoId !== newVideoId) {
        console.log("영상 변경!");
        currentVideoId = newVideoId;
        video.playbackRate = 2;
      }
    }
  }
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
