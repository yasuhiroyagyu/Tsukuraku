# 料理データ形式

Tsukurakuでは、料理・食材・別名・料理ごとの食材・手順を別テーブルで管理します。
CSVの5ファイル構成はそのまま活かし、アプリとの接続時に次のルールで変換します。

## CSVからアプリへの主な変換

| CSV | アプリ / DB | 変換ルール |
|---|---|---|
| `recipes.recipe_id` | `recipes.id` | URLにも使える英小文字のスラッグにする |
| `recipes.cooking_time` | `Recipe.cookingTime` | DBはsnake_case、画面ではcamelCaseへ変換 |
| `recipes.difficulty` | `Recipe.difficulty` | `1`は「簡単」、`2`と`3`は「普通」 |
| `recipes.servings` | `Recipe.servings` | 0より大きい数値 |
| `recipes.wattage` | `Recipe.wattage` | 電子レンジを使わない料理は`null` |
| `recipe_ingredients.amount` | `recipe_ingredients.quantity` | 数値として保存 |
| `recipe_ingredients.is_optional` | `RecipeIngredient.isOptional` | 任意食材は価格比較・買い物対象から除外 |
| `recipe_steps.step_number` | `Recipe.instructions` | 手順番号順に並べて画面へ渡す |
| `ingredient_aliases.alias_name` | OCR食材照合 | 正式名と合わせ、長い名称から部分一致させる |

## アプリ用に追加する項目

`recipes.csv`相当のデータには、画面表示に必要な次の値も用意します。

- `description`: 一覧・詳細用の短い説明
- `estimated_cost`: 固定価格を持たない場合は`null`
- `image_url`: 料理画像。未指定時は共通画像を使用
- `tags`: 「電子レンジ」「15分以内」「副菜」などの絞り込み用ラベル

料理内での食材順を保つため、`recipe_ingredients`には`sort_order`も追加します。

## IDと単位

食材IDは数値ではなく、既存のチラシ・在庫データと共通のスラッグを使います。
例は`chicken-mince`、`green-pepper`、`soy-sauce`です。

対応単位は`g`、`kg`、`ml`、`l`、`個`、`本`、`袋`、`パック`、`缶`、
`大さじ`、`小さじ`、`少々`です。価格比較では大さじを15ml、小さじを5mlとして
同じ体積単位の商品のみ換算します。重量と体積の相互変換は食材ごとの密度が必要なため行いません。

## Supabase

テーブル作成と今回の3料理の初期データは
`supabase/migrations/202607280001_recipe_catalog.sql`にまとめています。
フロントエンドでは`recipeRepository`がDBのsnake_caseと関連テーブルを
画面用の`Recipe`へ変換します。
