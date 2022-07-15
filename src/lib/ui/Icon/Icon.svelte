<script lang="ts">
  import feather from 'feather-icons';

  const directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

  export let name: string;
  export let direction: 'n' | 'ne' | 'e' | 'se' | 's' | 'sw' | 'w' | 'nw' = 'n';
  export let width = '1em';
  export let height = '1em';

  $: rotation = directions.indexOf(direction) * 45;
  $: icon = feather.icons[name];
</script>

{#if icon}
  <div class={`justify-items-center align-middle ${$$props.class || ''}`}>
    <svg {...icon.attrs} style="width: {width}; height: {height}; transform: rotate({rotation}deg);">
      <g>
        {@html icon.contents}
      </g>
    </svg>
  </div>
{/if}
