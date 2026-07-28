import type { Recipe, RecipeIngredient } from "../types";

const ri = (ingredientId: string, quantity: number, unit: RecipeIngredient["unit"]): RecipeIngredient => ({
  ingredientId,
  quantity,
  unit,
});

const images = {
  bowl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",
  meat: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80",
  noodles: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",
  curry: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=900&q=80",
  pasta: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=900&q=80",
  veggie: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80",
};

const recipe = (
  id: string,
  name: string,
  description: string,
  cookingTime: number,
  estimatedCost: number,
  imageUrl: string,
  tags: string[],
  ingredients: RecipeIngredient[],
  instructions: string[],
  difficulty: Recipe["difficulty"] = "簡単",
): Recipe => ({ id, name, description, cookingTime, estimatedCost, difficulty, imageUrl, tags, ingredients, instructions });

const rice = ri("rice", 200, "g");
const soy = ri("soy-sauce", 15, "ml");
const oil = ri("oil", 10, "ml");

export const mockRecipes: Recipe[] = [
  recipe("oyakodon", "親子丼", "とろとろ卵と鶏肉。迷った日に頼れる王道どんぶり。", 15, 290, images.bowl, ["15分以内", "丼・ご飯", "洗い物が少ない"], [ri("chicken-thigh", 150, "g"), ri("onion", 1, "個"), ri("egg", 2, "個"), rice, soy, ri("mirin", 15, "ml"), ri("dashi", 3, "g")], ["玉ねぎを薄切り、鶏肉をひと口大に切る。", "フライパンに調味料と玉ねぎ、鶏肉を入れて火を通す。", "溶き卵を2回に分けて流し、ごはんにのせる。"]),
  recipe("butadon", "豚丼", "甘辛だれがごはんにしみる、満足感たっぷりの一杯。", 12, 280, images.meat, ["15分以内", "丼・ご飯", "肉料理"], [ri("pork-belly", 150, "g"), ri("onion", 1, "個"), rice, soy, ri("sugar", 8, "g"), ri("mirin", 15, "ml")], ["玉ねぎと豚肉を食べやすく切る。", "豚肉と玉ねぎを炒め、調味料を絡める。", "ごはんに盛り付ける。"]),
  recipe("mapo-tofu", "麻婆豆腐", "豆腐でかさ増し。ピリ辛でごはんが進む節約おかず。", 15, 260, images.bowl, ["15分以内", "肉料理", "洗い物が少ない"], [ri("tofu", 1, "パック"), ri("pork-mince", 100, "g"), ri("green-onion", 0.5, "本"), ri("miso", 15, "g"), soy, ri("starch", 5, "g")], ["豆腐とねぎを切る。", "ひき肉を炒め、みそとしょうゆで味付けする。", "豆腐を煮て水溶き片栗粉でとろみをつける。"]),
  recipe("yaki-udon", "焼きうどん", "冷蔵庫の野菜で作れる、もちもち時短メニュー。", 10, 220, images.noodles, ["10分以内", "麺", "洗い物が少ない"], [ri("udon", 1, "袋"), ri("pork-slice", 80, "g"), ri("cabbage", 100, "g"), ri("carrot", 0.5, "本"), soy, oil], ["具材を食べやすく切る。", "肉と野菜を炒める。", "うどんとしょうゆを加えて炒め合わせる。"]),
  recipe("fried-rice", "チャーハン", "卵とごはんでぱぱっと。香ばしい定番の時短飯。", 10, 180, images.bowl, ["10分以内", "丼・ご飯", "洗い物が少ない"], [rice, ri("egg", 2, "個"), ri("green-onion", 0.5, "本"), soy, ri("sesame-oil", 10, "ml")], ["ねぎを刻み、卵を溶く。", "卵、ごはんの順に強火で炒める。", "ねぎとしょうゆを加えて仕上げる。"]),
  recipe("omurice", "オムライス", "ケチャップライスをふんわり卵で包む喫茶店風。", 20, 280, images.bowl, ["300円以内", "丼・ご飯"], [rice, ri("egg", 2, "個"), ri("chicken-thigh", 80, "g"), ri("onion", 0.5, "個"), ri("ketchup", 30, "g"), oil], ["鶏肉と玉ねぎを炒める。", "ごはんとケチャップを加えて炒める。", "薄焼き卵で包む。"], "普通"),
  recipe("soboro-don", "そぼろ丼", "甘辛そぼろと炒り卵の二色丼。作り置きにも。", 15, 250, images.bowl, ["15分以内", "丼・ご飯", "肉料理"], [ri("chicken-mince", 150, "g"), ri("egg", 2, "個"), rice, soy, ri("sugar", 10, "g"), ri("ginger", 5, "g")], ["鶏ひき肉を調味料と炒りつける。", "卵に砂糖を加えて炒り卵にする。", "ごはんに彩りよく盛る。"]),
  recipe("ginger-pork", "豚の生姜焼き", "しょうが香る甘辛だれ。ごはん泥棒の定番おかず。", 15, 300, images.meat, ["15分以内", "300円以内", "肉料理"], [ri("pork-slice", 180, "g"), ri("onion", 0.5, "個"), ri("ginger", 8, "g"), soy, ri("mirin", 15, "ml"), oil], ["豚肉と玉ねぎを炒める。", "しょうがと調味料を混ぜる。", "たれを加え、照りが出るまで絡める。"]),
  recipe("vegetable-stir-fry", "野菜炒め", "野菜をたっぷり食べられる、しゃきしゃきおかず。", 10, 190, images.veggie, ["10分以内", "300円以内", "洗い物が少ない"], [ri("cabbage", 150, "g"), ri("bean-sprout", 1, "袋"), ri("carrot", 0.5, "本"), ri("pork-slice", 80, "g"), oil, ri("salt", 3, "g")], ["材料を切る。", "肉、固い野菜の順に炒める。", "もやしを加え、塩こしょうで整える。"]),
  recipe("curry", "ひとり分カレー", "フライパンで煮込み時間を短縮した、お手軽カレー。", 25, 320, images.curry, ["丼・ご飯", "肉料理"], [rice, ri("pork-slice", 100, "g"), ri("onion", 1, "個"), ri("potato", 1, "個"), ri("carrot", 0.5, "本"), ri("curry-roux", 40, "g")], ["具材を小さめに切る。", "肉と野菜を炒め、水を加えて煮る。", "火を止めてルーを溶かし、再度煮込む。"], "普通"),
  recipe("tomato-pasta", "トマトパスタ", "常備しやすいソースで作るシンプルパスタ。", 15, 240, images.pasta, ["15分以内", "300円以内", "麺"], [ri("pasta", 100, "g"), ri("tomato-sauce", 150, "g"), ri("onion", 0.5, "個"), ri("garlic", 5, "g"), oil], ["パスタを表示時間どおりゆでる。", "にんにくと玉ねぎを炒め、ソースを加える。", "パスタとソースを和える。"]),
  recipe("yakisoba", "ソース焼きそば", "香ばしいソース味。野菜もとれる屋台の定番。", 12, 230, images.noodles, ["15分以内", "麺", "肉料理"], [ri("yakisoba", 1, "袋"), ri("pork-slice", 80, "g"), ri("cabbage", 100, "g"), ri("bean-sprout", 1, "袋"), oil], ["肉と野菜を炒める。", "麺を加えてほぐす。", "付属ソースを加えて炒め合わせる。"]),
  recipe("pork-kimchi", "豚キムチ", "味付けはキムチにおまかせ。失敗しにくいスタミナ飯。", 10, 290, images.meat, ["10分以内", "300円以内", "肉料理", "洗い物が少ない"], [ri("pork-belly", 150, "g"), ri("kimchi", 120, "g"), ri("bean-sprout", 1, "袋"), ri("sesame-oil", 10, "ml")], ["豚肉をごま油で炒める。", "キムチともやしを加える。", "全体に火が通るまで炒める。"]),
  recipe("teriyaki-chicken", "鶏肉の照り焼き", "皮はぱりっと中はジューシー。フライパンひとつで完成。", 18, 310, images.meat, ["肉料理", "洗い物が少ない"], [ri("chicken-thigh", 200, "g"), soy, ri("mirin", 15, "ml"), ri("sugar", 8, "g"), oil], ["鶏肉の皮目から焼く。", "裏返してふたをし、中まで火を通す。", "調味料を加え、照りが出るまで煮絡める。"]),
  recipe("egg-don", "卵とじ丼", "玉ねぎの甘みを卵でとじた、やさしい節約どんぶり。", 10, 150, images.bowl, ["10分以内", "300円以内", "丼・ご飯", "洗い物が少ない"], [rice, ri("egg", 2, "個"), ri("onion", 1, "個"), soy, ri("mirin", 15, "ml"), ri("dashi", 3, "g")], ["玉ねぎを調味料で煮る。", "溶き卵を流して半熟で火を止める。", "ごはんにのせる。"]),
  recipe("tuna-mayo-don", "ツナマヨ丼", "火を使わず3分。時間がない日の最速ごはん。", 3, 170, images.bowl, ["10分以内", "300円以内", "丼・ご飯", "洗い物が少ない"], [rice, ri("tuna", 1, "個"), ri("mayonnaise", 20, "g"), soy], ["ツナの油を切る。", "ツナとマヨネーズを混ぜる。", "ごはんにのせ、しょうゆを少量かける。"]),
  recipe("tofu-steak", "豆腐ステーキ", "外は香ばしく中はふんわり。たんぱく質もとれる。", 15, 140, images.veggie, ["15分以内", "300円以内"], [ri("tofu", 1, "パック"), ri("starch", 10, "g"), soy, ri("mirin", 10, "ml"), oil], ["豆腐の水気を切り、片栗粉をまぶす。", "両面をこんがり焼く。", "しょうゆとみりんを絡める。"]),
  recipe("sprout-stir-fry", "もやし炒め", "一袋を使い切り。しゃきしゃき食感の最強節約おかず。", 8, 120, images.veggie, ["10分以内", "300円以内", "洗い物が少ない"], [ri("bean-sprout", 1, "袋"), ri("pork-slice", 60, "g"), ri("green-onion", 0.5, "本"), ri("sesame-oil", 10, "ml"), soy], ["豚肉を炒める。", "もやしとねぎを加えて強火で炒める。", "しょうゆで味を整える。"]),
  recipe("chicken-soboro", "鶏そぼろ", "ごはんにも麺にも合う、しょうが香る常備菜。", 12, 230, images.meat, ["15分以内", "300円以内", "肉料理", "洗い物が少ない"], [ri("chicken-mince", 200, "g"), ri("ginger", 5, "g"), soy, ri("sugar", 10, "g"), ri("sake", 15, "ml")], ["材料をすべてフライパンに入れる。", "菜箸でほぐしながら中火にかける。", "汁気がなくなるまで炒り煮にする。"]),
  recipe("cabbage-egg", "キャベツと卵の炒め物", "ふんわり卵と甘いキャベツ。朝にも夜にも。", 8, 160, images.veggie, ["10分以内", "300円以内", "洗い物が少ない"], [ri("cabbage", 180, "g"), ri("egg", 2, "個"), oil, ri("salt", 3, "g"), ri("pepper", 1, "g")], ["キャベツをざく切りにする。", "卵を半熟に炒めて一度取り出す。", "キャベツを炒め、卵を戻して味を整える。"]),
];
