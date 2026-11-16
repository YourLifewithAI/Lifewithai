// The six topics with their words, read from words/topics/<id>.md. Server only: client components get what they
// need as props. The ids themselves are in src/lib/topics.ts.
import { TOPIC_IDS, type TopicId } from './topics';
import { paras, slot, words } from './words';

export interface Topic {
  id: TopicId;
  verb: string;
  covers: string; // a short list, for the title block
  about: string[]; // two or three plain sentences for the topic page
  ask: string; // the question that invites a reader in
}

function topic(id: TopicId): Topic {
  const w = words(`topics/${id}`);
  return {
    id,
    verb: slot(w, 'Name'),
    covers: slot(w, 'Covers'),
    about: paras(w, 'About'),
    ask: slot(w, 'Ask'),
  };
}

export const topics = (): Topic[] => TOPIC_IDS.map(topic);

export const topicById = (id: string): Topic | undefined =>
  (TOPIC_IDS as string[]).includes(id) ? topic(id as TopicId) : undefined;
