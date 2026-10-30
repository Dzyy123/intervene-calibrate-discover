"use strict";
// One presentation shell for all three player locations. Existing handlers and
// scientific content are moved, not recreated or discarded.
(() => {
  const zh=window.ICD_L10N?.zh===true,t=(en,cn)=>zh?cn:en;
  const $=s=>document.querySelector(s);
  document.documentElement.classList.add('shared-players');
  function setup({video,anchor,chapters,restart,caption,info,parts,question}){
    if(!video||!anchor)return;
    video.classList.add('shared-demo-video');
    if(question)video.before(question);
    const bar=document.createElement('div');bar.className='demo-toolbar';
    anchor.after(bar);
    if(!restart){restart=document.createElement('button');restart.type='button';restart.addEventListener('click',()=>{video.currentTime=0;video.play().catch(()=>{});});}
    restart.textContent=t('Restart','从头播放');restart.classList.add('demo-restart');bar.append(restart);
    chapters.classList.add('demo-chapters');bar.append(chapters);
    const rateLabel=document.createElement('label');rateLabel.className='demo-rate';
    rateLabel.append(document.createTextNode(t('Speed','速度')));
    const rate=document.createElement('select');rate.setAttribute('aria-label',t('Playback speed','播放速度'));
    rate.title=t('Relative to the edited video; the in-video label reports recorded motion speed.','相对于剪辑后视频的播放速度；画面内倍速标记描述记录动作速度。');
    for(const value of [0.75,1,1.25,1.5,2]){const o=document.createElement('option');o.value=value;o.textContent=value+'×';o.selected=value===1;rate.append(o);}
    rate.addEventListener('change',()=>{video.playbackRate=Number(rate.value);});
    video.addEventListener('loadedmetadata',()=>{video.playbackRate=Number(rate.value);});
    rateLabel.append(rate);bar.append(rateLabel);
    if(caption){caption.classList.add('demo-stage-caption');bar.after(caption);}
    if(!info){info=document.createElement('details');info.append(document.createElement('summary'));}
    info.classList.add('demo-info');info.open=false;
    info.querySelector('summary').textContent=t('Demo details & sources','演示说明与来源');
    (caption||bar).after(info);
    for(const part of parts||[])if(part)info.append(part);
    function normalizeChapter(){
      const span=chapters.querySelector('label>span');if(span&&span.textContent!==t('Chapter','章节'))span.textContent=t('Chapter','章节');
      chapters.hidden=!chapters.querySelector('select');
    }
    new MutationObserver(normalizeChapter).observe(chapters,{childList:true,subtree:true});normalizeChapter();
    return info;
  }
  const fv=$('#featured-panel video');
  setup({video:fv,anchor:fv,chapters:$('.featured-seek'),caption:$('.featured-caption'),info:$('#featured-info'),question:$('.featured-question')});
  const extraInfo=setup({video:$('#extra-video'),anchor:$('#extra-video'),chapters:$('#extra-chapters'),restart:$('#extra-restart'),caption:$('#extra-stage'),parts:[$('.extra-copy')]});
  const interactiveInfo=setup({video:$('#discovery-video'),anchor:$('.case-media')||$('.video-shell'),chapters:$('#story-chapters'),restart:$('#restart-video'),caption:$('#story-caption'),parts:[$('.scene-summary'),$('#scene-node-key'),$('#case-guide'),$('.case-explanation'),$('.case-controls'),$('#discovery .watch-guide'),$('#discovery .graph-legend'),$('#scene-scope')]});
  // Explanations are injected asynchronously by the existing scene scripts.
  function collect(){
    for(const [node,detail] of [[$('#demo-brief'),extraInfo],[$('#primary-demo-brief'),interactiveInfo],[$('.demo-evidence-type'),interactiveInfo]])
      if(node&&detail&&!detail.contains(node))detail.append(node);
  }
  const observer=new MutationObserver(collect);observer.observe($('#demos'),{childList:true,subtree:true});collect();
  function sceneSelector(source,selector){
    if(!source)return;
    const label=document.createElement('label');label.className='demo-scene-selector';
    const title=document.createElement('span');title.textContent=t('Scene','场景');
    const select=document.createElement('select');select.setAttribute('aria-label',t('Choose demo scene','选择演示场景'));
    label.append(title,select);source.before(label);source.classList.add('shared-scene-source');
    function sync(){
      const buttons=[...source.querySelectorAll(selector)];select.replaceChildren();
      for(const [i,b] of buttons.entries()){
        const o=document.createElement('option');o.value=String(i);o.textContent=b.querySelector('strong')?.textContent||b.textContent.trim().split('\n')[0];o.selected=b.getAttribute('aria-selected')==='true';select.append(o);
      }
      select.disabled=!buttons.length;
    }
    select.addEventListener('change',()=>source.querySelectorAll(selector)[Number(select.value)]?.click());
    new MutationObserver(sync).observe(source,{childList:true,subtree:true,attributes:true,attributeFilter:['aria-selected']});sync();
  }
  sceneSelector($('.featured-tabs'),'button');sceneSelector($('.scene-tabs'),'button');sceneSelector($('#extra-list'),'button');
})();
