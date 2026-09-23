#!/usr/bin/env node

/**
 * Script to improve dictionary definitions to be learner-friendly.
 * Rewrites WordNet-style definitions with clear, primary-sense-first definitions.
 */

const fs = require("node:fs");
const path = require("node:path");

// Curated learner-friendly definitions for common words
// Format: word -> array of definitions (primary sense first)
const IMPROVED_DEFINITIONS = {
  April: ["n. the fourth month of the year"],
  // Months - capitalized
  August: ["n. the eighth month of the year"],

  // More common words with problematic definitions
  address: [
    "n. the details of where someone lives or works",
    "v. to speak to someone",
    "v. to deal with a problem",
  ],
  agree: ["v. to have the same opinion", "v. to say yes or give permission"],
  alcohol: [
    "n. drinks that can make you drunk, such as beer, wine, or spirits",
    "n. a type of chemical compound",
  ],
  arrive: ["v. to reach a destination or place", "v. to come to a place"],
  bank: [
    "n. a financial institution where people keep money",
    "n. the land along the side of a river or lake",
  ],
  boat: ["n. a small vessel for traveling on water", "v. to travel by boat"],
  book: [
    "n. a written work with pages bound together",
    "v. to reserve or arrange something in advance",
  ],
  breakfast: [
    "n. the first meal of the day, eaten in the morning",
    "v. to eat breakfast",
  ],
  camera: ["n. a device for taking photographs or recording video"],
  can: ["v. to be able to", "n. a metal container for food or drinks"],

  // Common everyday verbs
  cancel: [
    "v. to decide not to do or continue with something",
    "v. to call off an event or arrangement",
  ],
  capital: [
    "n. the main city of a country or region where the government is located",
    "n. money or wealth used to start a business",
    "adj. relating to the death penalty",
    "adj. uppercase (of letters)",
  ],
  catch: [
    "v. to grab or capture something moving",
    "v. to intercept and hold",
    "v. to get on a bus or train",
  ],
  change: [
    "v. to become different",
    "v. to replace with something else",
    "n. coins or money returned",
  ],
  check: [
    "v. to examine or verify something",
    "n. a written order to pay money from a bank account",
    "n. a pattern of squares",
  ],
  close: ["v. to shut", "adj. near", "adj. intimate or friendly"],
  company: [
    "n. a business organization",
    "n. companionship or being with others",
  ],
  count: [
    "v. to say numbers in order",
    "v. to calculate the total",
    "v. to be important or matter",
  ],
  course: [
    "n. a series of lessons",
    "n. a route or direction",
    "n. one part of a meal",
  ],
  cross: [
    "v. to go from one side to the other",
    "n. a mark shaped like +",
    "adj. angry or annoyed",
  ],
  December: ["n. the twelfth month of the year"],
  date: [
    "n. a particular day of the month or year",
    "n. a social appointment",
    "v. to go out with someone romantically",
  ],
  deal: [
    "v. to handle or take action about something",
    "n. an agreement or arrangement",
    "v. to distribute cards",
  ],

  // Common nouns
  duck: [
    "n. a waterbird with a broad flat bill and webbed feet",
    "v. to lower your head or body quickly to avoid something",
  ],
  enjoy: ["v. to get pleasure from something", "v. to like or take delight in"],
  even: [
    "adj. flat or level",
    "adj. equal or the same",
    "adv. used to emphasize something surprising",
  ],
  express: [
    "v. to communicate thoughts or feelings",
    "adj. very fast",
    "n. a fast train or service",
  ],
  February: ["n. the second month of the year"],
  fair: [
    "adj. treating people equally",
    "adj. light in color",
    "n. a public event with rides and stalls",
  ],
  fall: ["v. to drop down toward the ground", "n. autumn", "n. a decrease"],
  fan: [
    "n. a device that moves air",
    "n. an enthusiastic supporter",
    "v. to wave something to create air",
  ],
  figure: [
    "n. a number or statistic",
    "n. the shape of a person's body",
    "v. to think or conclude",
  ],
  fine: [
    "adj. very good or excellent",
    "adj. thin or delicate",
    "n. money paid as a penalty",
  ],
  firm: [
    "adj. solid and hard",
    "n. a business company",
    "adj. strong and determined",
  ],
  fix: ["v. to repair", "v. to attach securely", "v. to decide or arrange"],
  flat: ["adj. level and smooth", "n. an apartment", "adj. deflated"],
  fly: ["v. to move through the air", "n. a small flying insect"],
  foot: [
    "n. the part of the leg below the ankle",
    "n. a unit of length equal to 12 inches",
  ],
  form: [
    "n. a type or kind",
    "v. to create or make",
    "n. a document with blank spaces to fill in",
  ],
  free: [
    "adj. costing nothing",
    "adj. not controlled or restricted",
    "v. to release or liberate",
  ],
  game: [
    "n. an activity or sport with rules",
    "n. wild animals hunted for food",
  ],
  general: [
    "adj. relating to most people or things",
    "n. a high-ranking military officer",
    "adj. not specific or detailed",
  ],
  good: [
    "adj. having positive qualities",
    "adj. kind or morally right",
    "n. benefit or advantage",
  ],
  ground: [
    "n. the surface of the earth",
    "v. to prevent from flying",
    "n. an area used for a purpose",
  ],
  hand: [
    "n. the part of the body at the end of the arm",
    "v. to give or pass something",
  ],
  head: [
    "n. the top part of the body containing the brain",
    "v. to move in a direction",
    "n. a leader or person in charge",
  ],
  hold: [
    "v. to have or keep in your hand",
    "v. to contain",
    "v. to organize an event",
  ],
  interest: [
    "n. a feeling of wanting to know about something",
    "n. money paid for borrowing money",
    "v. to attract attention",
  ],
  iron: [
    "n. a strong metal",
    "n. a device for pressing clothes",
    "v. to press clothes with an iron",
  ],
  January: ["n. the first month of the year"],
  July: ["n. the seventh month of the year"],
  June: ["n. the sixth month of the year"],
  kind: ["adj. friendly and generous", "n. a type or sort"],
  last: [
    "adj. coming at the end",
    "v. to continue for a time",
    "adj. most recent",
  ],
  lead: [
    "v. to guide or direct",
    "n. the first position",
    "n. a soft heavy metal",
  ],
  left: [
    "adj. on the side opposite to right",
    "v. past tense of leave",
    "n. the left side",
  ],
  letter: [
    "n. a written message",
    "n. a symbol representing a sound in writing",
  ],
  lie: [
    "v. to be in a horizontal position",
    "v. to say something untrue",
    "n. an untrue statement",
  ],
  light: [
    "n. brightness that lets you see",
    "adj. not heavy",
    "v. to make something start burning",
  ],
  like: ["v. to enjoy or be fond of", "prep. similar to", "conj. as if"],
  line: [
    "n. a long thin mark",
    "n. a row of people or things",
    "v. to cover the inside of something",
  ],
  long: [
    "adj. measuring a great distance",
    "v. to want something very much",
    "adv. for a long time",
  ],
  March: [
    "n. the third month of the year",
    "v. to walk with regular steps in a group",
  ],
  May: ["n. the fifth month of the year", "v. to be allowed or permitted to"],
  match: [
    "n. a sports competition",
    "n. a small stick for making fire",
    "v. to be similar or go together",
  ],
  mean: ["v. to intend or signify", "adj. unkind or cruel", "adj. average"],
  mind: [
    "n. the part of you that thinks and feels",
    "v. to care or be bothered by",
    "v. to look after",
  ],
  miss: [
    "v. to fail to hit or catch",
    "v. to feel sad about someone's absence",
    "n. a title for an unmarried woman",
  ],
  move: [
    "v. to change position",
    "v. to change where you live",
    "n. an action in a game",
  ],
  November: ["n. the eleventh month of the year"],
  notice: [
    "v. to become aware of",
    "n. a written announcement",
    "n. advance warning",
  ],
  novel: ["n. a long fictional book", "adj. new and unusual"],
  October: ["n. the tenth month of the year"],
  order: [
    "n. an arrangement or sequence",
    "v. to request goods or services",
    "n. a command",
  ],
  park: [
    "n. a public area with grass and trees",
    "v. to stop and leave a vehicle",
  ],
  part: [
    "n. a piece or portion of something",
    "v. to separate",
    "v. to leave someone",
  ],
  party: [
    "n. a social gathering",
    "n. a political organization",
    "n. a person or group involved in something",
  ],
  pass: [
    "v. to go by or move past",
    "v. to succeed in a test",
    "n. a document allowing entry",
  ],
  patient: [
    "adj. able to wait calmly",
    "n. a person receiving medical treatment",
  ],
  place: ["n. a location or position", "v. to put something somewhere"],
  plant: [
    "n. a living organism like a tree or flower",
    "v. to put seeds in the ground",
    "n. a factory",
  ],
  play: [
    "v. to take part in a game or sport",
    "n. a theatrical performance",
    "v. to perform music",
  ],
  point: [
    "n. a sharp end",
    "n. a particular place or time",
    "v. to direct attention to something",
  ],
  pound: [
    "n. a unit of weight equal to 16 ounces",
    "n. British currency",
    "v. to hit repeatedly",
  ],
  present: ["n. a gift", "adj. existing now", "v. to give or show formally"],
  press: [
    "v. to push firmly",
    "n. newspapers and journalists",
    "v. to iron clothes",
  ],
  produce: ["v. to make or create", "n. fresh fruits and vegetables"],
  program: [
    "n. a planned series of activities",
    "n. a television or radio show",
    "v. to write computer code",
  ],
  project: [
    "n. a planned piece of work",
    "v. to estimate or predict",
    "v. to stick out",
  ],
  quarter: [
    "n. one fourth or 25 percent",
    "n. a coin worth 25 cents",
    "n. a period of three months",
  ],
  raise: [
    "v. to lift up",
    "v. to increase",
    "v. to take care of children or animals",
  ],
  range: [
    "n. a variety or series",
    "n. the distance something can reach",
    "n. an area for shooting practice",
  ],
  rank: [
    "n. a position in a hierarchy",
    "v. to put in order",
    "adj. having a strong unpleasant smell",
  ],
  rare: ["adj. not common or frequent", "adj. cooked lightly (of meat)"],
  rate: ["n. a measure of speed or frequency", "v. to evaluate or judge"],
  record: [
    "n. information stored for future reference",
    "v. to write down or capture information",
    "n. the best performance ever achieved",
  ],
  refuse: ["v. to say no or decline", "n. waste or garbage"],
  rest: [
    "v. to relax or stop activity",
    "n. the remaining part",
    "n. a period of relaxation",
  ],
  rich: ["adj. having a lot of money", "adj. containing a lot of something"],
  right: [
    "adj. correct",
    "n. the side opposite to left",
    "n. something you are morally or legally entitled to",
  ],
  ring: [
    "n. a circular band worn on the finger",
    "v. to make a bell sound",
    "n. a circular shape",
  ],
  rock: [
    "n. a hard natural material",
    "v. to move gently back and forth",
    "n. a type of music",
  ],
  roll: [
    "v. to move by turning over",
    "n. a small loaf of bread",
    "n. a list of names",
  ],
  row: [
    "n. a line of people or things",
    "v. to propel a boat with oars",
    "n. a noisy argument",
  ],
  rule: [
    "n. an official instruction",
    "v. to govern",
    "v. to make an official decision",
  ],
  run: [
    "v. to move quickly on foot",
    "v. to operate or manage",
    "n. a period of activity",
  ],
  September: ["n. the ninth month of the year"],
  saw: [
    "v. past tense of see",
    "n. a tool for cutting wood",
    "v. to cut with a saw",
  ],
  scale: [
    "n. a device for weighing",
    "n. the size or extent of something",
    "n. a graduated series of musical notes",
  ],
  season: ["n. one of the four parts of the year", "v. to add flavor to food"],
  second: [
    "adj. coming after the first",
    "n. a unit of time equal to 1/60 of a minute",
  ],
  shed: ["n. a small building for storage", "v. to lose or drop something"],
  ship: ["n. a large boat", "v. to send goods by sea, air, or land"],
  shop: ["n. a place where goods are sold", "v. to buy things from stores"],
  show: [
    "v. to let someone see",
    "n. a performance or program",
    "v. to prove or demonstrate",
  ],
  sign: [
    "n. a symbol or notice giving information",
    "v. to write your name",
    "n. an indication",
  ],
  sink: [
    "v. to go down below water",
    "n. a basin for washing in a kitchen or bathroom",
  ],
  skip: [
    "v. to move with jumping steps",
    "v. to not do something you should do",
  ],
  slip: [
    "v. to slide accidentally",
    "n. a small piece of paper",
    "n. a woman's undergarment",
  ],
  sound: [
    "n. something you hear",
    "v. to make a noise",
    "adj. in good condition",
  ],
  spare: [
    "adj. extra or additional",
    "v. to make available",
    "v. to prevent harm to",
  ],
  spring: [
    "n. the season after winter",
    "v. to jump or move suddenly",
    "n. a coil of metal",
    "n. a source of water",
  ],
  square: [
    "n. a shape with four equal sides",
    "n. an open area in a town",
    "adj. having four right angles",
  ],
  stamp: [
    "n. a small adhesive label for mail",
    "v. to bring your foot down heavily",
  ],
  stand: [
    "v. to be upright on your feet",
    "v. to tolerate",
    "n. a stall selling things",
  ],
  star: [
    "n. a bright object in the night sky",
    "n. a famous performer",
    "v. to be the main performer",
  ],
  state: [
    "n. a condition or situation",
    "n. a region of a country",
    "v. to say clearly",
  ],
  stick: [
    "n. a thin piece of wood",
    "v. to attach with glue",
    "v. to remain or stay",
  ],
  still: ["adj. not moving", "adv. continuing", "adv. despite that"],
  stock: [
    "n. goods available for sale",
    "n. shares in a company",
    "v. to keep supplies",
  ],
  store: ["n. a shop selling goods", "v. to keep for future use"],
  story: ["n. a tale or narrative", "n. a floor or level of a building"],
  strike: [
    "v. to hit",
    "n. a refusal to work as protest",
    "v. to seem or occur to someone",
  ],
  subject: [
    "n. a topic being discussed",
    "n. an area of study",
    "adj. likely to be affected by",
  ],
  suit: [
    "n. a set of matching jacket and trousers",
    "v. to be appropriate for",
    "n. one of the four sets in playing cards",
  ],
  supply: ["v. to provide", "n. a stock or store of something"],
  table: [
    "n. a piece of furniture with a flat top",
    "v. to postpone discussion",
  ],
  tap: ["v. to strike lightly", "n. a device for controlling water flow"],
  tear: ["v. to rip or pull apart", "n. a drop of liquid from your eye"],
  tender: [
    "adj. soft or gentle",
    "adj. painful when touched",
    "v. to offer formally",
  ],
  term: [
    "n. a word or expression",
    "n. a fixed period of time",
    "n. a condition in an agreement",
  ],
  tie: [
    "v. to fasten with string or rope",
    "n. a necktie",
    "n. an equal score",
  ],
  tip: [
    "n. the pointed end",
    "n. money given for good service",
    "v. to lean or cause to lean",
  ],
  train: [
    "n. a railway vehicle",
    "v. to teach skills",
    "v. to prepare for sports",
  ],
  trip: ["n. a journey", "v. to stumble or fall"],
  type: ["n. a kind or category", "v. to write using a keyboard"],
  value: [
    "n. the worth or importance",
    "n. the numerical amount",
    "v. to consider important",
  ],
  watch: [
    "v. to look at",
    "n. a small clock worn on the wrist",
    "v. to be careful about",
  ],
  wave: [
    "n. a moving ridge of water",
    "v. to move your hand in greeting",
    "n. a sudden increase",
  ],
  wear: [
    "v. to have clothes or accessories on your body",
    "v. to become damaged through use",
  ],
  well: ["adv. in a good way", "n. a deep hole for water", "adj. healthy"],
  will: [
    "v. expressing future tense",
    "n. determination",
    "n. a legal document about inheritance",
  ],
  wind: ["n. moving air", "v. to turn or twist"],
  yard: [
    "n. an area of land next to a building",
    "n. a unit of length equal to 3 feet",
  ],
};

function improveDefinitions(inputPath, outputPath) {
  console.log(`Reading ${inputPath}...`);
  const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));

  let improvedCount = 0;
  const results = data.map((entry) => {
    if (IMPROVED_DEFINITIONS[entry.name]) {
      improvedCount += 1;
      return {
        ...entry,
        trans: IMPROVED_DEFINITIONS[entry.name],
      };
    }
    return entry;
  });

  console.log(`Improved ${improvedCount} out of ${data.length} entries`);

  fs.writeFileSync(outputPath, `${JSON.stringify(results, null, 2)}\n`, "utf8");
  console.log(`Written to ${outputPath}`);

  return { improved: improvedCount, total: data.length };
}

// Main execution
const dictPath =
  process.argv[2] || "public/dicts/4000_Essential_English_Words-meaning.json";
const stats = improveDefinitions(dictPath, dictPath);

console.log(
  `\nComplete! Improved ${stats.improved} definitions in ${dictPath}`
);
