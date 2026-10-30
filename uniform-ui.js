"use strict";
(() => {
  const r=window.ICD_UNIFORM_REGISTRY;if(!r)return;
  document.documentElement.classList.add('uniform-media');
  const zh=window.ICD_L10N?.zh===true;
  const catalog=document.getElementById('library-manifest-link');
  if(catalog){catalog.href='uniform-registry.json';catalog.textContent=zh?'统一版媒体清单':'Uniform-media inventory';}
})();
