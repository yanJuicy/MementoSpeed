# Memento Speed

YouTube 영상의 재생 속도를 자동으로 관리하는 Chrome Extension입니다.

사용자가 원하는 재생 속도를 저장하고, YouTube 영상 시청 시 자동으로 적용하는 것을 목표로 합니다.

현재는 Popup을 통한 **영상별·채널별 재생 속도 설정**, 저장된 속도 조회, Chrome Storage 저장, 영상별 및 채널별 자동 재생 속도 적용 기능을 구현했으며, 향후 카테고리별 속도 관리와 AI 기반 재생 속도 추천 기능까지 확장할 예정입니다.

---

# 📌 프로젝트 목적

YouTube를 시청하면서 콘텐츠 유형에 따라 원하는 재생 속도가 다르다는 문제에서 시작했습니다.

예:

- 강의 → 1.5 ~ 2배속
- 기술 영상 → 1.5배속
- 음악 → 1배속
- 팟캐스트 → 2배속

하지만 YouTube 기본 기능에서는 매번 직접 재생 속도를 변경해야 합니다.

Memento Speed는 이러한 반복 작업을 자동화하여 사용자 맞춤형 시청 경험을 제공하는 것을 목표로 합니다.

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

Popup에서 영상과 채널의 재생 속도를 각각 설정할 수 있습니다.

Popup을 열면 현재 영상과 현재 채널에 저장된 재생 속도를 자동으로 조회하여 Select에 표시합니다.

사용자는 현재 저장된 설정을 확인하고 바로 수정할 수 있습니다.

### 지원 속도

- 1x
- 1.25x
- 1.5x
- 1.75x
- 2x

---

## ✅ 영상별 재생 속도 저장

`chrome.storage.local`을 활용하여 영상별 재생 속도를 저장합니다.

저장 구조

```json
{
  "videos": {
    "youtube_video_id": {
      "videoId": "youtube_video_id",
      "speed": 2
    }
  }
}
```

예시

```json
{
  "videos": {
    "VPq8SNXWDCQ": {
      "videoId": "VPq8SNXWDCQ",
      "speed": 2
    },
    "abc123": {
      "videoId": "abc123",
      "speed": 1.5
    }
  }
}
```

---

## ✅ 채널별 재생 속도 저장

현재 영상의 채널 정보를 이용하여 채널별 재생 속도를 저장합니다.

현재는 채널 URL의 Handle(`@channelName`)를 식별자로 사용합니다.

저장 구조

```json
{
  "channels": {
    "@codingpe": {
      "channelId": "@codingpe",
      "speed": 1.75
    }
  }
}
```

예시

```json
{
  "channels": {
    "@codingpe": {
      "channelId": "@codingpe",
      "speed": 1.75
    },
    "@thinklighthouse_company": {
      "channelId": "@thinklighthouse_company",
      "speed": 1
    }
  }
}
```

---

## ✅ 재생 속도 우선순위 적용

영상을 열면 저장된 설정을 다음 우선순위로 확인합니다.

```
영상별 설정

↓

채널별 설정

↓

YouTube 기본 재생 속도
```

동작 과정

```
yt-navigate-finish

↓

현재 videoId 확인

↓

영상 설정 존재?

↓

YES → 저장된 영상 속도 적용

↓

NO

↓

현재 channelId 확인

↓

채널 설정 존재?

↓

YES → 저장된 채널 속도 적용

↓

NO

↓

YouTube 기본 속도 유지
```

가장 구체적인 설정이 가장 높은 우선순위를 갖도록 설계했습니다.

---

## ✅ Popup ↔ Content Script 메시지 통신

Popup은 Storage를 직접 접근하지 않고 Content Script와만 통신합니다.

### 지원 메시지

- `GET_CURRENT_SPEED`
- `SAVE_VIDEO_SPEED`
- `SAVE_CHANNEL_SPEED`

### 현재 저장된 속도 조회

```
Popup

↓

GET_CURRENT_SPEED

↓

Content Script

↓

chrome.storage.local.get()

↓

{
    videoSpeed,
    channelSpeed
}

↓

Popup Select 갱신
```

### 저장 및 즉시 적용

```
Popup

↓

SAVE_VIDEO_SPEED
또는
SAVE_CHANNEL_SPEED

↓

Content Script

↓

현재 영상 재생 속도 즉시 변경

↓

Storage 저장
```

Popup은 사용자 입력과 화면 표시만 담당하며,

YouTube 정보 조회와 Storage 관리는 Content Script가 담당하도록 책임을 분리했습니다.

---

## ✅ YouTube SPA Navigation 대응

YouTube는 페이지 이동 시 전체 새로고침이 발생하지 않는 SPA 구조입니다.

초기에는 `MutationObserver`를 사용하여 DOM 변화를 감지했지만,

로그 분석 결과

```
DOM 변경 ≠ 영상 변경
```

이라는 사실을 확인했습니다.

현재는 YouTube에서 제공하는 Navigation Event를 사용합니다.

```
yt-navigate-finish

↓

video 탐색

↓

현재 videoId 확인

↓

영상 설정 확인

↓

채널 설정 확인

↓

재생 속도 적용
```

---

# 🔍 개발 과정에서 배운 점

## MutationObserver와 SPA Navigation의 차이

처음에는 DOM 변경을 감지하면 영상 변경도 감지할 수 있다고 생각했습니다.

하지만 실제 로그를 분석해보니

```
DOM 변경 ≠ 영상 변경
```

이라는 사실을 확인했습니다.

따라서 역할을 다음과 같이 분리했습니다.

```
DOM 변화 감지

↓

MutationObserver
```

```
페이지 이동 감지

↓

yt-navigate-finish
```

플랫폼에서 제공하는 이벤트가 있다면 DOM 감시보다 해당 이벤트를 사용하는 것이 더 적절하다는 것을 학습했습니다.

---

## chrome.storage 데이터 관리

Chrome Storage는 DB의 UPDATE처럼 일부 데이터만 수정하는 방식이 아닙니다.

데이터 변경 흐름

```
chrome.storage.local.get()

↓

기존 데이터 조회

↓

JavaScript 객체 수정

↓

chrome.storage.local.set()
```

이 방식을 이용하여 영상별·채널별 설정을 관리하도록 구현했습니다.

---

## 메시지 타입을 이용한 책임 분리

초기에는 하나의 기능만 존재했기 때문에

```javascript
{
  playbackRate: 2;
}
```

형태의 메시지를 사용했습니다.

기능이 늘어나면서

```javascript
{
  type: "SAVE_VIDEO_SPEED",
  playbackRate: 2
}
```

```javascript
{
  type: "SAVE_CHANNEL_SPEED",
  playbackRate: 2
}
```

```javascript
{
  type: "GET_CURRENT_SPEED";
}
```

처럼 메시지 타입을 분리했습니다.

이를 통해 향후

- 카테고리 저장
- 설정 삭제
- 설정 초기화

등의 기능도 쉽게 확장할 수 있도록 설계했습니다.

---

## Popup과 Content Script의 책임 분리

Popup은 Storage를 직접 접근하지 않습니다.

현재 구조에서는

- Popup → 사용자 입력과 화면 표시
- Content Script → YouTube 정보 조회 및 Storage 관리

로 역할을 분리했습니다.

이를 통해 UI와 비즈니스 로직을 독립적으로 유지할 수 있도록 설계했습니다.

---

## 재생 속도 우선순위 설계

재생 속도는 여러 기준에서 설정될 수 있기 때문에 우선순위를 정의했습니다.

```
영상

↓

채널

↓

YouTube 기본 설정
```

가장 구체적인 설정이 가장 높은 우선순위를 가지도록 설계하여 사용자의 의도가 항상 우선되도록 구현했습니다.

---

## 비동기 처리와 메시지 응답

Popup에서 현재 저장된 속도를 조회하기 위해 `sendResponse()`를 사용했습니다.

Chrome Storage 조회는 비동기로 동작하기 때문에 메시지 리스너가 종료되지 않도록 `return true`를 반환해야 한다는 점을 학습했습니다.

동작 과정

```
Popup

↓

GET_CURRENT_SPEED

↓

Content Script

↓

chrome.storage.local.get()

↓

sendResponse()

↓

Popup에서 응답 수신
```

이를 통해 Chrome Extension의 메시지 응답 구조와 비동기 처리 방식을 이해할 수 있었습니다.

---

# 🚧 개발 예정 기능

## 1. 카테고리별 재생 속도 저장

콘텐츠 유형에 따라 기본 재생 속도를 저장합니다.

예

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

## 2. AI 기반 재생 속도 추천

사용자의 시청 패턴과 영상 정보를 활용하여 적절한 재생 속도를 추천하는 기능을 목표로 합니다.

예상 구조

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
│   ├── content.js
│   └── popup.js
└── README.md
```

---

# 📚 Reference

- Chrome Extensions
  - https://developer.chrome.com/docs/extensions/

- Chrome Storage API
  - https://developer.chrome.com/docs/extensions/reference/api/storage

- Chrome Tabs API
  - https://developer.chrome.com/docs/extensions/reference/api/tabs

- Chrome Runtime Messaging
  - https://developer.chrome.com/docs/extensions/develop/concepts/messaging
