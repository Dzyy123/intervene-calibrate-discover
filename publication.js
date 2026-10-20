"use strict";
(() => {
  const zh=window.ICD_L10N?.zh===true;
  const links=[
    ['assets/paper.pdf','Paper · English','英文论文'],
    ['#demos','Demonstrations','演示视频']
  ];
  const resources=document.querySelector('.resource-links');resources.replaceChildren();
  for(const[href,en,cn]of links){const a=document.createElement('a');a.href=href;a.textContent=zh?cn:en;a.className='button'+(href===links[0][0]?' primary':'');if(!href.startsWith('#')){a.target='_blank';a.rel='noopener';}resources.append(a);}
  const reference=document.createElement('p');reference.className='release-reading-link';
  const code=document.createElement('span');code.className='button';code.setAttribute('aria-disabled','true');code.textContent=zh?'代码 · 暂未公开':'Code · not yet public';resources.append(code);
  const availability=document.createElement('span');availability.textContent=zh?'代码、训练数据和模型权重暂未公开。':'Code, training data and model weights are not yet public.';
  const inventory=document.createElement('a');inventory.href='assets/publication-manifest.json';inventory.target='_blank';inventory.rel='noopener';inventory.textContent=zh?'文件版本与校验值':'File versions & checksums';
  reference.append(availability,document.createTextNode(' · '),inventory);
  document.querySelector('#evidence').append(reference);
})();
