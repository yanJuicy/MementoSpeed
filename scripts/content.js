// URL에서 videoId를 가져오기
function getCurrentVideoId() {
  return new URL(location.href).searchParams.get("v");
}

// video 시청 페이지인지 확인
function checkVideoPage() {
  return location.pathname === "/watch";
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
  const video = document.querySelector("video");
  if (!video) {
    return;
  }
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      const newVideoId = getCurrentVideoId();
      if (currentVideoId !== newVideoId) {
        console.log("영상 변경!");
        console.log(video);
        console.log(video.readyState);
        console.log(video.playbackRate);
        currentVideoId = newVideoId;
        video.addEventListener("loadedmetadata", () => {
          console.log("영상속도변경");
          video.playbackRate = 2;
        });
      }
    }
  }
};
const observer = new MutationObserver(callback);
observer.observe(targetNode, config);
