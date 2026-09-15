import type { Food } from "./types";

/* kcal & protein are per ONE unit; rows flagged `g` are per 100 g. */
const F = (n: string, e: string, u: string, k: number, p: number, g?: number, a?: string): Food =>
  ({ n, e, u, k, p, g: !!g, a: a || "" });

export const FOODS: Food[] = [
 /* tiffin & breads */
 F("Idli","🍚","idli",70,2,0,"tiffin breakfast"),
 F("Dosa (plain)","🫓","dosa",150,3,0,"tiffin"),
 F("Masala dosa","🫓","dosa",290,6),
 F("Rava dosa","🫓","dosa",160,3.5),
 F("Pesarattu","🫓","pesarattu",150,6,0,"moong dosa"),
 F("Uttapam","🫓","uttapam",180,5),
 F("Appam","🫓","appam",120,2),
 F("Idiyappam","🍜","idiyappam",95,2,0,"string hopper"),
 F("Poori","🫓","poori",130,2.5,0,"puri"),
 F("Medhu vada","🍩","vada",140,3,0,"vada garelu"),
 F("Chapati","🫓","chapati",100,3.5,0,"roti"),
 F("Phulka","🫓","phulka",70,3,0,"roti chapati"),
 F("Paratha (plain)","🫓","paratha",210,5),
 F("Naan","🫓","naan",260,8),
 F("Bread slice","🍞","slice",70,2.5),
 /* rice dishes */
 F("White rice (cooked)","🍚","cup",200,4,0,"annam plain"),
 F("Brown rice (cooked)","🍚","cup",215,5),
 F("Curd rice","🍚","cup",250,7,0,"daddojanam"),
 F("Lemon rice","🍚","cup",280,5,0,"chitranna"),
 F("Pulihora","🍚","cup",300,5,0,"tamarind rice"),
 F("Sambar rice","🍲","cup",300,9),
 F("Bisi bele bath","🍲","cup",320,9),
 F("Upma","🥣","cup",220,5),
 F("Pongal","🥣","cup",280,8),
 F("Poha","🥣","cup",200,4,0,"atukulu"),
 F("Oats (cooked in water)","🥣","cup",160,6),
 F("Ragi malt","🥤","cup",180,5,0,"java ambali"),
 /* curries, dals, sides */
 F("Sambar","🥣","cup",120,6),
 F("Rasam","🍲","cup",60,2,0,"charu"),
 F("Dal (toor)","🫘","katori",140,8,0,"pappu"),
 F("Coconut chutney","🥥","2 tbsp",90,2),
 F("Tomato chutney","🍅","2 tbsp",50,1,0,"pachadi"),
 F("Ginger chutney","🌶️","2 tbsp",60,1,0,"allam"),
 F("Curd","🥛","cup",100,6,0,"yogurt perugu dahi"),
 F("Buttermilk","🥛","glass",60,3,0,"majjiga chaas"),
 F("Avial","🥥","cup",160,4),
 F("Gutti vankaya","🍆","serving",190,4,0,"stuffed brinjal"),
 F("Veg poriyal / fry","🥬","serving",90,3,0,"vepudu curry"),
 F("Cabbage fry","🥬","serving",85,3),
 F("Beans poriyal","🥬","serving",80,3),
 F("Beetroot poriyal","🥬","serving",90,3),
 F("Sautéed vegetables","🥦","serving",90,3),
 F("Mixed veg curry","🥘","cup",180,5),
 F("Palak paneer","🥬","cup",280,14),
 F("Paneer curry","🧀","cup",320,16),
 F("Paneer (raw)","🧀","g",265,18,1),
 F("Chana masala","🫘","cup",270,12,0,"chole"),
 F("Rajma","🫘","cup",240,12),
 F("Sprouts salad","🥗","cup",120,8,0,"moong"),
 F("Kachumber salad","🥗","serving",60,2,0,"onion tomato"),
 F("Papad","🫓","papad",40,2,0,"appadam"),
 F("Pickle","🥫","tsp",30,0,0,"avakaya"),
 /* meat, fish, egg */
 F("Chicken breast (cooked)","🍗","g",165,31,1,"grilled"),
 F("Chicken curry","🍗","g",200,25,1,"kodi kura"),
 F("Chicken tikka","🍗","g",187,27,1),
 F("Chicken 65","🍗","g",227,20,1),
 F("Chicken pepper fry","🍗","g",200,25,1,"vepudu"),
 F("Tandoori chicken","🍗","g",175,28,1),
 F("Fish curry","🐟","g",167,21,1,"chepala pulusu"),
 F("Fish fry","🐟","g",180,22,1,"chepa vepudu"),
 F("Grilled fish","🐟","g",167,22,1),
 F("Prawn curry","🦐","g",145,21,1,"shrimp royyalu"),
 F("Grilled shrimp","🦐","g",167,22,1,"prawn"),
 F("Shrimp stir fry","🦐","g",144,21,1,"prawn royyalu"),
 F("Goat curry","🍛","g",275,23,1,"mutton"),
 F("Mutton fry","🍛","g",290,25,1,"goat"),
 F("Boiled egg","🥚","egg",70,6,0,"anda kodi guddu"),
 F("Egg white (boiled)","🥚","white",17,3.5),
 F("Omelette","🍳","egg",95,7),
 F("Egg curry","🍛","egg",110,7,0,"kodi guddu"),
 F("Egg bhurji","🍳","egg",115,7,0,"scrambled"),
 /* full meals */
 F("Chicken biryani","🍛","plate",700,35),
 F("Mutton biryani","🍛","plate",800,38,0,"goat"),
 F("Veg biryani","🍛","plate",600,14),
 F("Egg biryani","🍛","plate",650,24),
 F("Veg fried rice","🍚","plate",500,10),
 F("Chicken fried rice","🍚","plate",600,25),
 F("Noodles","🍜","plate",450,12,0,"hakka chowmein"),
 F("Shawarma","🌯","roll",500,30),
 F("Burger","🍔","burger",550,25),
 F("Pizza","🍕","slice",285,12),
 F("Veg sandwich","🥪","sandwich",300,9),
 F("Meals plate (veg thali)","🍽️","plate",750,20,0,"thali"),
 /* drinks */
 F("Black coffee","☕","cup",5,0,0,"no sugar"),
 F("Filter coffee","☕","cup",110,3,0,"with milk sugar"),
 F("Tea with sugar","☕","cup",90,2,0,"chai"),
 F("Green tea","🍵","cup",2,0),
 F("Milk (full fat)","🥛","glass",150,8),
 F("Milk (toned)","🥛","glass",110,8),
 F("Whey shake","🥤","scoop",120,24,0,"protein powder"),
 F("Protein shake with milk","🥤","glass",270,32),
 F("Soft drink","🥤","can",140,0,0,"coke pepsi soda"),
 F("Sweet lime soda","🥤","glass",100,0),
 F("Salt lime soda","🥤","glass",20,0),
 F("Sweet lassi","🥛","glass",220,7),
 F("Coconut water","🥥","glass",45,1),
 F("Orange juice","🧃","glass",110,2),
 F("Beer","🍺","bottle",150,1),
 F("Whisky (30 ml peg)","🥃","peg",70,0,0,"rum vodka"),
 F("Wine","🍷","glass",125,0),
 /* fruit & nuts */
 F("Banana","🍌","banana",105,1,0,"arati"),
 F("Apple","🍎","apple",95,0.5),
 F("Orange","🍊","orange",62,1),
 F("Mango","🥭","mango",200,3),
 F("Papaya","🍈","cup",60,1),
 F("Watermelon","🍉","cup",46,1),
 F("Grapes","🍇","cup",100,1),
 F("Guava","🍐","guava",68,2.5,0,"jama"),
 F("Fruit bowl","🍉","bowl",120,2),
 F("Almonds","🌰","almond",7,0.26,0,"badam"),
 F("Peanuts (roasted)","🥜","g",567,26,1,"palli groundnut"),
 F("Roasted chana","🥜","g",400,23,1,"senagalu"),
 F("Cashews","🥜","g",553,18,1,"jeedipappu"),
 F("Walnuts","🌰","g",654,15,1,"akhrot"),
 F("Dates","🌴","date",20,0.2,0,"khajur"),
 /* snacks & sweets */
 F("Samosa","🥟","samosa",250,4),
 F("Mirchi bajji","🌶️","bajji",180,3,0,"punugulu pakoda"),
 F("Punugulu","🍩","piece",60,1),
 F("Murukku","🥨","piece",90,1.5,0,"chakli"),
 F("Marie biscuit","🍪","biscuit",25,0.4),
 F("Cream biscuit","🍪","biscuit",55,0.7),
 F("Gulab jamun","🍮","piece",150,2),
 F("Laddu","🍡","laddu",190,3),
 F("Ice cream","🍨","scoop",210,4),
 F("Chocolate bar","🍫","bar",230,3),
 F("Chips packet (small)","🥔","packet",170,2),
 F("Cake","🍰","slice",350,4),
 F("Payasam","🍮","cup",250,5,0,"kheer"),
 F("Halwa","🍮","serving",280,3),
 /* fats & extras */
 F("Ghee","🧈","tsp",45,0,0,"neyyi"),
 F("Cooking oil","🫒","tsp",40,0),
 F("Butter","🧈","tsp",34,0),
 F("Sugar","🍬","tsp",16,0),
 F("Honey","🍯","tsp",21,0)
];
export const FAVES: string[] = ["Banana","Boiled egg","Black coffee","Tea with sugar","Curd","White rice (cooked)","Phulka","Whey shake","Buttermilk","Chicken curry"];

export const foodByName = (n: string) => FOODS.find((f) => f.n === n);
export const perUnit = (f: Food) => (f.g ? `${f.k} kcal / 100 g` : `${f.k} kcal per ${f.u}`);
export const defaultQty = (f: Food) => (f.g ? 150 : 1);
export const stepOf = (f: Food) => (f.g ? 25 : 1);
export const macrosFor = (f: Food, q: number) =>
  f.g ? { k: (f.k * q) / 100, p: (f.p * q) / 100 } : { k: f.k * q, p: f.p * q };

export function plural(u: string, q: number) {
  if (u === "g" || q <= 1) return u;
  if (/(s|sh|ch|x)$/.test(u)) return u + "es";
  return u + "s";
}

export function findFoods(q: string): Food[] {
  const t = q.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (!t.length) return [];
  const out: { f: Food; r: number }[] = [];
  FOODS.forEach((f) => {
    const hay = (f.n + " " + f.a).toLowerCase();
    if (t.every((x) => hay.includes(x)))
      out.push({ f, r: (f.n.toLowerCase().startsWith(t[0]) ? 0 : 100) + f.n.length });
  });
  return out.sort((a, b) => a.r - b.r).slice(0, 8).map((x) => x.f);
}
