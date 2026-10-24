"use strict";
(async()=>{
  const zh=false,t=(en,cn)=>en;
  const version='20261025a';
  const scenes=[
    ['domino','Seven-node chain','七节点链式','Pusher → four dominoes → bell → light. Follow gripper interventions and two rounds of graph discovery from calibrated image readings.','推杆 → 四块骨牌 → 铃 → 灯。通过夹爪干预与校准图像读数，展示两轮图发现。'],
    ['fork','Seven-node fork','七节点分叉','One pusher, two branches. Watch six unresolved links become directed, then hold each branch separately to check which consequences stop.','一个推杆、两条支路。先看六条未定向关系如何定向，再分别夹住两侧，检查哪些后果被阻断。'],
    ['balance','Balance','平衡','Move the load, then the target. Watch which directions change—and which stay uncertain.','先搬动载荷、再移动目标。看哪些方向获得证据，哪些仍然不确定。'],
    ['pickplace','Pick & place','抓取放置','Compare closed and open grasps in the same context, then probe lateral position. These are discovery probes, not a placement policy.','同一情境下比较闭合与张开，再探测横向位置。这是学图操作，不是放置策略。']
  ];
  const section=document.createElement('section');section.id='featured-demos';section.className='container featured-demos';
  section.innerHTML=`<p class="eyebrow">${t('Four scenes · one visual language','四个场景 · 一条清楚的叙事')}</p>
    <h2>${t('See the action. Follow the graph.','看清操作，也看清图如何学出来。')}</h2>
    <p class="section-intro">${t('Observation → robot operation → evidence update → remaining structure. The scene stays on the left; the recorded graph stays on the right.','观察 → 机械臂操作 → 证据更新 → 当前结构。左边始终是场景，右边始终是日志中的图。')}</p>
    <div class="featured-tabs" role="tablist" aria-label="${t('Featured scenes','重点演示')}"></div>
    <div class="featured-player" id="featured-panel" role="tabpanel"><p class="featured-question"></p>
      <video controls playsinline preload="metadata" aria-label="${t('Recorded robot operation and graph updates','机械臂操作与图更新的真实重放')}"></video>
      <div class="featured-seek" aria-label="${t('Video chapters','视频章节')}"></div>
      <p class="featured-caption" aria-live="off"></p>
      <div class="featured-links"><a class="featured-download" download>${t('Download video','下载视频')}</a><a class="featured-evidence" target="_blank" rel="noopener">${t('Timing & graph provenance','时间线与图来源')}</a></div>
    </div>
    <details class="technical-note"><summary>${t('What this recording demonstrates','这段视频说明什么')}</summary><p class="featured-scope"></p><p>These films are simulation demonstrations, not the paper’s aggregate benchmark results or a calibration-benefit comparison. Dashed edges remain unresolved. The earlier four-node film is preserved in the supplementary library. Research code, training data and weights remain private.</p></details>`;
  document.getElementById('discovery').before(section);
  const archiveHeading=document.getElementById('extra-gallery-heading');
  if(archiveHeading)archiveHeading.textContent=t('Original recordings & other scenes','原始记录与其他场景');
  const video=section.querySelector('video'),tabs=section.querySelector('.featured-tabs');
  const panel=section.querySelector('[role="tabpanel"]'),seek=section.querySelector('.featured-seek');
  let data=null,token=0;
  const notes={
    domino:'Seven-node chain: an anchored RGB encoder and frozen command-affine calibration, with graph updates from 128 intervention images in two rounds. Calibration uses 280 separate images. The final bell hold is a separate physical verification with the graph frozen.',
    fork:'Seven-node fork: a newly trained anchored RGB encoder and frozen command-affine calibration. 512 observations give six unresolved links; one 64-image pusher intervention batch supports two orientations, followed by four graph-rule orientations. Calibration uses 280 separate images. The subsequent near-branch, far-branch and bell holds are separate physical verifications; the graph stays frozen. Raw and calibrated binary readout accuracy are both 100% on 112 held-out images; continuous normalized error changes from 0.0130 to 0.0272, so this film does not establish a calibration improvement.',
    balance:'Original Balance recording without learned calibration. Some directions remain unresolved; the load→ball response is not certified as a direct edge.',
    pickplace:'Original Pick & Place recording without learned calibration. The grasp and lateral-position operations are discovery probes, not an evaluated placement policy.'
  };
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
    section.querySelector('.featured-scope').textContent=notes[row[0]];
    const address=new URL(location.href);address.searchParams.set('demo',row[0]);history.replaceState(null,'',address);
    section.querySelector('.featured-question').textContent=t(row[3],row[4]);
    video.poster=`assets/featured-${row[0]}.jpg?v=${version}`;video.src=`assets/featured-${row[0]}.mp4?v=${version}`;video.load();
    section.querySelector('.featured-download').href=video.src;
    section.querySelector('.featured-evidence').href=`assets/featured-${row[0]}.json?v=${version}`;
    seek.replaceChildren();
    section.querySelector('.featured-caption').textContent=t('Press play to follow the recorded operations and graph updates.','点击播放，跟着实际操作看图的变化。');
    try{
      const res=await fetch(`assets/featured-${row[0]}.json?v=${version}`);if(!res.ok)throw new Error(res.status);
      const result=await res.json();if(request!==token)return;data=result;
      const selected=data.stages.filter(s=>/^(Question|Pixel|Scene key|Observational|Select|Direct|Graph.rule|Graph update|Update|Result|Learned result|Near branch verification|Far branch verification|Bell verification|Paired|Held|Fixed|Push setup)/.test(s.name));
      for(const s of selected){
        const b=document.createElement('button');b.type='button';b.dataset.start=String(s.start);
        const labels={'Question':['Question','问题'],'Observational skeleton':['Observe','观测骨架'],'Observational graph':['Observe','观测图'],'Paired reset':['Paired test','配对操作'],'Direct evidence':['Evidence','干预证据'],'Graph-rule propagation':['Propagate','图规则'],'Result':['Result','结果'],'Select 1':['Operation 1','操作一'],'Select 2':['Operation 2','操作二'],'Update 1':['Update 1','更新一'],'Update 2':['Update 2','更新二']};
        labels['Held readout']=['Held readout','夹持读数'];
        labels['Paired evidence']=['Compare readouts','配对读数'];
        labels['Scene key']=['Scene key','场景说明'];
        labels['Pixel readout and calibration']=['Readouts & ACC','视觉读数与校准'];
        labels['Near branch verification']=['Near-branch check','近侧支路验证'];
        labels['Far branch verification']=['Far-branch check','远侧支路验证'];
        labels['Fixed control 1']=['Control F2','第二块固定对照'];
        labels['Fixed control 2']=['Control F1','第一块固定对照'];
        labels['Push setup 1']=['Push F2','推第二块'];
        labels['Push setup 2']=['Push F1','推第一块'];
        const label=labels[s.name]||[s.name,s.name];b.textContent=t(...label);b.onclick=()=>{video.currentTime=s.start;video.play().catch(()=>{});};seek.append(b);
      }
    }catch(e){section.querySelector('.featured-caption').textContent=t('Chapter data could not load; the video remains available.','章节数据暂时未加载，可直接播放视频。');}
  }
  for(const row of scenes){
    const b=document.createElement('button');b.type='button';b.id='featured-tab-'+row[0];b.dataset.id=row[0];b.setAttribute('role','tab');b.setAttribute('aria-controls','featured-panel');b.textContent=t(row[1],row[2]);b.onclick=()=>choose(row);
    b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=scenes.indexOf(row),n=scenes.length;const j=e.key==='Home'?0:e.key==='End'?n-1:(i+(e.key==='ArrowRight'?1:n-1))%n;choose(scenes[j]);tabs.children[j].focus();};tabs.append(b);
  }
  video.addEventListener('timeupdate',update);video.addEventListener('play',()=>{for(const v of document.querySelectorAll('video'))if(v!==video)v.pause();update();});
  await choose(scenes.find(row=>row[0]===new URLSearchParams(location.search).get('demo'))||scenes[0]);
  for(const a of document.querySelectorAll('.resource-links a[href="#demos"]'))a.href='#featured-demos';
  if(location.hash==='#featured-demos')section.scrollIntoView({block:'start'});
})();
