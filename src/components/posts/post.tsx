import { FunctionComponent } from 'react';
import { PostDto } from './posts';

type PostProps = {
  post: PostDto;
};

export const Post: FunctionComponent<PostProps> = ({ post }) => {
  return (
    <div>
      <h1>{post.title}</h1>
    </div>
  );
};
