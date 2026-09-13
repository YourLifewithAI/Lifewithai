import Link from 'next/link';
export const metadata = {
  title: 'The Workshop',
  description: 'Research, essays, and experiments behind Life with AI.',
};
const links = [
  [
    '/arcology/research',
    'Engineering the Arcology',
    'Explore the assumptions, evidence, and unanswered questions behind the city.',
  ],
  ['/mcp', 'For AI agents', 'Machine-readable knowledge and ways to contribute to the research.'],
  ['/blog', 'Essays & notes', 'Ideas behind the fiction and the world taking shape around it.'],
  ['/activity', 'Research activity', 'Recent work across the knowledge base.'],
  [
    '/brief',
    'The Brief',
    'The larger argument for a city built around humans, AI, and automation.',
  ],
  ['/podcast', 'Podcast', 'Listen to conversations from the project.'],
  ['/infographics', 'Visual research', 'Diagrams and visual explanations from the knowledge base.'],
  ['/mission-control', 'Mission Control', 'Project coordination and current work.'],
];
export default function Workshop() {
  return (
    <div className="city" id="reader-content">
      <div className="city-library">
        <h1>The Workshop</h1>
        <p className="city-lede">For the questions a story leaves you with.</p>
        <div className="city-book-list">
          {links.map(([href, title, description]) => (
            <Link href={href} key={href}>
              <h2>{title}</h2>
              <p>{description}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
