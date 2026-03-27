# ByBanx BYB025 — Official Web3 Landing Website

> bybanx.com · byb025.com

## 關於

ByBanx 幣友圈 (BYB025) 是結合 RWA 現實資產、人類節點挖礦、全球加密支付與文娛 NFT 生態的下一代 Web3 平台。

本倉庫為 ByBanx 官方落地頁源代碼。

## 文件結構

```
bybanx/
├── index.html          # 主頁面（完整落地頁）
├── css/
│   └── style.css       # 全局樣式（玻璃擬態 + 響應式）
├── js/
│   └── main.js         # 動畫與交互邏輯
├── assets/
│   └── favicon.svg     # 網站圖標
├── server.py           # 本地開發服務器
└── README.md           # 說明文件
```

## 頁面章節

| # | 區塊 | 說明 |
|---|------|------|
| 1 | **Hero** | Canvas 粒子動畫 + App Mockup + 實時數據浮卡 |
| 2 | **核心功能** | 挖礦、支付、RWA NFT、Mini App |
| 3 | **RWA 生態** | 文娛/文創雙驅動 + NFT 覆蓋卡 |
| 4 | **人類節點** | 4步驟入網流程 + 節點身份動畫卡 |
| 5 | **核心產業** | 康旅研學、文創商貿、影視出品、演藝製作 |
| 6 | **生態優勢** | 虛實閉環可視化 |
| 7 | **路線圖** | Phase 1~5 時間軸 |
| 8 | **代幣經濟** | Canvas 甜甜圈圖（BYB 10億分配） |
| 9 | **下載** | 邀請碼 BYB025 + QR碼 + 應用商店按鈕 |
| 10 | **白皮書** | 5章節文件預覽 |
| 11 | **Footer** | 社交連結 + 法律聲明 |

## 本地運行

```bash
python3 bybanx/server.py
# 訪問 http://localhost:3000
```

## 技術棧

- **純 HTML5 / CSS3 / Vanilla JS** — 零外部依賴
- **Canvas API** — 粒子網絡動畫 + 代幣分配圖表
- **Intersection Observer** — 滾動觸發動畫
- **CSS 自定義屬性** — 主題化設計系統
- **玻璃擬態 UI** — 海軍藍 + 金色品牌色

## 靈感來源

架構參考 [InterLINK Labs](https://interlinklabs.ai/) 的 App 技術邏輯與運營思路，品牌內容融合 [bybanx.com](https://bybanx.com/) 的 RWA/文娛文創生態。

---

© 2025 ByBanx · 敦華集團 · All rights reserved.
