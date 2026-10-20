"use strict";
(async()=>{
  const zh=window.ICD_L10N?.zh===true,t=(en,cn)=>zh?cn:en;
  const scenes=[
    ['domino','Domino chain','多米诺','Hold, then push the same domino. Separate experimental evidence from rule propagation.','先夹持、再推倒同一块骨牌。区分干预证据与图规则传播。'],
    ['balance','Balance','平衡','Move the load, then the target. Watch which directions change—and which stay uncertain.','先搬动载荷、再移动目标。看哪些方向获得证据，哪些仍然不确定。'],
    ['pickplace','Pick & place','抓取放置','Change the gripper opening, then its position. A new operation need not add a new edge.','先改变夹爪开合、再改变位置。新的操作不一定带来新的边。']
  ];
  const section=document.createElement('section');section.id='featured-demos';section.className='container featured-demos';
  section.innerHTML=`<p class="eyebrow">${t('Three scenes · one visual language','三个场景 · 一条清楚的叙事')}</p>
    <h2>${t('See the action. Follow the graph.','看清操作，也看清图如何学出来。')}</h2>
    <p class="section-intro">${t('Observation → robot operation → evidence update → remaining structure. The scene stays on the left; the recorded graph stays on the right.','观察 → 机械臂操作 → 证据更新 → 当前结构。左边始终是场景，右边始终是日志中的图。')}</p>
    <div class="featured-tabs" role="tablist" aria-label="${t('Featured scenes','重点演示')}"></div>
    <div class="featured-player" role="tabpanel"><p class="featured-question"></p>
      <video controls playsinline preload="metadata" aria-label="${t('Recorded robot operation and graph updates','机械臂操作与图更新的真实重放')}"></video>
      <div class="featured-seek" aria-label="${t('Video chapters','视频章节')}"></div>
      <p class="featured-caption" aria-live="off"></p>
      <div class="featured-links"><a class="featured-download" download>${t('Download video','下载视频')}</a><a class="featured-evidence" target="_blank" rel="noopener">${t('Timing & graph provenance','时间线与图来源')}</a></div>
    </div>
    <details class="technical-note"><summary>${t('What these recordings demonstrate','这些视频说明什么')}</summary><p>${t('These three recordings illustrate graph discovery, not a calibration ablation or new benchmark result. Original robot frames are recomposited with logged graph states; no experiments were rerun. Learned calibration was not used in these source runs. Dashed edges remain unresolved; the Balance load→ball response is not certified as a direct edge.','这三段展示图发现过程，不是校准消融或新的基准结果。画面来自原始机械臂重放，图来自对应日志，本次未重跑实验。这三组来源运行没有使用学习型校准。未定向边继续保留；平衡场景中的载荷→球响应不等于已确认直接因果边。')}</p></details>`;
  document.getElementById('discovery').before(section);
  const archiveHeading=document.getElementById('extra-gallery-heading');
  if(archiveHeading)archiveHeading.textContent=t('Original recordings & other scenes','原始记录与其他场景');
  const video=section.querySelector('video'),tabs=section.querySelector('.featured-tabs');
  const panel=section.querySelector('[role="tabpanel"]'),seek=section.querySelector('.featured-seek');
  let data=null,token=0;
  function update(){
    if(!data)return;
    const active=[...data.stages].reverse().find(s=>s.start<=video.currentTime+.025)||data.stages[0];
    section.querySelector('.featured-caption').textContent=(zh?active.zh:active.en);
    for(const b of seek.querySelectorAll('button'))b.setAttribute('aria-current',String(Number(b.dataset.start)<=video.currentTime+.025 && (!b.nextElementSibling || Number(b.nextElementSibling.dataset.start)>video.currentTime+.025)));
  }
  async function choose(row){
    const request=++token;video.pause();data=null;
    tabs.querySelectorAll('button').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.id===row[0]));b.tabIndex=b.dataset.id===row[0]?0:-1;});
    panel.setAttribute('aria-labelledby','featured-tab-'+row[0]);
    section.querySelector('.featured-question').textContent=t(row[3],row[4]);
    video.poster=`assets/featured-${row[0]}.jpg`;video.src=`assets/featured-${row[0]}.mp4`;video.load();
    section.querySelector('.featured-download').href=video.src;
    section.querySelector('.featured-evidence').href=`assets/featured-${row[0]}.json`;
    seek.replaceChildren();
    section.querySelector('.featured-caption').textContent=t('Press play to follow the recorded operations and graph updates.','点击播放，跟着实际操作看图的变化。');
    try{
      const res=await fetch(`assets/featured-${row[0]}.json`);if(!res.ok)throw new Error(res.status);
      const result=await res.json();if(request!==token)return;data=result;
      const selected=data.stages.filter(s=>/^(Question|Observational|Select|Direct|Graph-rule|Update|Result|Paired|Held)/.test(s.name));
      for(const s of selected){
        const b=document.createElement('button');b.type='button';b.dataset.start=String(s.start);
        const labels={'Question':['Question','问题'],'Observational skeleton':['Observe','观测骨架'],'Observational graph':['Observe','观测图'],'Paired reset':['Paired test','配对操作'],'Direct evidence':['Evidence','干预证据'],'Graph-rule propagation':['Propagate','图规则'],'Result':['Result','结果'],'Select 1':['Operation 1','操作一'],'Select 2':['Operation 2','操作二'],'Update 1':['Update 1','更新一'],'Update 2':['Update 2','更新二']};
        labels['Held readout']=['Held readout','夹持读数'];
        const label=labels[s.name]||[s.name,s.name];b.textContent=t(...label);b.onclick=()=>{video.currentTime=s.start;video.play().catch(()=>{});};seek.append(b);
      }
    }catch(e){section.querySelector('.featured-caption').textContent=t('Chapter data could not load; the video remains available.','章节数据暂时未加载，可直接播放视频。');}
  }
  for(const row of scenes){
    const b=document.createElement('button');b.type='button';b.id='featured-tab-'+row[0];b.dataset.id=row[0];b.setAttribute('role','tab');b.textContent=t(row[1],row[2]);b.onclick=()=>choose(row);
    b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=scenes.indexOf(row);const j=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;choose(scenes[j]);tabs.children[j].focus();};tabs.append(b);
  }
  video.addEventListener('timeupdate',update);video.addEventListener('play',()=>{for(const v of document.querySelectorAll('video'))if(v!==video)v.pause();update();});
  await choose(scenes[0]);
  for(const a of document.querySelectorAll('.resource-links a[href="#demos"]'))a.href='#featured-demos';
})();
