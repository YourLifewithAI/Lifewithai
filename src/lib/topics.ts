// The six topics, one verb each. The ids live here and are safe to import anywhere, the sign-up route included.
// Their words (the verb, the small word under it, what each covers) are in words/topics/<id>.md, read by
// src/lib/topic-words.ts on the server. The front page strip, the topic pages, the sign-up ticks, the sign-up
// route's checks and the sitemap all follow this one list.

export type TopicId = 'growing' | 'building' | 'making' | 'fixing' | 'feeding' | 'living';

export const TOPIC_IDS: TopicId[] = ['growing', 'building', 'making', 'fixing', 'feeding', 'living'];

// Two cells on the strip stay open for topics not yet named.
export const OPEN_PLOTS = 2;
