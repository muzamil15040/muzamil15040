import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { facetHook, learningHook } from './facets.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ENERGIES = JSON.parse(readFileSync(join(__dirname, '../data/energies.json'), 'utf8'));

const BANNED = [
  /\byour child is definitely\b/i,
  /\bwill become\b/i,
  /\bdestined to\b/i,
  /\b(?:this chart|numerology|the matrix)\s+(?:can|may|will)\s+diagnos/i,
  /\bdiagnosed with\b/i,
  /\banxiety disorder\b/i,
  /\bhas ADHD\b/i,
  /\bhas autism\b/i,
  /\bis lazy\b/i,
  /\bproblem child\b/i,
  /\bweak child\b/i,
];

function energyOf(positions, id) {
  const p = positions.find((x) => x.id === id);
  if (!p) throw new Error(`Missing position ${id}`);
  return p;
}

function e(n) {
  const row = ENERGIES[String(n)] || ENERGIES[n];
  if (!row) throw new Error(`Missing energy ${n}`);
  return row;
}

function ageVoice(band) {
  if (band === '0-5') {
    return {
      observe: 'Parents of younger children may observe',
      child: 'the child',
      develop: 'may begin to show',
    };
  }
  if (band === '14-17' || band === '18+') {
    return {
      observe: 'Parents may notice that the young person',
      child: 'they',
      develop: 'may increasingly show',
    };
  }
  return {
    observe: 'Parents may observe',
    child: 'the child',
    develop: 'may show',
  };
}

function sectionFor(pos, band) {
  const arc = e(pos.energy);
  const voice = ageVoice(band);
  const hook = facetHook(pos.id, pos.energy);
  const gift = arc.gifts[0];
  const shadow = arc.shadows[0];

  return [
    `${pos.title} holds Energy ${pos.energy} — ${arc.name}.`,
    hook,
    `${arc.essence} ${voice.observe} themes linked with ${arc.keywords.slice(0, 2).join(' and ')}.`,
    `A constructive expression may include ${gift}.`,
    `A possible shadow expression to watch gently (not label) is ${shadow}.`,
    `In this chart position, ${pos.parentPrompt}.`,
    `${arc.parentCue}`,
  ].join(' ');
}

function validateText(text) {
  for (const re of BANNED) {
    if (re.test(text)) {
      throw new Error('Interpretation failed safety validation.');
    }
  }
}

export function composeReading({ childName, age, ageBand, positions, guardianName }) {
  const voice = ageVoice(ageBand);
  const core = energyOf(positions, 'core');
  const talents = energyOf(positions, 'talents');
  const learning = energyOf(positions, 'learning');
  const communication = energyOf(positions, 'communication');
  const emotions = energyOf(positions, 'emotions');
  const creativity = energyOf(positions, 'creativity');
  const social = energyOf(positions, 'social');
  const motivation = energyOf(positions, 'motivation');
  const family = energyOf(positions, 'family');
  const purpose = energyOf(positions, 'purpose');
  const growth = energyOf(positions, 'growth');
  const challenge = energyOf(positions, 'challenge');
  const expression = energyOf(positions, 'expression');

  const coreArc = e(core.energy);
  const talentArc = e(talents.energy);
  const challengeArc = e(challenge.energy);
  const growthArc = e(growth.energy);

  const greeting = guardianName
    ? `${guardianName}, this symbolic profile for ${childName}`
    : `This symbolic profile for ${childName}`;

  const overview = [
    `${greeting} uses the Destiny Matrix 22-energy tradition based on birth-date calculation — not a medical or psychological assessment.`,
    `Core Personality shows Energy ${core.energy} (${coreArc.name}).`,
    `Natural Talents show Energy ${talents.energy} (${talentArc.name}), while Areas for Growth highlight Energy ${challenge.energy} (${challengeArc.name}).`,
    `${voice.observe} patterns connected with ${coreArc.keywords[0]}, while remembering that ${childName}'s real behavior, relationships, and experiences matter more than any chart.`,
  ].join(' ');

  const growthAreas = [
    {
      title: challenge.title,
      energy: challenge.energy,
      name: challengeArc.name,
      text: sectionFor(challenge, ageBand),
    },
    {
      title: 'Balancing strength and sensitivity',
      energy: core.energy,
      name: coreArc.name,
      text: `With Core Energy ${core.energy}, a useful growth edge may be noticing when ${coreArc.shadows[1] || coreArc.shadows[0]} appears, then returning to gifts like ${coreArc.gifts[1] || coreArc.gifts[0]}.`,
    },
    {
      title: growth.title,
      energy: growth.energy,
      name: growthArc.name,
      text: sectionFor(growth, ageBand),
    },
  ];

  const parentSupport = [
    coreArc.parentCue,
    e(learning.energy).parentCue,
    e(emotions.energy).parentCue,
    e(family.energy).parentCue,
    'Praise effort and curiosity more than fixed outcomes.',
    'Treat this chart as a prompt for observation, not a script for who the child must be.',
    'If you have real developmental, learning, or health concerns, consult a qualified professional — numerology cannot diagnose.',
  ];

  const reading = {
    overview,
    corePersonality: sectionFor(core, ageBand),
    expression: sectionFor(expression, ageBand),
    talents: sectionFor(talents, ageBand),
    learning: `${sectionFor(learning, ageBand)} ${learningHook(learning.energy)}`,
    communication: sectionFor(communication, ageBand),
    emotions: sectionFor(emotions, ageBand),
    creativity: sectionFor(creativity, ageBand),
    social: sectionFor(social, ageBand),
    motivation: sectionFor(motivation, ageBand),
    family: sectionFor(family, ageBand),
    purpose: sectionFor(purpose, ageBand),
    growth: sectionFor(growth, ageBand),
    growthAreas,
    parentSupport,
    finalSummary: {
      coreTheme: `${childName}'s Core Personality energy is ${core.energy} (${coreArc.name}), traditionally associated with ${coreArc.keywords.join(', ')}.`,
      strength: `A natural-strength theme appears in Talents as Energy ${talents.energy} (${talentArc.name}) — parents may explore ${talentArc.gifts[0]}.`,
      growthArea: `An area for growth is highlighted by Energy ${challenge.energy} (${challengeArc.name}). ${challengeArc.parentCue}`,
      supportiveEnvironment: `A supportive environment may blend ${e(family.energy).keywords[0]} at home with ${e(learning.energy).keywords[0]} in learning spaces, paced for age band ${ageBand}.`,
      reflection: `This reading is for reflection and entertainment. ${childName} is not defined by a birth-date calculation — attentive caregiving and the child's lived experience come first.`,
    },
    meta: {
      childName,
      age,
      ageBand,
      wordEstimate: null,
    },
  };

  const blob = JSON.stringify(reading);
  validateText(blob);
  reading.meta.wordEstimate = blob.split(/\s+/).length;
  return reading;
}

export function nodeDetail(position, energyNumber) {
  const arc = e(energyNumber);
  return {
    energy: energyNumber,
    name: arc.name,
    title: position.title,
    symbolicMeaning: `${arc.essence} In the ${position.title} position, ${facetHook(position.id, energyNumber)}`,
    positiveExpression: arc.gifts,
    shadowExpression: arc.shadows,
    parentsMayObserve: `Parents may observe themes of ${arc.keywords.join(', ')} in ways that fit the child's age and temperament.`,
    supportiveIdeas: [arc.parentCue, 'Stay curious; let real-life observation lead.'],
  };
}
