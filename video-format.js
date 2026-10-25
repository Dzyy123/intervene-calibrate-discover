"use strict";
(() => {
  // All listed derivatives are verified by assets/media-presentation.json.
  const files=new Set(['chain-learning.mp4','chain-story-v3.mp4','chain-story-zh.mp4','domino-learning.mp4',
    'extra-balance_learning.mp4','extra-balance_load_pair.mp4','extra-balance_target_pair.mp4',
    'extra-pnp_grasp_pair.mp4','extra-pnp_six_learning.mp4','library-domino_frozen_operations.mp4',
    'library-domino_hold_middle.mp4','library-domino_push_last.mp4','library-domino_push_middle.mp4',
    'library-env_balance.mp4','library-env_billiards.mp4','library-env_domino.mp4','library-env_gears.mp4',
    'library-env_pickplace_1d.mp4','library-env_pickplace_2d.mp4','library-tool_hook_pull.mp4',
    'library-tool_miss_cube.mp4','library-tool_open_gripper.mp4','parallel-learning.mp4',
    'parallel-story-v3.mp4','parallel-story-zh.mp4']);
  window.ICD_MEDIA_URL=url=>{const name=url.split('/').pop();if(name==='extra-balance_learning.mp4')return url.slice(0,-name.length)+'featured-balance.mp4';return files.has(name)?url.slice(0,-name.length)+'display-'+name:url;};
  for(const v of document.querySelectorAll('video')){
    const source=v.querySelector('source'),raw=v.getAttribute('src')||source?.getAttribute('src');
    if(raw){v.src=window.ICD_MEDIA_URL(raw);if(raw.endsWith('extra-balance_learning.mp4'))v.poster='assets/featured-balance.jpg';v.preload='metadata';v.load();}
  }
})();
