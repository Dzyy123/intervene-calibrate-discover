"use strict";
(async()=>{
  const zh=new URLSearchParams(location.search).get('lang')==='zh',t=(en,cn)=>zh?cn:en;
  const version='20261030b';
  const scenes=[
    ['fork','Fork · 20 rounds · 2:30 · 1080p','分叉 · 20 轮 · 2分30秒 · 1080p','Start upright. Follow all 20 rounds in a faster, clearer full-process replay.','从竖直初态开始，用更快、更清晰的画面看完全部 20 轮。'],
    ['domino','Seven-node chain','七节点链式','Pusher → four dominoes → bell → light. Two rounds resolve the causal directions.','推杆 → 四块骨牌 → 铃 → 灯。两轮干预解析因果方向。'],
    ['balance','Balance · graph-learning trace · 31 s','平衡模组 · 图学习记录 · 31秒','Move the load, then the target. Follow the beam, ball and recorded graph updates.','先搬动载荷，再移动目标；观察横梁、小球和候选图怎样变化。']
  ];
  const section=document.createElement('section');section.id='featured-demos';section.className='container featured-demos';
  section.innerHTML=`<p class="eyebrow">${t('Three physical scenes · recorded graph discovery','三个物理场景 · 真实图发现记录')}</p>
    <h2>${t('See the action. Follow the graph.','看清操作，也看清图如何学出来。')}</h2>
    <p class="section-intro">${t('Start with the fork: watch repeated robot interventions revise an initially incorrect graph. Physical scene on the left; current learned hypothesis on the right.','先看分叉场景：机械臂通过反复干预，逐步修正最初有误的图。左边是物理场景，右边是当前学到的假设。')}</p>
    <div class="featured-tabs" role="tablist" aria-label="${t('Featured scenes','重点演示')}"></div>
    <div class="featured-player" id="featured-panel" role="tabpanel"><p class="featured-question"></p>
      <video controls playsinline muted preload="metadata" aria-label="${t('Recorded robot operation and graph updates','机械臂操作与图更新的真实重放')}"></video>
      <div class="featured-seek" aria-label="${t('Video chapters','视频章节')}"></div>
      <p class="featured-caption" aria-live="off"></p>
      <p class="featured-legend"><span>Gray dashed: unresolved</span><span>Blue: intervention evidence</span><span>Teal: graph rules</span></p>
      <div class="featured-links"><a class="featured-download" download>${t('Download film','下载视频')}</a><a class="featured-full" target="_blank" rel="noopener">${t('Full-length recording','完整记录')}</a><a class="featured-evidence" target="_blank" rel="noopener">${t('Timing & demo scope','时间线与演示说明')}</a></div>
    </div>
    <p class="featured-more"><a href="#more-demos">${t('More scenes: paired operations, Pick & Place, and the complete library →','更多场景：配对操作、抓取放置及完整演示库 →')}</a></p>
    <details class="technical-note"><summary>${t('What this recording demonstrates','这段视频说明什么')}</summary><p class="featured-scope"></p><p class="featured-edit-note"></p><p>${t('These are simulation demonstrations, not aggregate benchmark scores or a calibration-benefit comparison. The previously released demo package is linked below. The new presentation scripts, main research repository, training images and weights remain private.','这些是仿真演示，不代表基准汇总分数，也不是校准收益对照。下方链接指向此前已公开的演示包；本次新版制作脚本、主研究仓库、训练图像和权重继续保持私有。')}</p><a href="https://github.com/Dzyy123/icd-physical-demos" target="_blank" rel="noopener">${t('Previously released demo code & graph histories','此前已公开的演示代码与图学习记录')}</a></details>`;
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
    domino:t('Seven-node chain: an anchored RGB encoder and frozen command-affine calibration, with graph updates from 128 intervention images in two rounds. Calibration uses 280 separate images. In the F1 comparison, the pusher is active in both trials: one holds F1, the other directly activates F1. The final bell hold is a separate physical verification with the graph frozen. Bell contact activates a lamp relay; this is not sound-triggered lighting.','七节点链式场景使用节点已锚定的 RGB 编码器和冻结的命令仿射校准，通过两轮、共128张干预图像更新图；校准另使用280张图像。F1对照的两次试验中推杆均处于激活状态：一次夹持F1，另一次直接激活F1。最后的夹铃操作是在图冻结后的独立物理验证。撞铃接触激活灯的继电器，并非声音触发灯。'),
    fork:t('An exploratory extension with revisable graph scoring: 24 observation images, then 20 intervention batches of 4 matched pairs. The encoder and ACC remain frozen. Round 14 replaces F3→F2 with another incorrect hypothesis, F1→F2; round 18 removes it. The six-link graph remains correct in rounds 19–20. Reference colors are for viewers only, never supplied to learning. A failed F1 hold prompted a 5 mm inward grasp correction, followed by a full rerun of the eight additional rounds; learning rules and thresholds were unchanged.','这是一组使用可撤回图评分的探索性扩展：从24张观察图开始，再进行20轮、每轮4对干预。encoder与ACC保持冻结。第14轮撤回F3→F2，但暂时提出错误的F1→F2；第18轮将其撤回，第19–20轮保持六条正确边。参考图仅供观众判断颜色，不参与学习。一次F1夹持失败后，夹持位置内移5毫米，并从第12轮重新跑完新增8轮；学图规则与阈值不变。'),
    balance:t('A five-node task-level candidate graph from a frozen visual interface without learned calibration. The robot changes the load and then the target; graph updates use the complete recorded batches. Some relations remain missing or unresolved, and the load-to-ball response is not certified as a direct edge. Target position changes the alignment readout, not a force acting on the ball.','这是未加入学习型校准的冻结视觉接口得到的五节点任务层候选图。机械臂先改变载荷，再移动目标；图更新使用完整记录批次。部分关系仍漏检或未定向，载荷到小球的响应尚不能确认为直接边。目标位置改变的是匹配读数，不是作用于小球的力。'),
    pickplace:'Original Pick & Place recording without learned calibration. The grasp and lateral-position operations are discovery probes, not an evaluated placement policy.'
  };
  function update(){
    if(!data)return;
    const active=[...data.stages].reverse().find(s=>s.start<=video.currentTime+.025)||data.stages[0];
    section.querySelector('.featured-caption').textContent=(zh?(active.zh||active.en):active.en);
    const select=seek.querySelector('select');
    if(select&&document.activeElement!==select){
      const options=[...select.options].filter(o=>o.value!=='');
      const activeOption=options.filter(o=>Number(o.value)<=video.currentTime+.025).at(-1);
      select.value=activeOption?.value||'';
    }
  }
  async function choose(row){
    const request=++token;video.pause();data=null;
    const mediaKey={fork:'featured_fork',domino:'featured_chain',balance:'balance_learning'}[row[0]];
    const unified=window.ICD_UNIFORM_REGISTRY?.entries?.[mediaKey];
    tabs.querySelectorAll('button').forEach(b=>{b.setAttribute('aria-selected',String(b.dataset.id===row[0]));b.tabIndex=b.dataset.id===row[0]?0:-1;});
    panel.setAttribute('aria-labelledby','featured-tab-'+row[0]);
    panel.dataset.scene=row[0];
    section.querySelector('.featured-scope').textContent=notes[row[0]];
    section.querySelector('.featured-edit-note').textContent=row[0]==='fork'
      ?t('All 20 rounds and both operations of each shown pair are retained. This edit is approximately 1.5× faster than the previous film; displayed motion-rate labels reflect the new timing. Physical scenes were re-rendered at 2080×1170 and composed at 1920×1080, without AI-generated detail. All 40 shown trials start without a preset domino tilt. Rounds 5 and 7 use existing upright pairs selected after the run for presentation; images and readout captions correspond to those pairs. Every graph update still uses the original four-pair batch, including contexts not shown. Physical audits, model inputs and learning results are unchanged.','完整保留20轮及每对展示样本的两种操作。节奏约为上一版的1.5倍，动作倍速标记已同步更新。物理场景以2080×1170重新渲染，输出1920×1080，不使用AI补细节。展示的40次试验都没有预设骨牌倾斜。第5、7轮在运行结束后换用已采集的竖直初态样本，图片与读数说明对应这些样本。图更新仍使用原始完整4对数据，包括未展示的情境；物理记录、模型输入和学习结果不变。')
      :t('The concise chain film shortens explanation pauses and labels accelerated settling; contact motion and independent-trial resets are preserved. The final bell hold is a separate verification with the graph frozen.','链式精简片缩短解释停顿，并标明沉降加速；保留接触动作与独立试验复位。最后的夹铃操作是在图冻结后的独立验证。');
    section.querySelector('.featured-legend').innerHTML=row[0]==='fork'
      ?`<span class="legend-correct">${t('Green: correct vs reference','绿色：与参考图一致')}</span><span class="legend-incorrect">${t('Red: incorrect hypothesis','红色：错误假设')}</span><span class="legend-withdrawn">${t('Withdrawn: removed','撤回：箭头消失')}</span>`
      :`<span>${t('Gray dashed: unresolved','灰色虚线：方向未定')}</span><span>${t('Blue: intervention evidence','蓝色：干预证据')}</span><span>${t('Teal: graph rules','青绿：图规则')}</span>`;
    if(row[0]==='balance')section.querySelector('.featured-legend').innerHTML+=`<span>${t('Amber dashed: directness unverified','琥珀色虚线：直接性未确认')}</span>`;
    const address=new URL(location.href);address.searchParams.set('demo',row[0]);history.replaceState(null,'',address);
    section.querySelector('.featured-question').textContent=t(row[3],row[4]);
    const stem=row[0]==='fork'?'featured-fork-hq-fast-20261029':`featured-${row[0]}`;
    video.poster=unified?.poster||`assets/${stem}.${row[0]==='fork'?'png':'jpg'}?v=${version}`;video.src=unified?.video||`assets/${stem}.mp4?v=${version}`;video.load();
    video.setAttribute('aria-label',t(row[1],row[2]));
    if(unified&&row[0]==='domino')section.querySelector('.featured-edit-note').textContent=t('The same recorded operations and graph states, re-rendered at higher resolution. Phase-based speed labels are shown; model-input pixels and learning results remain unchanged.','沿用相同操作轨迹与图状态，重新渲染更高分辨率画面；按阶段标明播放速度，模型输入像素与学习结果不变。');
    if(row[0]==='balance')section.querySelector('.featured-edit-note').textContent=t('The existing Balance graph-learning record, presented in the same 1080p layout. Both operations, their independent reset and the recorded graph updates are retained; this placement adds no new experiment or claim.','沿用已有 Balance 图学习记录，使用相同的 1080p 版式。保留两轮操作、独立试验复位及记录中的图更新；此次只是调整展示位置，不新增实验或结论。');
    const download=section.querySelector('.featured-download');download.href=video.src;
    download.textContent=row[0]==='fork'?t('Download complete film','下载完整视频'):t('Download concise film','下载精简视频');
    const fullLink=section.querySelector('.featured-full');fullLink.hidden=row[0]==='balance';
    fullLink.href=row[0]==='fork'?'assets/featured-fork-upright-20261029.mp4':`assets/featured-${row[0]}-full.mp4`;
    fullLink.textContent=row[0]==='fork'?t('Slower version · 3:47','较慢版本 · 3分47秒'):t('Full-length recording','完整记录');
    if(row[0]==='balance')fullLink.removeAttribute('href');
    const metadata=unified?.metadata||`assets/${stem}.json?v=${version}`;
    section.querySelector('.featured-evidence').href=metadata;
    seek.replaceChildren();
    section.querySelector('.featured-caption').textContent=t('Press play to follow the recorded operations and graph updates.','点击播放，跟着实际操作看图的变化。');
    try{
      const res=await fetch(metadata);if(!res.ok)throw new Error(res.status);
      const result=await res.json();if(request!==token)return;data=result;
      const selected=data.chapters||data.stages.filter(s=>/^(Question|Pixel|Scene key|Observational|Select|Direct|Graph.rule|Graph update|Update|Result|Learned result|Paired|Held|Fixed|Push setup)/.test(s.name)||(s.name==='Reset'&&/Branch check|Extra physical verification/.test(s.en)));
      const chapterLabel=document.createElement('label');chapterLabel.className='chapter-label';
      const chapterText=document.createElement('span');chapterText.textContent=t('Jump to','跳转章节');
      const chapterSelect=document.createElement('select');chapterSelect.className='chapter-select';
      chapterSelect.id='featured-chapter-select';
      chapterSelect.setAttribute('aria-label',t('Jump to','跳转章节'));
      const placeholder=document.createElement('option');placeholder.value='';placeholder.textContent=t('Choose a chapter','选择一个章节');chapterSelect.append(placeholder);
      chapterLabel.append(chapterText,chapterSelect);seek.append(chapterLabel);
      for(const s of selected){
        const b=document.createElement('option');b.value=String(s.start);
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
        const originalStage=data.chapters?data.stages.find(x=>Math.abs(x.start-s.start)<.001):null;
        const label=data.chapters?(labels[originalStage?.name]||[s.en,s.zh||s.en]):resetLabel?[resetLabel,resetLabel]:labels[s.name]||[s.name,s.name];
        const seconds=Math.floor(s.start);b.textContent=Math.floor(seconds/60)+':'+String(seconds%60).padStart(2,'0')+' · '+t(...label);chapterSelect.append(b);
      }
      chapterSelect.addEventListener('change',()=>{
        if(chapterSelect.value==='')return;
        const time=Number(chapterSelect.value);
        const jump=()=>{if(request!==token)return;video.currentTime=time;video.play().catch(()=>{});};
        if(video.readyState>=1)jump();else video.addEventListener('loadedmetadata',jump,{once:true});
      });
    }catch(e){section.querySelector('.featured-caption').textContent=t('Chapter data could not load; the video remains available.','章节数据暂时未加载，可直接播放视频。');}
  }
  for(const row of scenes){
    const b=document.createElement('button');b.type='button';b.id='featured-tab-'+row[0];b.dataset.id=row[0];b.setAttribute('role','tab');b.setAttribute('aria-controls','featured-panel');
    b.setAttribute('aria-label',t(row[1],row[2]));b.title=t(row[1],row[2]);
    b.textContent=row[0]==='fork'?t('Multiround fork','多轮分叉'):row[0]==='balance'?t('Balance','平衡模组'):t('Domino chain','链式多米诺');b.onclick=()=>choose(row);
    b.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const i=scenes.indexOf(row),n=scenes.length;const j=e.key==='Home'?0:e.key==='End'?n-1:(i+(e.key==='ArrowRight'?1:n-1))%n;choose(scenes[j]);tabs.children[j].focus();};tabs.append(b);
  }
  video.addEventListener('timeupdate',update);video.addEventListener('play',()=>{for(const v of document.querySelectorAll('video'))if(v!==video)v.pause();update();});
  for(const a of document.querySelectorAll('.resource-links a[href="#demos"]'))a.href='#featured-demos';
  if(location.hash==='#featured-demos')section.scrollIntoView({block:'start'});
  await choose(scenes.find(row=>row[0]===new URLSearchParams(location.search).get('demo'))||scenes[0]);
})();
