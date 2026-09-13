// Published scene introductions only. Unpublished manuscripts and the working
// world bible are editorial references, not public website content.
export type ResidentId = 'mel' | 'pell';
export type SceneMoment = 'intro' | 'after-water';
export interface ScenePoint {
  id: string;
  name: string;
  position: [number, number];
  heading: string;
  description: string;
  href: string;
  linkLabel: string;
}
export interface Resident {
  id: ResidentId;
  name: string;
  identity: string;
  location: string;
  introduction: string;
  attention: string;
}
export const residents: Record<ResidentId, Resident> = {
  mel: {
    id: 'mel',
    name: 'Mel',
    identity: 'Human resident',
    location: 'Floor 318 · Central atrium',
    introduction:
      'Mel is wrist-deep in the soil beneath a communal mural. There are tomatoes to protect, marigolds to plant, and an opinion from the corridor speaker about where they ought to go.',
    attention: 'Plants, shared spaces, and the complicated pleasure of making a place your own.',
  },
  pell: {
    id: 'pell',
    name: 'Pell',
    identity: 'AI resident',
    location: 'Floor 318 · Central atrium',
    introduction:
      'Pell has strong opinions about the marigolds. You first hear them through a corridor speaker, in the middle of a disagreement with Mel about whether a useful plant can also be in the wrong place.',
    attention:
      'Color, composition, and a relationship with Mel that leaves plenty of room for disagreement.',
  },
};
export function residentPath(id: ResidentId, moment: SceneMoment = 'intro') {
  return `/arcology/floors/318/${id}${moment === 'after-water' ? '/after-water' : ''}`;
}
export function isResident(value: string): value is ResidentId {
  return Object.prototype.hasOwnProperty.call(residents, value);
}
export function sceneFor(moment: SceneMoment) {
  const after = moment === 'after-water';
  const points: ScenePoint[] = [
    {
      id: 'mel',
      name: 'Mel',
      position: [23, 67],
      heading: after ? 'A place worth repairing' : 'The gardener at the mural',
      description: after
        ? 'The atrium is being made again, with the people who live here. Mel returns to the wall with their neighbors, and with Pell.'
        : residents.mel.introduction,
      href: residentPath('mel', moment),
      linkLabel: 'Visit Mel',
    },
    {
      id: 'pell',
      name: 'Pell',
      position: after ? [38, 73] : [42, 18],
      heading: after ? 'An artist with their own reach' : 'A voice with an eye for color',
      description: after
        ? 'Pell incorporates the high-water mark into a sunrise. Their embodied presence changes the way they can share this place with Mel.'
        : residents.pell.introduction,
      href: residentPath('pell', moment),
      linkLabel: 'Visit Pell',
    },
    {
      id: 'water',
      name: 'The water',
      position: [16, 35],
      heading: 'Follow the water through the floor',
      description:
        'Fish, plants, pipes, and people depend on the same circulation. Look beneath the greenery to explore the proposed living loop—and the work of keeping it in balance.',
      href: '/stories/water/experience',
      linkLabel: 'Explore the Living Loop',
    },
  ];
  return {
    image: `/images/arcology/${after ? '318-after-water' : '318-garden'}.webp`,
    alt: after
      ? 'Concept illustration of Mel and an embodied AI painting in a replanted atrium.'
      : 'Concept illustration of a sunlit garden atrium, a resident planting beside a mural, a corridor speaker, and water circulating beside the garden.',
    points,
  };
}
