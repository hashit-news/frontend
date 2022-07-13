<script context="module" lang="ts">
  export async function load() {
    const res = await fetch('http://localhost:3000/posts');
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
