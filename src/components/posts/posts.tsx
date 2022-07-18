import { FunctionComponent } from 'react';
import { Post } from './post';

export type PostDto = {
  id: string;
  title: string;
  tags: string[];
  createdAt: Date;
  createdBy: string;
  likes: number;
  comments: number;
};

export const Posts: FunctionComponent = () => {
  const posts: PostDto[] = [
    {
      id: '1',
      title: 'Post 1',
      tags: ['tag1', 'tag2'],
      createdAt: new Date(),
      createdBy: 'user1',
      likes: 0,
      comments: 0,
    },
  ];
  return (
    <div>
      {posts.map(post => (
        <Post key={post.id} post={post} />
      ))}
    </div>
  );
};
