# megaport-lineup-picker

## 大港開唱 Lineup 勾選工具

在大港開唱的 lineup 圖上直接點選想看的藝人，產出標記後的圖片、文字行程或 ICS 日曆檔。

## 功能

- 點擊 lineup 圖片上的藝人名稱來勾選 / 取消
- 勾選狀態自動儲存於 localStorage
- 下載標記後的 lineup 圖片（PNG）
- 複製文字版行程到剪貼簿
- 匯出 ICS 日曆檔（可匯入 Google Calendar、Apple Calendar 等）

## 技術

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4
- Canvas API 繪製圈選標記
- [ics](https://www.npmjs.com/package/ics) 產生符合 RFC 5545 的日曆檔
- [sonner](https://www.npmjs.com/package/sonner) toast 通知

## 開發

```bash
npm install
npm run dev
```

開啟 http://localhost:3000。

## 座標編輯器

用來標註每位藝人在 lineup 圖片上的位置，產出 JSON 資料檔。

```bash
npm run editor
```

開啟 http://localhost:3456，在圖片上拖曳框選藝人區域，填入名稱、舞台、時間後匯出 JSON。

## 資料格式

藝人資料放在 `src/data/day{N}.json`，格式如下：

```json
{
  "day": 1,
  "date": "2026-03-21",
  "imageFile": "day1.jpg",
  "artists": [
    {
      "id": "d1-01",
      "name": "椅子樂團",
      "stage": "南霸天",
      "startTime": "2026-03-21T12:30",
      "endTime": "2026-03-21T13:10",
      "area": { "x": 0.1053, "y": 0.0791, "width": 0.0883, "height": 0.0685 }
    }
  ]
}
```

`area` 的座標為相對值（0\~1），`x`/`y` 為中心點，`width`/`height` 為寬高。

## 專案結構

```
src/
  app/           # Next.js App Router 頁面
  components/    # React 元件
  data/          # 各日 lineup 資料 (JSON)
  lib/           # 工具函式（canvas、ics、storage、format）
  types/         # TypeScript 型別定義
public/images/   # lineup 圖片與圈選 SVG
tools/           # 座標編輯器（獨立 HTTP server）
```
