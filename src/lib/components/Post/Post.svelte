<script lang="ts">
  import type { Post } from '../../../routes/posts';
  import { formatTimeSince, formatCollapsedNumber } from '$lib/utils/formatters';

  export let post: Post;
</script>

<div class="bg-base-100 mb-2 rounded-md p-2">
  <a href="/" class="normal-case text-xl">{post.title}</a>
  <div class="flex">
    <div class="mr-2">{formatCollapsedNumber(post.likes)} likes</div>
    <div class="mr-2">{formatCollapsedNumber(post.dislikes)} dislikes</div>
    <div class="mr-2">Posted by {post.user}</div>
    {#each post.tags as tag}
      <div class="mr-2">#{tag}</div>
    {/each}
    <div class="mr-2">{formatTimeSince(post.createdAt)}</div>
    <div class="mr-2">{formatCollapsedNumber(post.comments)} comments</div>
  </div>
</div>
