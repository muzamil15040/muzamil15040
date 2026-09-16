/**
 * Energy × position opening lines so the same arcana is not copy-pasted
 * across Learning vs Emotions vs Family, etc.
 */

const HOOKS = {
  core: {
    1: 'At the center, this energy may color everyday initiative and “I can try” moments.',
    2: 'At the center, quiet knowing and careful watching may feel like home base.',
    3: 'At the center, warmth, creativity, and sensory comfort may feel foundational.',
    4: 'At the center, steadiness and clear structure may feel reassuring.',
    5: 'At the center, meaningful guidance and shared values may feel important.',
    6: 'At the center, connection and heartfelt choice may feel like the main theme.',
    7: 'At the center, forward motion and brave direction may feel natural.',
    8: 'At the center, gentle strength and heart-led courage may set the tone.',
    9: 'At the center, reflective independence may be a recurring comfort.',
    10: 'At the center, cycles of change and fresh turns may feel familiar.',
    11: 'At the center, fairness and balanced truth may matter deeply.',
    12: 'At the center, pauses and new perspectives may shape the inner climate.',
    13: 'At the center, transformation and release may be part of the child’s symbolic story.',
    14: 'At the center, blending and paced harmony may feel steadying.',
    15: 'At the center, strong wants and loyal attachments may be noticeable.',
    16: 'At the center, breakthrough energy and honest resets may appear in growth moments.',
    17: 'At the center, hope and inspired calm may be a guiding light.',
    18: 'At the center, imagination and sensitivity may color the inner world.',
    19: 'At the center, warmth, joy, and visibility may feel core.',
    20: 'At the center, awakening and meaningful renewal may be thematic.',
    21: 'At the center, integration and belonging may feel essential.',
    22: 'At the center, open beginnings and playful trust may define the tone.',
  },
  learning: {
    default: 'In a learning context, this energy may shape how curiosity meets practice.',
  },
  communication: {
    default: 'In communication, this energy may color how ideas and feelings are shared.',
  },
  emotions: {
    default: 'In emotional expression, this energy may relate to how feelings rise and settle.',
  },
  creativity: {
    default: 'In creativity, this energy may invite particular kinds of imaginative play.',
  },
  social: {
    default: 'In social settings, this energy may influence comfort with peers and groups.',
  },
  motivation: {
    default: 'For motivation, this energy may hint at what invites willing engagement.',
  },
  family: {
    default: 'In family life, this energy may relate to belonging, boundaries, and comfort at home.',
  },
  talents: {
    default: 'As a talent theme, this energy may point to interests worth gently exploring.',
  },
  expression: {
    default: 'In how they show up, this energy may shape first impressions and daily style.',
  },
  purpose: {
    default: 'As an inner-direction theme, this energy may offer a symbolic compass for meaning.',
  },
  growth: {
    default: 'As a growth theme, this energy may unfold with support over time.',
  },
  challenge: {
    default: 'As an area for growth, this energy may benefit from patience more than pressure.',
  },
};

const LEARNING_BY_ENERGY = {
  1: 'Hands-on trials and clear “make something” tasks may engage attention.',
  2: 'Quiet observation, stories, and time to think before answering may help.',
  3: 'Arts, nature, and sensory materials may support learning enjoyment.',
  4: 'Predictable steps, checklists, and defined goals may feel supportive.',
  5: 'Mentors, traditions, and explaining the “why” may deepen learning.',
  6: 'Partner work and heartfelt relevance may increase engagement.',
  7: 'Challenges with visible progress and movement breaks may help.',
  8: 'Encouragement that honors effort and calm persistence may matter.',
  9: 'Independent projects with occasional check-ins may fit well.',
  10: 'Varied formats and short cycles of novelty may sustain interest.',
  11: 'Fair feedback and clear criteria may support confidence.',
  12: 'Time to look at problems from another angle may unlock learning.',
  13: 'Learning through change stories and renewing habits may resonate.',
  14: 'Balanced pacing—neither rushed nor stalled—may work best.',
  15: 'Strong personal interests can be bridges into broader skills.',
  16: 'Honest resets after frustration, then rebuilding, may be key.',
  17: 'Hopeful goals and inspiring examples may spark practice.',
  18: 'Imaginative framing and gentle reassurance may support focus.',
  19: 'Bright, social, celebratory learning moments may energize.',
  20: 'Reflecting on progress and “what I learned” may deepen growth.',
  21: 'Projects that connect skills into a finished whole may motivate.',
  22: 'Playful exploration with light structure may invite learning.',
};

export function facetHook(positionId, energy) {
  const table = HOOKS[positionId] || {};
  if (table[energy]) return table[energy];
  if (positionId === 'learning' && LEARNING_BY_ENERGY[energy]) {
    return LEARNING_BY_ENERGY[energy];
  }
  return table.default || 'In this position, the calculated energy offers a symbolic theme for reflection.';
}

export function learningHook(energy) {
  return LEARNING_BY_ENERGY[energy] || HOOKS.learning.default;
}
