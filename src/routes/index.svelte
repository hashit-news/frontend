<script context="module" lang="ts">
  import config from '$lib/config';

  /** @type {import('./__types/index').Load} */
  export async function load({ fetch }) {
    const res = await fetch(`http://localhost:${config.app.port}/posts`);
    const posts = await res.json();

    return {
      props: {
        posts,
      },
      cache: {
        maxage: 60,
      },
    };
  }
</script>

<script lang="ts">
  import type { Post } from './posts';
  import PostComponent from '$lib/components/Post/Post.svelte';

  export let posts: Post[];
</script>

{#each posts as post}
  <PostComponent {post} />
{/each}
