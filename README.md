# Tsukuraku

## ターゲット

筑波大学生

## 解決したい課題

筑波大学周辺には多くのスーパーマーケットがあるため、次のような課題があります。

* どのスーパーマーケットに行けば、食材を安く購入できるのか分からない
* 簡単で安い料理を考えるのが面倒
* 料理を決めた後、買い出し前に家にある食材や調味料を確認するのが面倒
* 必要な食材を整理して買い物リストを作るのが面倒

## サービス概要

Tsukurakuは、筑波大学周辺のスーパーマーケットのチラシ情報をもとに、安く作れる料理を提案し、必要な食材の買い物リストを自動で生成するサービスです。

## 実装方法

1. 筑波大学周辺のスーパーマーケットのチラシを取得する
2. チラシ画像をOCRで読み取り、商品名や価格を認識する
3. 各スーパーマーケットの商品価格を比較する
4. データベースに登録された料理の中から、安く作れる料理を選択する
5. 選択された料理をもとに、必要な食材を抽出する
6. 家にある食材を除外し、買い物リストを自動生成する

## システム構成

```text
フロントエンド
React + TypeScript + Vite
        ↓
Supabase JavaScript Client
        ↓
バックエンド
Supabase
├── PostgreSQL
├── Auth
├── Storage
└── Edge Functions
        ↓
OCR
Google Cloud Vision API
```

## 使用技術

### フロントエンド

* React
* TypeScript
* Vite

### バックエンド・データベース

* Supabase
* PostgreSQL
* Supabase Auth
* Supabase Storage
* Supabase Edge Functions
* Supabase JavaScript Client

### OCR

* Google Cloud Vision API

## メンバー

* 北川 裕樹
* 中塚 さくら
* 柳生 康博
* 藤原 安路
