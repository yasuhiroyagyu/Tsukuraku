-- 電子レンジ料理CSVを、Tsukurakuで利用する正規化テーブルへ取り込む初期スキーマ。
-- 料理の固定価格は持たず、estimated_cost は null のまま店舗比較で算出する。

create table if not exists public.ingredients (
  id text primary key,
  name text not null unique,
  category text not null,
  standard_unit text not null,
  is_seasoning boolean not null default false
);

create table if not exists public.ingredient_aliases (
  alias_name text primary key,
  ingredient_id text not null references public.ingredients(id) on update cascade on delete cascade
);

create table if not exists public.recipes (
  id text primary key,
  name text not null,
  description text not null default '',
  cooking_time integer not null check (cooking_time > 0),
  estimated_cost integer check (estimated_cost is null or estimated_cost >= 0),
  difficulty text not null check (difficulty in ('簡単', '普通')),
  servings numeric not null default 1 check (servings > 0),
  category text not null,
  wattage integer check (wattage is null or wattage > 0),
  image_url text,
  tags text[] not null default '{}'
);

create table if not exists public.recipe_ingredients (
  recipe_id text not null references public.recipes(id) on update cascade on delete cascade,
  ingredient_id text not null references public.ingredients(id) on update cascade,
  quantity numeric not null check (quantity > 0),
  unit text not null,
  is_optional boolean not null default false,
  sort_order integer not null check (sort_order > 0),
  primary key (recipe_id, ingredient_id)
);

create table if not exists public.recipe_steps (
  recipe_id text not null references public.recipes(id) on update cascade on delete cascade,
  step_number integer not null check (step_number > 0),
  instruction text not null,
  primary key (recipe_id, step_number)
);

create index if not exists recipe_ingredients_recipe_id_idx
  on public.recipe_ingredients(recipe_id);
create index if not exists recipe_steps_recipe_id_idx
  on public.recipe_steps(recipe_id);
create index if not exists ingredient_aliases_ingredient_id_idx
  on public.ingredient_aliases(ingredient_id);

insert into public.ingredients (id, name, category, standard_unit, is_seasoning) values
  ('rice', 'ご飯', '主食', 'g', false),
  ('chicken-mince', '鶏ひき肉', '肉', 'g', false),
  ('soy-sauce', 'しょうゆ', '調味料', 'ml', true),
  ('sugar', '砂糖', '調味料', 'g', true),
  ('mirin', 'みりん', '調味料', 'ml', true),
  ('ginger', 'しょうが', '香味野菜', 'g', false),
  ('pasta', 'スパゲッティ', '主食', 'g', false),
  ('sausage', 'ウインナー', '肉加工品', '本', false),
  ('onion', '玉ねぎ', '野菜', '個', false),
  ('green-pepper', 'ピーマン', '野菜', '個', false),
  ('ketchup', 'ケチャップ', '調味料', 'g', true),
  ('water', '水', 'その他', 'ml', true),
  ('oil', 'サラダ油', '調味料', 'ml', true),
  ('salt', '塩', '調味料', 'g', true),
  ('pepper', 'こしょう', '調味料', 'g', true),
  ('tuna', 'ツナ缶', '魚加工品', '缶', false),
  ('chicken-stock', '鶏がらスープの素', '調味料', 'g', true),
  ('sesame-oil', 'ごま油', '調味料', 'ml', true)
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  standard_unit = excluded.standard_unit,
  is_seasoning = excluded.is_seasoning;

insert into public.ingredient_aliases (alias_name, ingredient_id) values
  ('鶏ミンチ', 'chicken-mince'),
  ('とりひき肉', 'chicken-mince'),
  ('若鶏ひき肉', 'chicken-mince'),
  ('パスタ', 'pasta'),
  ('スパゲティ', 'pasta'),
  ('スパゲッティー', 'pasta'),
  ('ソーセージ', 'sausage'),
  ('あらびきウインナー', 'sausage'),
  ('玉葱', 'onion'),
  ('たまねぎ', 'onion'),
  ('ぴーまん', 'green-pepper'),
  ('ツナ', 'tuna'),
  ('まぐろ油漬け', 'tuna'),
  ('ライトツナ', 'tuna'),
  ('鶏ガラスープの素', 'chicken-stock')
on conflict (alias_name) do update set ingredient_id = excluded.ingredient_id;

insert into public.recipes (
  id, name, description, cooking_time, estimated_cost, difficulty,
  servings, category, wattage, image_url, tags
) values
  (
    'soboro-don',
    'そぼろ丼',
    '甘辛い鶏そぼろを電子レンジだけで作る、1人分の手軽などんぶり。',
    12,
    null,
    '普通',
    1,
    'ご飯もの',
    600,
    'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80',
    array['15分以内', '電子レンジ', '丼・ご飯', '肉料理', '洗い物が少ない']
  ),
  (
    'microwave-napolitan',
    'ナポリタン',
    '麺も具材もひとつの耐熱容器で仕上げる、電子レンジの定番パスタ。',
    15,
    null,
    '普通',
    1,
    '麺類',
    600,
    'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80',
    array['15分以内', '電子レンジ', '麺', '洗い物が少ない']
  ),
  (
    'infinite-green-pepper',
    '無限ピーマン',
    'ツナのうま味でピーマンがたっぷり食べられる、電子レンジ副菜。',
    7,
    null,
    '簡単',
    1,
    '副菜',
    600,
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80',
    array['10分以内', '電子レンジ', '副菜', '洗い物が少ない']
  )
on conflict (id) do update set
  name = excluded.name,
  description = excluded.description,
  cooking_time = excluded.cooking_time,
  estimated_cost = excluded.estimated_cost,
  difficulty = excluded.difficulty,
  servings = excluded.servings,
  category = excluded.category,
  wattage = excluded.wattage,
  image_url = excluded.image_url,
  tags = excluded.tags;

insert into public.recipe_ingredients (
  recipe_id, ingredient_id, quantity, unit, is_optional, sort_order
) values
  ('soboro-don', 'rice', 200, 'g', false, 1),
  ('soboro-don', 'chicken-mince', 100, 'g', false, 2),
  ('soboro-don', 'soy-sauce', 1, '大さじ', false, 3),
  ('soboro-don', 'sugar', 1, '小さじ', false, 4),
  ('soboro-don', 'mirin', 1, '小さじ', false, 5),
  ('soboro-don', 'ginger', 0.5, '小さじ', true, 6),
  ('microwave-napolitan', 'pasta', 100, 'g', false, 1),
  ('microwave-napolitan', 'sausage', 2, '本', false, 2),
  ('microwave-napolitan', 'onion', 0.25, '個', false, 3),
  ('microwave-napolitan', 'green-pepper', 0.5, '個', true, 4),
  ('microwave-napolitan', 'ketchup', 2, '大さじ', false, 5),
  ('microwave-napolitan', 'water', 250, 'ml', false, 6),
  ('microwave-napolitan', 'oil', 1, '小さじ', false, 7),
  ('microwave-napolitan', 'salt', 1, '少々', false, 8),
  ('microwave-napolitan', 'pepper', 1, '少々', true, 9),
  ('infinite-green-pepper', 'green-pepper', 3, '個', false, 1),
  ('infinite-green-pepper', 'tuna', 0.5, '缶', false, 2),
  ('infinite-green-pepper', 'chicken-stock', 0.5, '小さじ', false, 3),
  ('infinite-green-pepper', 'sesame-oil', 1, '小さじ', false, 4),
  ('infinite-green-pepper', 'pepper', 1, '少々', true, 5)
on conflict (recipe_id, ingredient_id) do update set
  quantity = excluded.quantity,
  unit = excluded.unit,
  is_optional = excluded.is_optional,
  sort_order = excluded.sort_order;

insert into public.recipe_steps (recipe_id, step_number, instruction) values
  ('soboro-don', 1, '耐熱容器に鶏ひき肉、しょうゆ、砂糖、みりん、しょうがを入れて混ぜる。'),
  ('soboro-don', 2, 'ふんわりとラップをし、600Wで2分加熱する。'),
  ('soboro-don', 3, '一度取り出して、ひき肉をほぐすようによく混ぜる。'),
  ('soboro-don', 4, '再びラップをし、600Wで1分30秒加熱する。'),
  ('soboro-don', 5, '肉の赤い部分がなくなり、中心まで火が通っていることを確認し、ご飯の上に盛り付ける。'),
  ('microwave-napolitan', 1, '玉ねぎ、ピーマン、ウインナーを食べやすい大きさに切る。'),
  ('microwave-napolitan', 2, '深めの耐熱容器に半分に折ったスパゲッティ、水、塩、サラダ油を入れる。'),
  ('microwave-napolitan', 3, 'ラップをせず、袋に表示されたゆで時間より3分長く、600Wで加熱する。麺が硬い場合は追加加熱する。'),
  ('microwave-napolitan', 4, '加熱後に水分が多く残っていれば、少しだけ捨てる。'),
  ('microwave-napolitan', 5, '玉ねぎ、ピーマン、ウインナー、ケチャップを加えて混ぜる。'),
  ('microwave-napolitan', 6, 'ふんわりとラップをし、600Wで2分加熱して全体を混ぜる。'),
  ('microwave-napolitan', 7, '好みでこしょうを加える。'),
  ('infinite-green-pepper', 1, 'ピーマンの種とへたを取り、細切りにする。'),
  ('infinite-green-pepper', 2, '耐熱容器にピーマン、ツナ、鶏がらスープの素、ごま油を入れて混ぜる。'),
  ('infinite-green-pepper', 3, 'ふんわりとラップをし、600Wで2分加熱する。'),
  ('infinite-green-pepper', 4, '全体を混ぜ、好みでこしょうを加える。')
on conflict (recipe_id, step_number) do update set instruction = excluded.instruction;
