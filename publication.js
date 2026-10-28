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
  const code=document.createElement('a');code.className='button';code.href='https://github.com/Dzyy123/icd-physical-demos';code.target='_blank';code.rel='noopener';code.textContent=zh?'Code · 演示代码':'Code · Demos';resources.append(code);
  const availability=document.createElement('span');availability.textContent=zh?'链式与分叉 demo 代码和运行记录已公开；主研究仓库、训练图像与模型权重继续保持私有。':'Chain/fork demo code and run records are public; the main research repository, training images and model weights remain private.';
  const inventory=document.createElement('a');inventory.href='assets/publication-manifest.json';inventory.target='_blank';inventory.rel='noopener';inventory.textContent=zh?'文件版本与校验值':'File versions & checksums';
  reference.append(availability,document.createTextNode(' · '),inventory);
  document.querySelector('#evidence').append(reference);
})();
