// The six topics, one verb each. The front page strip, the topic pages, the sign-up ticks,
// the sign-up route's checks and the sitemap all read this one list.

export type TopicId = 'growing' | 'building' | 'making' | 'fixing' | 'feeding' | 'living';

export interface Topic {
  id: TopicId;
  verb: string;
  gloss: string; // the small word under the verb
  covers: string; // a short list, for the title block
  about: string[]; // two or three plain sentences for the topic page
  ask: string; // the question that invites a reader in
}

export const TOPICS: Topic[] = [
  {
    id: 'growing',
    verb: 'Growing',
    gloss: 'Farms',
    covers: 'Farms, ranches, orchards, greenhouses, gardens, bees',
    about: [
      'Growing is farm and ranch work: fields, herds, orchards, greenhouses, gardens and bees.',
      'It is for people who grow food or raise animals and have put AI to work out there, not on a screen.',
    ],
    ask: 'Farm, ranch, orchard or garden?',
  },
  {
    id: 'building',
    verb: 'Building',
    gloss: 'Construc­tion', // soft hyphen: the word is wider than a phone's strip cell
    covers: 'Framing, wiring, plumbing, heating and cooling',
    about: [
      'Building is the construction trades: framing, wiring, plumbing, heating and cooling.',
      'It is for people who put up and fit out buildings, and who use AI on the job site, not just in the office.',
    ],
    ask: 'Build, wire or plumb for a living?',
  },
  {
    id: 'making',
    verb: 'Making',
    gloss: 'Workshops',
    covers: 'Machining, fabrication, 3D printing, craft, the bench',
    about: [
      'Making is shop and bench work: machining, fabrication, 3D printing and craft.',
      'It is for people who make things with their hands and tools, and who bring AI to the bench.',
    ],
    ask: 'Make things in a shop or at a bench?',
  },
  {
    id: 'fixing',
    verb: 'Fixing',
    gloss: 'Repair',
    covers: 'Cars and trucks, equipment, appliances, the grid',
    about: [
      'Fixing is keeping machines running: cars and trucks, equipment, appliances and the power grid.',
      'It is for mechanics, technicians and line crews who use AI to find a fault or catch one before it happens.',
    ],
    ask: 'Keep machines running?',
  },
  {
    id: 'feeding',
    verb: 'Feeding',
    gloss: 'Kitchens',
    covers: 'Kitchens, bakeries, food processing, cold storage',
    about: [
      'Feeding is food work after the farm: kitchens, bakeries, food processing and cold storage.',
      'It is for cooks, bakers and the people who run a line, and who have found a real job for AI in it.',
    ],
    ask: 'Cook, bake or run a line?',
  },
  {
    id: 'living',
    verb: 'Living',
    gloss: 'Health and access',
    covers: 'Health and accessibility: aids people build for themselves',
    about: [
      'Living is health and accessibility: aids people build for themselves to make daily life easier.',
      'A robot arm that helps around the house is the kind of thing that belongs here. Health tips do not.',
    ],
    ask: 'Building something to make daily life easier?',
  },
];

// Two cells on the strip stay open for topics not yet named.
export const OPEN_PLOTS = 2;

export const TOPIC_IDS: TopicId[] = TOPICS.map((t) => t.id);

export const topicById = (id: string): Topic | undefined => TOPICS.find((t) => t.id === id);
