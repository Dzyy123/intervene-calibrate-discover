"use strict";
(() => {
  const zh=window.ICD_L10N?.zh===true;
  const t=(en,cn)=>zh?cn:en;
  const $=s=>document.querySelector(s);
  document.documentElement.classList.add('reading-layout');

  // Move existing nodes rather than rebuilding evidence or event-bound controls.
  const intro=$('.intro');
  const summary=document.createElement('p');summary.className='hero-summary';
  summary.textContent=t('Align visual readouts with real operations. Discover causal structure through interventions.',
    '让视觉读数对齐真实操作，再用干预发现因果关系。');
  $('.paper-title').after(summary);
  const authorDetail=document.createElement('details');authorDetail.className='hero-detail';authorDetail.id='author-details';
  const authorLabel=document.createElement('summary');authorLabel.textContent=t('Affiliations & project overview','单位与研究简介');
  authorDetail.append(authorLabel);
  $('.paper-authors').after(authorDetail);
  for(const selector of ['.paper-affiliations','.paper-author-notes','.lead']){
    const node=$(selector);if(node)authorDetail.append(node);
  }
  // Keep all resource links; make the demonstration the primary entry point.
  const resources=$('.resource-links');
  const watch=resources.querySelector('a[href="#featured-demos"]');
  if(watch){
    resources.querySelectorAll('a').forEach(a=>a.classList.remove('primary'));
    watch.classList.add('primary');watch.textContent=t('Watch the demo','观看演示');resources.prepend(watch);
  }
  const libraryNav=$('.site-header nav a[href="#featured-demos"]');
  if(libraryNav){libraryNav.href='#demos';libraryNav.textContent=t('Demo library','场景库');}

  const featured=$('#featured-demos');
  if(featured){
    const head=document.createElement('div');head.className='featured-heading';
    const title=featured.querySelector('h2');title.before(head);head.append(title,featured.querySelector('.featured-tabs'));
    const panel=featured.querySelector('.featured-player'),video=panel.querySelector('video');
    // The video is primary; its one-sentence caption follows the image.
    video.after(featured.querySelector('.featured-question'));
    const bar=document.createElement('div');bar.className='featured-controlbar';
    panel.append(bar);bar.append(featured.querySelector('.featured-seek'));
    const info=document.createElement('details');info.className='featured-info';info.id='featured-info';
    const label=document.createElement('summary');label.textContent=t('About this demo & downloads','演示说明与下载');
    const content=document.createElement('div');content.className='featured-info-body';info.append(label,content);bar.append(info);
    const originalNote=featured.querySelector(':scope > details.technical-note');
    for(const selector of [':scope > .section-intro','.featured-caption','.featured-legend','.featured-links']){
      const node=featured.querySelector(selector);if(node)content.append(node);
    }
    if(originalNote){
      const h=document.createElement('h3');h.textContent=originalNote.querySelector('summary').textContent;content.append(h);
      for(const node of [...originalNote.children])if(node.tagName!=='SUMMARY')content.append(node);
      originalNote.remove();
    }
    const more=featured.querySelector('.featured-more');if(more)content.append(more);
  }

  // One supplementary section; no second full-sized report after the conclusion.
  const library=$('#demos');
  if(library){
    library.classList.add('unified-library');
    library.querySelector('h2').textContent=t('More scenes & interactive examples','更多场景与交互示例');
    const returnLink=library.querySelector(':scope > a[href="#discovery"]');
    if(returnLink)returnLink.href='#featured-demos';
    const folds=document.createElement('div');folds.className='walkthrough-list';library.append(folds);
    for(const [id,en,cn,hintEn,hintZh] of [
      ['discovery','Inspect a graph-learning trace','逐步检查图学习过程','Operations, observations and recorded graph updates.','对照操作、观察与记录中的图更新。'],
      ['calibration','Inspect calibrated visual readouts','检查校准前后的视觉读数','Compare the same frozen encoder before and after calibration.','对比同一个冻结编码器校准前后的读数。'],
      ['queries','Inspect paired counterfactual images','检查配对反事实图像','View factual images, predictions and simulation ground truth.','查看事实图像、预测结果与仿真真值。']]){
      const section=document.getElementById(id);if(!section)continue;
      const detail=document.createElement('details');detail.className='walkthrough-fold';detail.id='open-'+id;
      const label=document.createElement('summary'),name=document.createElement('span'),hint=document.createElement('span');
      name.textContent=t(en,cn);hint.textContent=t(hintEn,hintZh);hint.className='fold-hint';label.append(name,hint);
      detail.append(label,section);folds.append(detail);
      detail.addEventListener('toggle',()=>{if(!detail.open)section.querySelectorAll('video').forEach(v=>v.pause());});
      const h=section.querySelector('h2');if(h){const replacement=document.createElement('h3');replacement.id=h.id;replacement.className=h.className;replacement.textContent=h.textContent;h.replaceWith(replacement);}
    }
    const gallery=$('#more-demos');if(gallery){
      library.append(gallery);
      const h=gallery.querySelector('h2');if(h){const replacement=document.createElement('h3');replacement.id=h.id;replacement.textContent=h.textContent;h.replaceWith(replacement);}
    }
  }

  // Preserve deep links and links between interactive examples when sections fold.
  function revealHash(scroll=false){
    let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
    const target=id&&document.getElementById(id);if(!target)return;
    let node=target,opened=false;
    while(node){if(node.tagName==='DETAILS'&&!node.open){node.open=true;opened=true;}node=node.parentElement;}
    if(scroll||opened)requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
  }
  window.addEventListener('hashchange',()=>revealHash(true));
  document.addEventListener('click',event=>{
    const link=event.target.closest('a[href^="#"]');if(!link)return;
    if(link.getAttribute('href')===location.hash)revealHash(true);
  });
  const queries=$('#queries');
  if(queries)new MutationObserver(()=>{
    const target=document.getElementById(location.hash.slice(1));
    if(!queries.hidden&&target&&(target===queries||queries.contains(target)))revealHash(true);
  }).observe(queries,{attributes:true,attributeFilter:['hidden']});
  revealHash();

  // Reserve the actual figure ratio before its lazy-loaded image arrives.
  const figure=$('.method-overview img');
  if(figure){figure.width=2600;figure.height=1002;}
})();
