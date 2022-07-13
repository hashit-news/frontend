export interface Post {
  id: string;
  title: string;
  user: string;
  tags: string[];
}

/** @type {import('./__types/items').RequestHandler} */
export async function get() {
  const posts: Post[] = [
    {
      id: '1',
      title: 'D.C. United name Wayne Rooney as Head Coach.',
      user: 'helloworld65',
      tags: ['soccer', 'football'],
    },
    {
      id: '2',
      title: `Fred's beautiful bicycle goal during his retirement match today`,
      user: 'Rubberbandshooter',
      tags: ['soccer', 'football', 'funny'],
    },
    {
      id: '3',
      title: `[Kevin Durant] Did u add to your legacy today? If so, what did u do? [Maggie] Um, I emptied the dishwasher? [Durant] Great leadership Maggie. U made everybody in the house better today which adds to your legacy.`,
      user: 'GuyCarbonneauGOAT',
      tags: ['nba', 'basketball', 'twitter'],
    },
  ];

  return { status: 200, headers: {}, body: posts };
}
