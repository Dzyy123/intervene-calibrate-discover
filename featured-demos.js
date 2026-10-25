"use strict";
(async()=>{
  const zh=new URLSearchParams(location.search).get('lang')==='zh',t=(en,cn)=>zh?cn:en;
  const version='20261025c';
  const scenes=[
    ['fork','Fork · learning from mistakes · 65 s','分叉 · 从错误假设到正确图 · 65 秒','Wrong hypotheses are tested, withdrawn and corrected — 20 rounds in 65 seconds.','错误假设经过干预、撤回和修正：用 65 秒看完 20 轮学习过程。'],
    ['domino','Seven-node chain','七节点链式','Pusher → four dominoes → bell → light. Two rounds resolve the causal directions.','推杆 → 四块骨牌 → 铃 → 灯。两轮干预解析因果方向。']
  ];
  const section=document.createElement('section');section.id='featured-demos';section.className='container featured-demos';
  section.innerHTML=`<p class="eyebrow">${t('Two physical scenes · recorded graph discovery','两个物理场景 · 真实图发现记录')}</p>
    <h2>${t('See the action. Follow the graph.','看清操作，也看清图如何学出来。')}</h2>
    <p class="section-intro">${t('Start with the fork: watch repeated robot interventions revise an initially incorrect graph. Physical scene on the left; current learned hypothesis on the right.','先看分叉场景：机械臂通过反复干预，逐步修正最初有误的图。左边是物理场景，右边是当前学到的假设。')}</p>
    <div class="featured-tabs" role="tablist" aria-label="${t('Featured scenes','重点演示')}"></div>
    <div class="featured-player" id="featured-panel" role="tabpanel"><p class="featured-question"></p>
      <video controls playsinline preload="metadata" aria-label="${t('Recorded robot operation and graph updates','机械臂操作与图更新的真实重放')}"></video>
      <div class="featured-seek" aria-label="${t('Video chapters','视频章节')}"></div>
      <p class="featured-caption" aria-live="off"></p>
      <p class="featured-legend"><span>Gray dashed: unresolved</span><span>Blue: intervention evidence</span><span>Teal: graph rules</span></p>
      <div class="featured-links"><a class="featured-download" download>${t('Download concise film','下载精简视频')}</a><a class="featured-full" target="_blank" rel="noopener">${t('Full-length recording','完整记录')}</a><a class="featured-evidence" target="_blank" rel="noopener">${t('Timing & demo scope','时间线与演示说明')}</a></div>
    </div>
    <p class="featured-more"><a href="#more-demos">${t('More scenes: Balance, Pick & Place, and the complete library →','更多场景：平衡、抓取放置及完整演示库 →')}</a></p>
    <details class="technical-note"><summary>${t('What this recording demonstrates','这段视频说明什么')}</summary><p class="featured-scope"></p><p class="featured-edit-note"></p><p>${t('These are simulation demonstrations, not the paper’s aggregate benchmark scores or a calibration-benefit comparison. Research code, training data and weights remain private.','这些是仿真演示，不代表论文基准的汇总分数，也不是校准收益的对照实验。研究代码、训练数据和权重继续保持私有。')}</p></details>`;
  document.getElementById('motivation').before(section);
  // Prioritize the approved physical films without removing older evidence.
  document.querySelector('.report-lead-figure')?.remove();
  document.querySelector('.intro>.curated-path')?.remove();
  document.querySelector('.skip-link').href='#featured-demos';
  const demoNav=document.querySelector('.site-header nav a[href="#demos"]');
  if(demoNav)demoNav.href='#featured-demos';
  const archiveHeading=document.getElementById('extra-gallery-heading');
  if(archiveHeading)archiveHeading.textContent=t('Original recordings & other scenes','原始记录与其他场景');
  const video=section.querySelector('video'),tabs=section.querySelector('.featured-tabs');
  const panel=section.querySelector('[role="tabpanel"]'),seek=section.querySelector('.featured-seek');
  let data=null,token=0;
  const notes={
    domino:'Seven-node chain: an anchored RGB encoder and frozen command-affine calibration, with graph updates from 128 intervention images in two rounds. Calibration uses 280 separate images. In the F1 comparison, the pusher is active in both trials: one holds F1, the other directly activates F1. The final bell hold is a separate physical verification with the graph frozen. Bell contact activates a lamp relay; this is not sound-triggered lighting.',
    fork:t('An exploratory extension with revisable graph scoring: 24 observation images, then 20 intervention batches of 4 matched pairs. The encoder and ACC remain frozen. Round 14 replaces F3→F2 with another incorrect hypothesis, F1→F2; round 18 removes it. The six-link graph remains correct in rounds 19–20. Reference colors are for viewers only, never supplied to learning. A failed F1 hold prompted a 5 mm inward grasp correction, followed by a full rerun of the eight additional rounds; learning rules and thresholds were unchanged.','这是一组使用可撤回图评分的探索性扩展：从24张观察图开始，再进行20轮、每轮4对干预。encoder与ACC保持冻结。第14轮撤回F3→F2，但暂时提出错误的F1→F2；第18轮将其撤回，第19–20轮保持六条正确边。参考图仅供观众判断颜色，不参与学习。一次F1夹持失败后，夹持位置内移5毫米，并从第12轮重新跑完新增8轮；学图规则与阈值不变。'),
    balance:'Original Balance recording without learned calibration. Some directions remain unresolved; the load→ball response is not certified as a direct edge.',
    pickplace:'Original Pick & Place recording without learned calibration. The grasp and lateral-position operations are discovery probes, not an evaluated placement policy.'
  };
  function update(){
    if(!data)return;
    const active=[...data.stages].reverse().find(s=>s.start<=video.currentTime+.025)||data.stages[0];
    section.querySelector('.featured-caption').textContent=(zh?(active.zh||active.en):active.en);
    for(const b of seek.querySelectorAll('button'))b.setAttribute('aria-current',String(Number(b.dataset.start)<=video.currentTime+.025 && (!b.nextElementSibling || Number(b.nextElementSibling.dataset.start)>video.currentTime+.025)));
  }
  async function choose(row){
    const request=++token;video.pause();data=null;
    tabs.querySelectorAll('button').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.id===row[0]));b.tabIndex=b.dataset.id===row[0]?0:-1;});
    panel.setAttribute('aria-labelledby','featured-tab-'+row[0]);
    panel.dataset.scene=row[0];
    section.querySelector('.featured-scope').textContent=notes[row[0]];
    section.querySelector('.featured-edit-note').textContent=row[0]==='fork'
      ?t('The 65-second cut retains every structural revision, including setbacks. Repetitive trials and motion are visibly condensed; resets stay explicit. Each displayed round shows one setup-selected pair, while its update uses all four pairs. This is one recorded run, not a guarantee of convergence.','65秒精简版保留全部结构修订，包括中途的错误。重复试验与部分动作已明确加速或压缩，复位仍单独显示。每个展示轮次选取一对代表操作，但图更新使用完整4对数据。这是一条实测轨迹，并不保证所有场景都能收敛。')
      :t('The concise chain film shortens explanation pauses and labels accelerated settling; contact motion and independent-trial resets are preserved. The final bell hold is a separate verification with the graph frozen.','链式精简片缩短解释停顿，并标明沉降加速；保留接触动作与独立试验复位。最后的夹铃操作是在图冻结后的独立验证。');
    section.querySelector('.featured-legend').innerHTML=row[0]==='fork'
      ?`<span class="legend-correct">${t('Green: correct vs reference','绿色：与参考图一致')}</span><span class="legend-incorrect">${t('Red: incorrect hypothesis','红色：错误假设')}</span><span class="legend-withdrawn">${t('Withdrawn: removed','撤回：箭头消失')}</span>`
      :`<span>${t('Gray dashed: unresolved','灰色虚线：方向未定')}</span><span>${t('Blue: intervention evidence','蓝色：干预证据')}</span><span>${t('Teal: graph rules','青绿：图规则')}</span>`;
    const address=new URL(location.href);address.searchParams.set('demo',row[0]);history.replaceState(null,'',address);
    section.querySelector('.featured-question').textContent=t(row[3],row[4]);
    video.poster=`assets/featured-${row[0]}.jpg?v=${version}`;video.src=`assets/featured-${row[0]}.mp4?v=${version}`;video.load();
    section.querySelector('.featured-download').href=video.src;
    const fullLink=section.querySelector('.featured-full');fullLink.hidden=row[0]==='fork';
    if(row[0]==='fork')fullLink.removeAttribute('href');else fullLink.href=`assets/featured-${row[0]}-full.mp4`;
    section.querySelector('.featured-evidence').href=`assets/featured-${row[0]}.json?v=${version}`;
    seek.replaceChildren();
    section.querySelector('.featured-caption').textContent=t('Press play to follow the recorded operations and graph updates.','点击播放，跟着实际操作看图的变化。');
    try{
      const res=await fetch(`assets/featured-${row[0]}.json?v=${version}`);if(!res.ok)throw new Error(res.status);
      const result=await res.json();if(request!==token)return;data=result;
      const selected=data.chapters||data.stages.filter(s=>/^(Question|Pixel|Scene key|Observational|Select|Direct|Graph.rule|Graph update|Update|Result|Learned result|Paired|Held|Fixed|Push setup)/.test(s.name)||(s.name==='Reset'&&/Branch check|Extra physical verification/.test(s.en)));
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
        const resetLabel=s.name==='Reset'?(s.en.includes('near lane')?'Near-branch check':s.en.includes('far lane')?'Far-branch check':'Bell check'):null;
        const label=data.chapters?[s.en,s.zh||s.en]:resetLabel?[resetLabel,resetLabel]:labels[s.name]||[s.name,s.name];b.textContent=t(...label);b.onclick=()=>{video.currentTime=s.start;video.play().catch(()=>{});};seek.append(b);
      }
    }catch(e){section.querySelector('.featured-caption').textContent=t('Chapter data could not load; the video remains available.','章节数据暂时未加载，可直接播放视频。');}
  }
  for(const row of scenes){
    const b=document.createElement('button');b.type='button';b.id='featured-tab-'+row[0];b.dataset.id=row[0];b.setAttribute('role','tab');b.setAttribute('aria-controls','featured-panel');b.textContent=t(row[1],row[2]);b.onclick=()=>choose(row);
    b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=scenes.indexOf(row),n=scenes.length;const j=e.key==='Home'?0:e.key==='End'?n-1:(i+(e.key==='ArrowRight'?1:n-1))%n;choose(scenes[j]);tabs.children[j].focus();};tabs.append(b);
  }
  video.addEventListener('timeupdate',update);video.addEventListener('play',()=>{for(const v of document.querySelectorAll('video'))if(v!==video)v.pause();update();});
  for(const a of document.querySelectorAll('.resource-links a[href="#demos"]'))a.href='#featured-demos';
  if(location.hash==='#featured-demos')section.scrollIntoView({block:'start'});
  await choose(scenes.find(row=>row[0]===new URLSearchParams(location.search).get('demo'))||scenes[0]);
})();
