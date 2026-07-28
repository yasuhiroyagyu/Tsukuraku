import type { Recipe, RecipeIngredient } from "../types";

const ri = (
  ingredientId: string,
  quantity: number,
  unit: RecipeIngredient["unit"],
  isOptional = false,
): RecipeIngredient => ({
  ingredientId,
  quantity,
  unit,
  ...(isOptional ? { isOptional: true } : {}),
});

const images = {
  oyakodon: "/images/recipes/oyakodon.png",
  butadon: "/images/recipes/butadon.png",
  mapoTofu: "/images/recipes/mapo-tofu.png",
  yakiUdon: "/images/recipes/yaki-udon.png",
  friedRice: "/images/recipes/fried-rice.png",
  omurice: "/images/recipes/omurice.png",
  soboroDon: "/images/recipes/soboro-don.png",
  napolitan: "/images/recipes/napolitan.png",
  infiniteGreenPepper: "/images/recipes/infinite-green-pepper.png",
  gingerPork: "/images/recipes/ginger-pork.png",
  vegetableStirFry: "/images/recipes/vegetable-stir-fry.png",
  curry: "/images/recipes/curry.png",
  tomatoPasta: "/images/recipes/tomato-pasta.png",
  yakisoba: "/images/recipes/yakisoba.png",
  porkKimchi: "/images/recipes/pork-kimchi.png",
  teriyakiChicken: "/images/recipes/teriyaki-chicken.png",
  eggDon: "/images/recipes/egg-don.png",
  tunaMayoDon: "/images/recipes/tuna-mayo-don.png",
  tofuSteak: "/images/recipes/tofu-steak.png",
  sproutStirFry: "/images/recipes/sprout-stir-fry.png",
  chickenSoboro: "/images/recipes/chicken-soboro.png",
  cabbageEgg: "/images/recipes/cabbage-egg.png",
};

const recipe = (
  id: string,
  name: string,
  description: string,
  cookingTime: number,
  estimatedCost: number | null,
  imageUrl: string,
  tags: string[],
  ingredients: RecipeIngredient[],
  instructions: string[],
  difficulty: Recipe["difficulty"] = "簡単",
  metadata: Partial<Pick<Recipe, "servings" | "category" | "wattage">> = {},
): Recipe => ({
  id,
  name,
  description,
  cookingTime,
  estimatedCost,
  difficulty,
  servings: metadata.servings ?? 1,
  category: metadata.category ?? "その他",
  wattage: metadata.wattage ?? null,
  imageUrl,
  tags,
  ingredients,
  instructions,
});

const rice = ri("rice", 200, "g");
const soy = ri("soy-sauce", 15, "ml");
const oil = ri("oil", 10, "ml");

export const mockRecipes: Recipe[] = [
  recipe("oyakodon", "親子丼", "とろとろ卵と鶏肉。迷った日に頼れる王道どんぶり。", 15, 290, images.oyakodon, ["15分以内", "丼・ご飯", "洗い物が少ない"], [ri("chicken-thigh", 150, "g"), ri("onion", 1, "個"), ri("egg", 2, "個"), rice, soy, ri("mirin", 15, "ml"), ri("dashi", 3, "g")], ["玉ねぎを薄切り、鶏肉をひと口大に切る。", "フライパンに調味料と玉ねぎ、鶏肉を入れて火を通す。", "溶き卵を2回に分けて流し、ごはんにのせる。"]),
  recipe("butadon", "豚丼", "甘辛だれがごはんにしみる、満足感たっぷりの一杯。", 12, 280, images.butadon, ["15分以内", "丼・ご飯", "肉料理"], [ri("pork-belly", 150, "g"), ri("onion", 1, "個"), rice, soy, ri("sugar", 8, "g"), ri("mirin", 15, "ml")], ["玉ねぎと豚肉を食べやすく切る。", "豚肉と玉ねぎを炒め、調味料を絡める。", "ごはんに盛り付ける。"]),
  recipe("mapo-tofu", "麻婆豆腐", "豆腐でかさ増し。ピリ辛でごはんが進む節約おかず。", 15, 260, images.mapoTofu, ["15分以内", "肉料理", "洗い物が少ない"], [ri("tofu", 1, "パック"), ri("pork-mince", 100, "g"), ri("green-onion", 0.5, "本"), ri("miso", 15, "g"), soy, ri("starch", 5, "g")], ["豆腐とねぎを切る。", "ひき肉を炒め、みそとしょうゆで味付けする。", "豆腐を煮て水溶き片栗粉でとろみをつける。"]),
  recipe("yaki-udon", "焼きうどん", "冷蔵庫の野菜で作れる、もちもち時短メニュー。", 10, 220, images.yakiUdon, ["10分以内", "麺", "洗い物が少ない"], [ri("udon", 1, "袋"), ri("pork-slice", 80, "g"), ri("cabbage", 100, "g"), ri("carrot", 0.5, "本"), soy, oil], ["具材を食べやすく切る。", "肉と野菜を炒める。", "うどんとしょうゆを加えて炒め合わせる。"]),
  recipe("fried-rice", "チャーハン", "卵とごはんでぱぱっと。香ばしい定番の時短飯。", 10, 180, images.friedRice, ["10分以内", "丼・ご飯", "洗い物が少ない"], [rice, ri("egg", 2, "個"), ri("green-onion", 0.5, "本"), soy, ri("sesame-oil", 10, "ml")], ["ねぎを刻み、卵を溶く。", "卵、ごはんの順に強火で炒める。", "ねぎとしょうゆを加えて仕上げる。"]),
  recipe("omurice", "オムライス", "ケチャップライスをふんわり卵で包む喫茶店風。", 20, 280, images.omurice, ["300円以内", "丼・ご飯"], [rice, ri("egg", 2, "個"), ri("chicken-thigh", 80, "g"), ri("onion", 0.5, "個"), ri("ketchup", 30, "g"), oil], ["鶏肉と玉ねぎを炒める。", "ごはんとケチャップを加えて炒める。", "薄焼き卵で包む。"], "普通"),
  recipe("soboro-don", "そぼろ丼", "甘辛い鶏そぼろを電子レンジだけで作る、1人分の手軽などんぶり。", 12, null, images.soboroDon, ["15分以内", "電子レンジ", "丼・ご飯", "肉料理", "洗い物が少ない"], [ri("rice", 200, "g"), ri("chicken-mince", 100, "g"), ri("soy-sauce", 1, "大さじ"), ri("sugar", 1, "小さじ"), ri("mirin", 1, "小さじ"), ri("ginger", 0.5, "小さじ", true)], ["耐熱容器に鶏ひき肉、しょうゆ、砂糖、みりん、しょうがを入れて混ぜる。", "ふんわりとラップをし、600Wで2分加熱する。", "一度取り出して、ひき肉をほぐすようによく混ぜる。", "再びラップをし、600Wで1分30秒加熱する。", "肉の赤い部分がなくなり、中心まで火が通っていることを確認し、ご飯の上に盛り付ける。"], "普通", { servings: 1, category: "ご飯もの", wattage: 600 }),
  recipe("microwave-napolitan", "ナポリタン", "麺も具材もひとつの耐熱容器で仕上げる、電子レンジの定番パスタ。", 15, null, images.napolitan, ["15分以内", "電子レンジ", "麺", "洗い物が少ない"], [ri("pasta", 100, "g"), ri("sausage", 2, "本"), ri("onion", 0.25, "個"), ri("green-pepper", 0.5, "個", true), ri("ketchup", 2, "大さじ"), ri("water", 250, "ml"), ri("oil", 1, "小さじ"), ri("salt", 1, "少々"), ri("pepper", 1, "少々", true)], ["玉ねぎ、ピーマン、ウインナーを食べやすい大きさに切る。", "深めの耐熱容器に半分に折ったスパゲッティ、水、塩、サラダ油を入れる。", "ラップをせず、袋に表示されたゆで時間より3分長く、600Wで加熱する。麺が硬い場合は追加加熱する。", "加熱後に水分が多く残っていれば、少しだけ捨てる。", "玉ねぎ、ピーマン、ウインナー、ケチャップを加えて混ぜる。", "ふんわりとラップをし、600Wで2分加熱して全体を混ぜる。", "好みでこしょうを加える。"], "普通", { servings: 1, category: "麺類", wattage: 600 }),
  recipe("infinite-green-pepper", "無限ピーマン", "ツナのうま味でピーマンがたっぷり食べられる、電子レンジ副菜。", 7, null, images.infiniteGreenPepper, ["10分以内", "電子レンジ", "副菜", "洗い物が少ない"], [ri("green-pepper", 3, "個"), ri("tuna", 0.5, "缶"), ri("chicken-stock", 0.5, "小さじ"), ri("sesame-oil", 1, "小さじ"), ri("pepper", 1, "少々", true)], ["ピーマンの種とへたを取り、細切りにする。", "耐熱容器にピーマン、ツナ、鶏がらスープの素、ごま油を入れて混ぜる。", "ふんわりとラップをし、600Wで2分加熱する。", "全体を混ぜ、好みでこしょうを加える。"], "簡単", { servings: 1, category: "副菜", wattage: 600 }),
  recipe("ginger-pork", "豚の生姜焼き", "しょうが香る甘辛だれ。ごはん泥棒の定番おかず。", 15, 300, images.gingerPork, ["15分以内", "300円以内", "肉料理"], [ri("pork-slice", 180, "g"), ri("onion", 0.5, "個"), ri("ginger", 8, "g"), soy, ri("mirin", 15, "ml"), oil], ["豚肉と玉ねぎを炒める。", "しょうがと調味料を混ぜる。", "たれを加え、照りが出るまで絡める。"]),
  recipe("vegetable-stir-fry", "野菜炒め", "野菜をたっぷり食べられる、しゃきしゃきおかず。", 10, 190, images.vegetableStirFry, ["10分以内", "300円以内", "洗い物が少ない"], [ri("cabbage", 150, "g"), ri("bean-sprout", 1, "袋"), ri("carrot", 0.5, "本"), ri("pork-slice", 80, "g"), oil, ri("salt", 3, "g")], ["材料を切る。", "肉、固い野菜の順に炒める。", "もやしを加え、塩こしょうで整える。"]),
  recipe("curry", "ひとり分カレー", "フライパンで煮込み時間を短縮した、お手軽カレー。", 25, 320, images.curry, ["丼・ご飯", "肉料理"], [rice, ri("pork-slice", 100, "g"), ri("onion", 1, "個"), ri("potato", 1, "個"), ri("carrot", 0.5, "本"), ri("curry-roux", 40, "g")], ["具材を小さめに切る。", "肉と野菜を炒め、水を加えて煮る。", "火を止めてルーを溶かし、再度煮込む。"], "普通"),
  recipe("tomato-pasta", "トマトパスタ", "常備しやすいソースで作るシンプルパスタ。", 15, 240, images.tomatoPasta, ["15分以内", "300円以内", "麺"], [ri("pasta", 100, "g"), ri("tomato-sauce", 150, "g"), ri("onion", 0.5, "個"), ri("garlic", 5, "g"), oil], ["パスタを表示時間どおりゆでる。", "にんにくと玉ねぎを炒め、ソースを加える。", "パスタとソースを和える。"]),
  recipe("yakisoba", "ソース焼きそば", "香ばしいソース味。野菜もとれる屋台の定番。", 12, 230, images.yakisoba, ["15分以内", "麺", "肉料理"], [ri("yakisoba", 1, "袋"), ri("pork-slice", 80, "g"), ri("cabbage", 100, "g"), ri("bean-sprout", 1, "袋"), oil], ["肉と野菜を炒める。", "麺を加えてほぐす。", "付属ソースを加えて炒め合わせる。"]),
  recipe("pork-kimchi", "豚キムチ", "味付けはキムチにおまかせ。失敗しにくいスタミナ飯。", 10, 290, images.porkKimchi, ["10分以内", "300円以内", "肉料理", "洗い物が少ない"], [ri("pork-belly", 150, "g"), ri("kimchi", 120, "g"), ri("bean-sprout", 1, "袋"), ri("sesame-oil", 10, "ml")], ["豚肉をごま油で炒める。", "キムチともやしを加える。", "全体に火が通るまで炒める。"]),
  recipe("teriyaki-chicken", "鶏肉の照り焼き", "皮はぱりっと中はジューシー。フライパンひとつで完成。", 18, 310, images.teriyakiChicken, ["肉料理", "洗い物が少ない"], [ri("chicken-thigh", 200, "g"), soy, ri("mirin", 15, "ml"), ri("sugar", 8, "g"), oil], ["鶏肉の皮目から焼く。", "裏返してふたをし、中まで火を通す。", "調味料を加え、照りが出るまで煮絡める。"]),
  recipe("egg-don", "卵とじ丼", "玉ねぎの甘みを卵でとじた、やさしい節約どんぶり。", 10, 150, images.eggDon, ["10分以内", "300円以内", "丼・ご飯", "洗い物が少ない"], [rice, ri("egg", 2, "個"), ri("onion", 1, "個"), soy, ri("mirin", 15, "ml"), ri("dashi", 3, "g")], ["玉ねぎを調味料で煮る。", "溶き卵を流して半熟で火を止める。", "ごはんにのせる。"]),
  recipe("tuna-mayo-don", "ツナマヨ丼", "火を使わず3分。時間がない日の最速ごはん。", 3, 170, images.tunaMayoDon, ["10分以内", "300円以内", "丼・ご飯", "洗い物が少ない"], [rice, ri("tuna", 1, "個"), ri("mayonnaise", 20, "g"), soy], ["ツナの油を切る。", "ツナとマヨネーズを混ぜる。", "ごはんにのせ、しょうゆを少量かける。"]),
  recipe("tofu-steak", "豆腐ステーキ", "外は香ばしく中はふんわり。たんぱく質もとれる。", 15, 140, images.tofuSteak, ["15分以内", "300円以内"], [ri("tofu", 1, "パック"), ri("starch", 10, "g"), soy, ri("mirin", 10, "ml"), oil], ["豆腐の水気を切り、片栗粉をまぶす。", "両面をこんがり焼く。", "しょうゆとみりんを絡める。"]),
  recipe("sprout-stir-fry", "もやし炒め", "一袋を使い切り。しゃきしゃき食感の最強節約おかず。", 8, 120, images.sproutStirFry, ["10分以内", "300円以内", "洗い物が少ない"], [ri("bean-sprout", 1, "袋"), ri("pork-slice", 60, "g"), ri("green-onion", 0.5, "本"), ri("sesame-oil", 10, "ml"), soy], ["豚肉を炒める。", "もやしとねぎを加えて強火で炒める。", "しょうゆで味を整える。"]),
  recipe("chicken-soboro", "鶏そぼろ", "ごはんにも麺にも合う、しょうが香る常備菜。", 12, 230, images.chickenSoboro, ["15分以内", "300円以内", "肉料理", "洗い物が少ない"], [ri("chicken-mince", 200, "g"), ri("ginger", 5, "g"), soy, ri("sugar", 10, "g"), ri("sake", 15, "ml")], ["材料をすべてフライパンに入れる。", "菜箸でほぐしながら中火にかける。", "汁気がなくなるまで炒り煮にする。"]),
  recipe("cabbage-egg", "キャベツと卵の炒め物", "ふんわり卵と甘いキャベツ。朝にも夜にも。", 8, 160, images.cabbageEgg, ["10分以内", "300円以内", "洗い物が少ない"], [ri("cabbage", 180, "g"), ri("egg", 2, "個"), oil, ri("salt", 3, "g"), ri("pepper", 1, "g")], ["キャベツをざく切りにする。", "卵を半熟に炒めて一度取り出す。", "キャベツを炒め、卵を戻して味を整える。"]),
];
