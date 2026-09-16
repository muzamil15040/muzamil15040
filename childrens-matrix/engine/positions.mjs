/** Child-facing positions mapped onto personal-chart vertices. */

export const METHODOLOGY = 'destiny-matrix-22';
export const METHODOLOGY_VERSION = 'children-v1';
export const CHART_VERSION = 'children-map-v1';

export const CHILD_POSITIONS = [
  {
    id: 'core',
    title: 'Core Personality',
    chartKey: 'epoint',
    source: 'points',
    description: 'The central symbolic comfort zone and personality theme.',
    parentPrompt: 'parents may notice as a steady thread in how the child settles and recovers',
  },
  {
    id: 'expression',
    title: 'How They Show Up',
    chartKey: 'apoint',
    source: 'points',
    description: 'Symbolic outer expression and first impression energy.',
    parentPrompt: 'may show up in how the child presents themselves day to day',
  },
  {
    id: 'talents',
    title: 'Natural Talents',
    chartKey: 'bpoint',
    source: 'points',
    description: 'Symbolic strengths, interests, and natural leanings.',
    parentPrompt: 'may appear in activities the child returns to willingly',
  },
  {
    id: 'learning',
    title: 'Learning Tendencies',
    chartKey: 'tpoint',
    source: 'points',
    description: 'Symbolic learning preferences along the talent channel.',
    parentPrompt: 'may be useful to observe during learning and practice',
  },
  {
    id: 'communication',
    title: 'Communication',
    chartKey: 'wpoint',
    source: 'points',
    description: 'Symbolic communication and heart-channel expression.',
    parentPrompt: 'may show in how the child shares ideas and feelings',
  },
  {
    id: 'emotions',
    title: 'Emotional Expression',
    chartKey: 'jpoint',
    source: 'points',
    description: 'Symbolic emotional themes on the feeling line.',
    parentPrompt: 'may help parents notice how feelings are expressed',
  },
  {
    id: 'creativity',
    title: 'Creativity & Imagination',
    chartKey: 'kpoint',
    source: 'points',
    description: 'Symbolic creative and imaginative expression.',
    parentPrompt: 'may invite playful or imaginative exploration',
  },
  {
    id: 'social',
    title: 'Social Interaction',
    chartKey: 'cpoint',
    source: 'points',
    description: 'Symbolic social interaction and group energy.',
    parentPrompt: 'may appear in friendships and group settings',
  },
  {
    id: 'motivation',
    title: 'Motivation',
    chartKey: 'spoint',
    source: 'points',
    description: 'Symbolic motivation and inner drive themes.',
    parentPrompt: 'may hint at what encourages engagement',
  },
  {
    id: 'family',
    title: 'Family Dynamic',
    chartKey: 'dpoint',
    source: 'points',
    description: 'Symbolic home and family-interaction themes.',
    parentPrompt: 'may relate to comfort, boundaries, and belonging at home',
  },
  {
    id: 'purpose',
    title: 'Inner Direction',
    chartKey: 'perspurpose',
    source: 'purposes',
    description: 'Symbolic personal-direction theme of the chart.',
    parentPrompt: 'may be a gentle compass for curiosity and meaning',
  },
  {
    id: 'growth',
    title: 'Developmental Growth',
    chartKey: 'xpoint',
    source: 'points',
    description: 'Symbolic growth and unfolding themes.',
    parentPrompt: 'may point to qualities that develop with support over time',
  },
  {
    id: 'challenge',
    title: 'Areas for Growth',
    chartKey: 'rpoint',
    source: 'points',
    description: 'Symbolic awareness themes where patience and support may help.',
    parentPrompt: 'may be areas where gentle coaching is more useful than pressure',
  },
];

export function resolvePositions(matrix) {
  return CHILD_POSITIONS.map((pos) => {
    const bag = matrix[pos.source];
    const energy = bag[pos.chartKey];
    if (!Number.isInteger(energy) || energy < 1 || energy > 22) {
      throw new Error(`Invalid energy for ${pos.id}`);
    }
    return {
      id: pos.id,
      title: pos.title,
      chartKey: pos.chartKey,
      energy,
      description: pos.description,
      parentPrompt: pos.parentPrompt,
    };
  });
}
