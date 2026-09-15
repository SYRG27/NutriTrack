import type { PlanDay, PlanItem } from "./types";

/* Mon-Thu: gym 7:00-8:30 PM - Fri: gym 8:00-9:00 AM - Sat: rest - Sun: optional.
   Edit a meal here and it changes everywhere in the app. */
const P = (_t: number, n: string, k: number, p: number, e: string): PlanItem => ({ n, k, p, e });

export const PLAN: Record<number, PlanDay> = {
  1:{label:"Monday", focus:"Chest + Back", gym:{from:"19:00",to:"20:30"}, slots:[
    {id:"b",  time:"07:30", name:"Breakfast", tone:"turmeric", items:[
      P(0,"Idli ×2",140,4,"🍚"), P(0,"Sambar, 1 cup",120,6,"🥣"), P(0,"Omelette — 1 whole + 2 whites",160,20,"🍳")]},
    {id:"l",  time:"13:00", name:"Lunch", tone:"leaf", items:[
      P(0,"Rice, 1 cup cooked",200,4,"🍚"), P(0,"Chicken curry, 150g",300,38,"🍗"), P(0,"Dal, 1 katori",140,8,"🫘"),
      P(0,"Beans poriyal",80,3,"🥬"), P(0,"Curd, 1 cup",100,6,"🥛")]},
    {id:"s",  time:"16:30", name:"Evening snack", tone:"plum", items:[
      P(0,"Banana",105,1,"🍌"), P(0,"Roasted chana, 30g",120,7,"🥜"), P(0,"Curd, 1 cup",100,6,"🥛"), P(0,"Trail mix pack",140,4,"🥜")]},
    {id:"pre",time:"18:00", name:"Pre-workout", tone:"indigo", items:[ P(0,"Banana",105,1,"🍌") ]},
    {id:"pg", time:"20:45", name:"Post-gym", tone:"leaf", items:[
      P(0,"Whey shake, 1 scoop",120,24,"🥤"), P(0,"or 4 boiled egg whites",68,14,"🥚")]},
    {id:"d",  time:"21:15", name:"Dinner", tone:"indigo", items:[
      P(0,"Grilled fish, 150g",250,33,"🐟"), P(0,"Sautéed vegetables",90,3,"🥦"),
      P(0,"Rice, ½ cup cooked",130,3,"🍚"), P(0,"Buttermilk",60,3,"🥛")]}
  ]},
  2:{label:"Tuesday", focus:"Biceps + Triceps", gym:{from:"19:00",to:"20:30"}, slots:[
    {id:"b",  time:"07:30", name:"Breakfast", tone:"turmeric", items:[
      P(0,"Pesarattu ×2",300,12,"🫓"), P(0,"Ginger chutney",60,1,"🌶️"), P(0,"Boiled eggs ×2",140,12,"🥚")]},
    {id:"l",  time:"13:00", name:"Lunch", tone:"leaf", items:[
      P(0,"Rice, 1 cup cooked",200,4,"🍚"), P(0,"Fish curry, 180g",300,38,"🐟"), P(0,"Rasam",60,2,"🍲"),
      P(0,"Cabbage fry",90,3,"🥬"), P(0,"Curd, 1 cup",100,6,"🥛")]},
    {id:"s",  time:"16:30", name:"Evening snack", tone:"plum", items:[
      P(0,"Apple",95,0,"🍎"), P(0,"Roasted chana, 30g",120,7,"🥜"), P(0,"Trail mix pack",140,4,"🥜")]},
    {id:"pre",time:"18:00", name:"Pre-workout", tone:"indigo", items:[ P(0,"Banana",105,1,"🍌") ]},
    {id:"pg", time:"20:45", name:"Post-gym", tone:"leaf", items:[
      P(0,"Whey shake, 1 scoop",120,24,"🥤"), P(0,"4 boiled egg whites",68,14,"🥚")]},
    {id:"d",  time:"21:15", name:"Dinner", tone:"indigo", items:[
      P(0,"Chicken tikka, 150g",280,40,"🍗"), P(0,"Kachumber salad",60,2,"🥗"),
      P(0,"Phulka ×2",140,5,"🫓"), P(0,"Buttermilk",60,3,"🥛")]}
  ]},
  3:{label:"Wednesday", focus:"Legs + Abs", gym:{from:"19:00",to:"20:30"}, slots:[
    {id:"b",  time:"07:30", name:"Breakfast", tone:"turmeric", items:[
      P(0,"Upma, 1½ cup",330,8,"🥣"), P(0,"Boiled eggs ×2",140,12,"🥚")]},
    {id:"l",  time:"13:00", name:"Lunch", tone:"leaf", items:[
      P(0,"Rice, 1 cup cooked",200,4,"🍚"), P(0,"Egg curry, 3 eggs",330,21,"🍛"), P(0,"Dal, 1 katori",140,8,"🫘"),
      P(0,"Beetroot poriyal",90,3,"🥬"), P(0,"Curd, 1 cup",100,6,"🥛")]},
    {id:"s",  time:"16:30", name:"Evening snack", tone:"plum", items:[
      P(0,"Banana",105,1,"🍌"), P(0,"Sprouts salad",120,8,"🥗"), P(0,"Trail mix pack",140,4,"🥜")]},
    {id:"pre",time:"18:00", name:"Pre-workout", tone:"indigo", items:[ P(0,"Banana",105,1,"🍌") ]},
    {id:"pg", time:"20:45", name:"Post-gym", tone:"leaf", items:[
      P(0,"Whey shake, 1 scoop",120,24,"🥤"), P(0,"4 boiled egg whites",68,14,"🥚")]},
    {id:"d",  time:"21:15", name:"Dinner", tone:"indigo", items:[
      P(0,"Shrimp stir fry, 180g",260,38,"🦐"), P(0,"Sautéed vegetables",90,3,"🥦"),
      P(0,"Phulka ×1",70,3,"🫓"), P(0,"Buttermilk",60,3,"🥛")]}
  ]},
  4:{label:"Thursday", focus:"Shoulders + Back", gym:{from:"19:00",to:"20:30"}, slots:[
    {id:"b",  time:"07:30", name:"Breakfast", tone:"turmeric", items:[
      P(0,"Curd rice, 1 bowl",300,8,"🍚"), P(0,"Boiled eggs ×2",140,12,"🥚")]},
    {id:"l",  time:"13:00", name:"Lunch", tone:"leaf", items:[
      P(0,"Rice, 1 cup cooked",200,4,"🍚"), P(0,"Chicken curry, 150g",300,38,"🍗"),
      P(0,"Gutti vankaya",150,3,"🍆"), P(0,"Rasam",60,2,"🍲"), P(0,"Curd, 1 cup",100,6,"🥛")]},
    {id:"s",  time:"16:30", name:"Evening snack", tone:"plum", items:[
      P(0,"Apple",95,0,"🍎"), P(0,"Almonds ×15",105,4,"🌰"), P(0,"Trail mix pack",140,4,"🥜")]},
    {id:"pre",time:"18:00", name:"Pre-workout", tone:"indigo", items:[ P(0,"Banana",105,1,"🍌") ]},
    {id:"pg", time:"20:45", name:"Post-gym", tone:"leaf", items:[
      P(0,"Whey shake, 1 scoop",120,24,"🥤"), P(0,"4 boiled egg whites",68,14,"🥚")]},
    {id:"d",  time:"21:15", name:"Dinner", tone:"indigo", items:[
      P(0,"Fish fry, 150g",270,33,"🐟"), P(0,"Kachumber salad",60,2,"🥗"),
      P(0,"Phulka ×2",140,5,"🫓"), P(0,"Buttermilk",60,3,"🥛")]}
  ]},
  5:{label:"Friday", focus:"Full body + cardio", gym:{from:"08:00",to:"09:00"}, slots:[
    {id:"pre",time:"07:15", name:"Pre-workout", tone:"indigo", items:[
      P(0,"Banana",105,1,"🍌"), P(0,"Black coffee",5,0,"☕")]},
    {id:"pg", time:"09:15", name:"Post-gym breakfast", tone:"turmeric", items:[
      P(0,"Omelette — 3 eggs",200,21,"🍳"), P(0,"Dosa ×1",150,3,"🫓"), P(0,"Whey shake, 1 scoop",120,24,"🥤")]},
    {id:"l",  time:"13:00", name:"Lunch", tone:"leaf", items:[
      P(0,"Rice, 1 cup cooked",200,4,"🍚"), P(0,"Fish curry, 180g",300,38,"🐟"), P(0,"Dal, 1 katori",140,8,"🫘"),
      P(0,"Beans poriyal",80,3,"🥬"), P(0,"Curd, 1 cup",100,6,"🥛")]},
    {id:"s",  time:"16:30", name:"Evening snack", tone:"plum", items:[
      P(0,"Banana",105,1,"🍌"), P(0,"Roasted chana, 30g",120,7,"🥜"), P(0,"Trail mix pack",140,4,"🥜")]},
    {id:"d",  time:"20:00", name:"Dinner", tone:"indigo", items:[
      P(0,"Chicken curry, 150g",300,38,"🍗"), P(0,"Phulka ×2",140,5,"🫓"),
      P(0,"Sautéed vegetables",90,3,"🥦"), P(0,"Buttermilk",60,3,"🥛")]}
  ]},
  6:{label:"Saturday", focus:"Rest day", gym:null, slots:[
    {id:"b",  time:"08:30", name:"Breakfast", tone:"turmeric", items:[
      P(0,"Rava dosa ×2",320,7,"🫓"), P(0,"Coconut chutney",90,2,"🥥"), P(0,"Boiled eggs ×2",140,12,"🥚")]},
    {id:"l",  time:"13:00", name:"Lunch", tone:"leaf", items:[
      P(0,"Rice, 1 cup cooked",200,4,"🍚"), P(0,"Goat curry, 120g",330,28,"🍛"), P(0,"Rasam",60,2,"🍲"),
      P(0,"Veg fry",90,3,"🥬"), P(0,"Curd, 1 cup",100,6,"🥛")]},
    {id:"s",  time:"16:30", name:"Evening snack", tone:"plum", items:[
      P(0,"Fruit bowl",120,2,"🍉"), P(0,"Peanuts, 30g",170,7,"🥜"), P(0,"Trail mix pack",140,4,"🥜")]},
    {id:"d",  time:"20:00", name:"Dinner", tone:"indigo", items:[
      P(0,"Fish fry, 150g",270,33,"🐟"), P(0,"Kachumber salad",60,2,"🥗"),
      P(0,"Phulka ×1",70,3,"🫓"), P(0,"Buttermilk",60,3,"🥛")]}
  ]},
  0:{label:"Sunday", focus:"Optional gym", gym:{from:"18:30",to:"20:00"}, slots:[
    {id:"b",  time:"08:30", name:"Breakfast", tone:"turmeric", items:[
      P(0,"Idiyappam ×3",280,6,"🍜"), P(0,"Egg curry, 2 eggs",220,14,"🍛")]},
    {id:"l",  time:"13:00", name:"Lunch", tone:"leaf", items:[
      P(0,"Rice, 1 cup cooked",200,4,"🍚"), P(0,"Chicken pepper fry, 150g",300,38,"🍗"),
      P(0,"Dal, 1 katori",140,8,"🫘"), P(0,"Avial",120,3,"🥥"), P(0,"Curd, 1 cup",100,6,"🥛")]},
    {id:"s",  time:"16:30", name:"Evening snack", tone:"plum", items:[
      P(0,"Banana",105,1,"🍌"), P(0,"Almonds ×15",105,4,"🌰"), P(0,"Trail mix pack",140,4,"🥜")]},
    {id:"pre",time:"17:45", name:"Pre-workout (if gym)", tone:"indigo", items:[ P(0,"Banana",105,1,"🍌") ]},
    {id:"pg", time:"20:15", name:"Post-gym (if gym)", tone:"leaf", items:[ P(0,"Whey shake, 1 scoop",120,24,"🥤") ]},
    {id:"d",  time:"20:30", name:"Dinner", tone:"indigo", items:[
      P(0,"Grilled shrimp, 150g",250,33,"🦐"), P(0,"Sautéed vegetables",90,3,"🥦"),
      P(0,"Phulka ×1",70,3,"🫓"), P(0,"Buttermilk",60,3,"🥛")]}
  ]}
};
export function planTotals(day: PlanDay) {
  const kcal = day.slots.reduce((a, s) => a + s.items.reduce((x, y) => x + y.k, 0), 0);
  const protein = day.slots.reduce((a, s) => a + s.items.reduce((x, y) => x + y.p, 0), 0);
  return { kcal, protein };
}
