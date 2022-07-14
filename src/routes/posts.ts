import moment from 'moment';

export interface Post {
  id: string;
  title: string;
  user: string;
  tags: string[];
  createdAt: Date;
  likes: number;
  dislikes: number;
  comments: number;
}

/** @type {import('./__types/items').RequestHandler} */
export async function get() {
  const posts: Post[] = [
    {
      id: '1',
      title: 'D.C. United name Wayne Rooney as Head Coach.',
      user: 'helloworld65',
      tags: ['soccer', 'football'],
      createdAt: moment.utc().subtract(5, 'minutes').toDate(),
      likes: 5,
      dislikes: 25,
      comments: 462,
    },
    {
      id: '2',
      title: `Fred's beautiful bicycle goal during his retirement match today`,
      user: 'Rubberbandshooter',
      tags: ['soccer', 'football', 'funny'],
      createdAt: moment.utc().subtract(1, 'days').toDate(),
      likes: 15,
      dislikes: 3,
      comments: 123,
    },
    {
      id: '3',
      title: `[Kevin Durant] Did u add to your legacy today? If so, what did u do? [Maggie] Um, I emptied the dishwasher? [Durant] Great leadership Maggie. U made everybody in the house better today which adds to your legacy.`,
      user: 'GuyCarbonneauGOAT',
      tags: ['nba', 'basketball', 'twitter'],
      createdAt: moment.utc().subtract(1, 'hours').toDate(),
      likes: 2123,
      dislikes: 2,
      comments: 1203,
    },
  ];

  return { status: 200, headers: {}, body: posts };
}
