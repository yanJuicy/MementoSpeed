# Memento Speed

YouTube 영상의 재생 속도를 자동으로 관리하는 Chrome Extension입니다.

사용자가 원하는 재생 속도를 저장하고, YouTube 영상 시청 시 자동으로 적용하는 것을 목표로 합니다.

현재는 기본 재생 속도 저장 및 Popup을 통한 즉시 변경 기능을 구현하고 있으며,
향후 영상별, 채널별, 카테고리별 속도 관리와 AI 기반 추천 기능까지 확장할 예정입니다.

---

# 📌 프로젝트 목적

YouTube를 시청하면서 콘텐츠 유형에 따라 원하는 재생 속도가 다르다는 문제에서 시작했습니다.

예:

- 강의 → 1.5 ~ 2배속
- 기술 영상 → 1.5배속
- 음악 → 1배속
- 팟캐스트 → 2배속

하지만 YouTube 기본 기능에서는 매번 직접 재생 속도를 변경해야 합니다.

Memento Speed는 이러한 반복 작업을 자동화하여  
사용자 맞춤형 시청 경험을 제공하는 것을 목표로 합니다.

---

# 🛠 기술 스택

## Browser Extension

- Chrome Extension Manifest V3
- JavaScript
- HTML
- CSS

## Chrome APIs

- chrome.storage
- chrome.tabs
- chrome.runtime messaging

---

# 🏗 현재 구현 기능

## ✅ Popup UI

사용자가 원하는 재생 속도를 선택할 수 있습니다.

지원 속도:

- 1x
- 1.25x
- 1.5x
- 1.75x
- 2x

---

## ✅ 재생 속도 저장

`chrome.storage.local`을 활용하여 사용자가 선택한 속도를 저장합니다.

현재 저장 구조:

```json
{
  "playbackRate": 1.5
}
```

저장된 값은 브라우저를 종료해도 유지됩니다.

---

## ✅ Popup → Content Script 메시지 통신

Popup에서 변경한 속도를 현재 YouTube 페이지에 즉시 적용합니다.

동작 구조:

```
Popup
 |
 | chrome.storage.local.set()
 |
 | chrome.tabs.query()
 |
 | chrome.tabs.sendMessage()
 ↓
Content Script
 |
 | chrome.runtime.onMessage()
 ↓
video.playbackRate 변경
```

---

## ✅ YouTube SPA Navigation 대응

YouTube는 페이지 이동 시 전체 새로고침이 발생하지 않는 SPA 구조입니다.

초기에는 `MutationObserver`를 사용하여 DOM 변화를 감지했지만,
로그 분석 결과 DOM 변경과 영상 변경은 서로 다른 개념이라는 것을 확인했습니다.

현재는 YouTube가 제공하는 Navigation Event를 활용합니다.

```
yt-navigate-finish
        |
        ↓
video 탐색
        |
        ↓
저장된 재생 속도 적용
```

---

# 🔍 개발 과정에서 배운 점

## MutationObserver와 SPA Navigation의 차이

처음에는 DOM 변경을 감지하면 영상 변경을 알 수 있다고 생각했습니다.

하지만 YouTube에서는:

```
DOM 변경 ≠ 영상 변경
```

이라는 것을 확인했습니다.

따라서 역할을 분리했습니다.

```
DOM 변화 감지
        ↓
MutationObserver


페이지 이동 감지
        ↓
YouTube Navigation Event
```

플랫폼에서 제공하는 이벤트가 있다면 DOM 감시보다 해당 이벤트를 사용하는 것이 적절하다는 것을 학습했습니다.

---

## 비동기 처리와 Promise

Chrome API는 비동기 작업이 많기 때문에 Promise 기반으로 동작합니다.

예:

```javascript
const tabs = await chrome.tabs.query({
  active: true,
  currentWindow: true,
});
```

결과가 준비된 후 데이터를 사용하는 흐름을 이해했습니다.

---

# 🚧 개발 예정 기능

## 1. 영상별 재생 속도 저장

현재:

```json
{
  "playbackRate": 1.5
}
```

개선:

```json
{
  "videos": {
    "youtube_video_id": 1.5
  }
}
```

특정 영상마다 다른 재생 속도를 저장할 예정입니다.

---

## 2. 채널별 재생 속도 저장

채널마다 원하는 재생 속도를 저장합니다.

예:

```
개발 강의 채널 → 1.75배
음악 채널 → 1배
```

---

## 3. 카테고리별 자동 속도 설정

콘텐츠 유형에 따라 기본 재생 속도를 설정합니다.

예:

```
Music
 → 1.0x

Lecture
 → 1.75x

Podcast
 → 2.0x

News
 → 2.0x
```

---

## 4. AI 기반 재생 속도 추천

장기적으로 사용자의 시청 패턴과 영상 정보를 활용하여
적절한 재생 속도를 추천하는 기능을 목표로 합니다.

예상 구조:

```
YouTube Metadata

        ↓

BERT Embedding

        ↓

Vector

        ↓

Cosine Similarity

        ↓

Speed Recommendation

        ↓

User Feedback
```

---

# 📂 프로젝트 구조

```
Memento-Speed

├── manifest.json

├── popup.html
├── popup.css

├── scripts
│   ├── popup.js
│   └── content.js

└── README.md
```

---

# 📚 Reference

Chrome Extensions Documentation  
https://developer.chrome.com/docs/extensions/

Chrome Storage API  
https://developer.chrome.com/docs/extensions/reference/api/storage

Chrome Tabs API  
https://developer.chrome.com/docs/extensions/reference/api/tabs

Chrome Messaging  
https://developer.chrome.com/docs/extensions/develop/concepts/messaging
