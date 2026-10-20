"use strict";
(() => {
  const L=window.ICD_L10N||{zh:false,text:en=>en};const t=L.text;
  const video=document.getElementById('extra-video');video.muted=true;
  let records=[],active=null,timeline=[],visible=[];
  const kindLabels={candidate_graph:t('Graph-learning trace','图学习记录'),paired_operation:t('Paired mechanics','配对物理操作'),frozen_graph_check:t('Frozen-graph check','冻结图检查'),mechanical_preview:t('Tool-use preview','工具使用预览'),environment_preview:t('Environment overview','基础环境概览')};
  const notes={
    all_candidates:t('Initial candidate relations are hypotheses, not discovered edges.','初始候选关系是待检验假设，不是已发现的边。'),
    CI_order_0:t('Observational independence tests remove unsupported candidates.','观察独立性检验移除不受支持的候选关系。'),
    CI_order_1:t('Conditional-independence tests refine the observational skeleton.','条件独立性检验继续缩小观察骨架。'),
    observational_graph:t('The observational candidate graph still retains directional uncertainty.','观察候选图仍保留方向不确定性。'),
    round1_select:t('Choose a physically implemented target using unresolved-neighbor coverage.','根据未定向邻边的覆盖情况，选择物理上可实现的操作目标。'),
    round2_select:t('Select the next available target; do not assume all state variables can be directly set.','选择下一个可操作目标，不假设所有状态变量都能直接设置。'),
    round1_act:t('One recorded trial is shown. The graph update uses the complete intervention batch.','画面展示一个记录试验；图更新使用完整干预批次。'),
    round2_act:t('A separate recorded trial is replayed; this is not live graph inference.','重放另一场独立记录试验；这里不是实时图推断。'),
    round1_commit:t('Commit the actual batch-supported candidate directions; retain uncertainty.','提交批次证据支持的实际候选方向，保留不确定关系。'),
    round2_commit:t('Inspect the next logged graph update; missing relations are not inserted for display.','检查下一次记录的图更新，不为展示补画漏检关系。'),
    reset:t('Reset to a separate trial; this is not one uninterrupted physical trajectory.','复位到独立试验，不把它拼接成同一条连续物理轨迹。'),
    final:t('Final candidate output. This does not establish complete recovery of the underlying mechanism.','最终候选输出，不代表底层机制已被完整恢复。')
  };
  const chapterLabels={
    observational_graph:t('Observation graph','观察候选图'),round1_act:t('Operation 1','第一轮操作'),round1_commit:t('Update 1','第一次更新'),
    round2_act:t('Operation 2','第二轮操作'),round2_commit:t('Update 2','第二次更新'),final:t('Final candidates','最终候选图')
  };
  function copy(record){return record[L.zh?'zh':'en'];}
  function syncStage(){
    const root=document.getElementById('extra-chapters');
    if(!active)return;
    if(video.paused&&video.currentTime<0.03){
      root.dataset.current='preview';
      document.getElementById('extra-stage').textContent=t('Video preview. Press play or choose a chapter to follow the operations and graph updates.','当前是视频封面。点击播放或选择章节，再跟随实际操作与图更新过程。');
      return;
    }
    if(!timeline.length){document.getElementById('extra-stage').textContent=active.kind==='candidate_graph'?t('Recorded candidate-graph video. Chapter metadata is still loading or unavailable.','候选图录制视频。章节信息正在加载或暂不可用。'):active.kind==='paired_operation'?t('The paired clip shows simulator operations and outcomes, not model predictions.','配对片段展示仿真操作及结果，不是模型预测。'):active.kind==='frozen_graph_check'?t('Existing graph highlights support a qualitative physical check; they are not fresh discovery or fitted predictions.','已有图的高亮用于定性物理检查，不是新发现结果或拟合预测。'):active.kind==='mechanical_preview'?t('Mechanical preview only, without a learned graph or model prediction.','仅为物理操作预览，没有学到的图或模型预测。'):t('Saved illustrative environment material, not quantitative evidence for the paper.','已保存的环境示意素材，不是论文定量证据。');return;}
    let current=timeline[0];for(const row of timeline)if(row.start<=video.currentTime+.03)current=row;
    if(root.dataset.current===current.stage)return;root.dataset.current=current.stage;
    document.getElementById('extra-stage').textContent=window.ICD_DEMO_BRIEFS?.stage(active.id,current.stage)||notes[current.stage]||current.stage;
    for(const button of root.querySelectorAll('button'))button.setAttribute('aria-current',String(button.dataset.stage===current.stage));
  }
  function showChapters(record){
    timeline=record.timeline||[];const root=document.getElementById('extra-chapters');root.replaceChildren();delete root.dataset.current;
    for(const row of timeline){
      if(!chapterLabels[row.stage])continue;
      const button=document.createElement('button');button.type='button';button.dataset.stage=row.stage;
      const sec=Math.floor(row.start);button.textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0')+' '+chapterLabels[row.stage];
      button.addEventListener('click',()=>{video.currentTime=row.start;video.play().catch(()=>{});syncStage();});root.append(button);
    }
    syncStage();
  }
  function choose(id){
    const record=records.find(r=>r.id===id);if(!record)return;active=record;const c=copy(record);
    video.pause();video.src=window.ICD_MEDIA_URL('assets/'+record.video);video.poster='assets/'+record.poster;video.setAttribute('aria-label',c.title);video.load();
    for(const [key,value]of Object.entries({'extra-question':c.question,'extra-title':c.title,'extra-description':c.description,'extra-scope':c.scope,'extra-badge':c.badge}))document.getElementById(key).textContent=value;
    document.getElementById('extra-panel').setAttribute('aria-labelledby','extra-tab-'+id);document.getElementById('extra-download').href=window.ICD_MEDIA_URL('assets/'+record.video);
    window.ICD_DEMO_BRIEFS?.renderExtra(record);
    if(record.learned_calibration===false)document.getElementById('extra-badge').textContent=t('Structure exploration · no learned calibration','结构探索参考 · 未做学习型校准');
    const nodes=document.getElementById('extra-nodes');nodes.replaceChildren();
    for(const role of record.nodes){const span=document.createElement('span');span.textContent=role[L.zh?'zh':'en'];nodes.append(span);}
    for(const button of document.querySelectorAll('[data-extra]')){const selected=button.dataset.extra===id;button.setAttribute('aria-selected',String(selected));button.tabIndex=selected?0:-1;}
    showChapters(record);
  }
  function showList(){
    const root=document.getElementById('extra-list');root.replaceChildren();
    const filter=document.getElementById('demo-kind-filter').value;
    visible=records.filter(record=>filter==='all'||record.kind===filter);
    document.getElementById('library-count').textContent=visible.length+t(' clips shown · ',' 段可见 · ')+records.length+t(' supplementary clips total',' 段补充素材总计');
    visible.forEach((record,i)=>{
      const button=document.createElement('button');button.type='button';button.id='extra-tab-'+record.id;button.dataset.extra=record.id;button.setAttribute('role','tab');button.setAttribute('aria-controls','extra-panel');
      const image=document.createElement('img');image.src='assets/'+record.poster;image.alt='';image.loading='lazy';
      const text=document.createElement('span');const name=document.createElement('strong');name.textContent=copy(record).title;
      const duration=document.createElement('small');duration.textContent=(Number.isFinite(record.seconds)?Math.round(record.seconds)+t(' s · ',' 秒 · '):'')+kindLabels[record.kind];
      text.append(name,duration);button.append(image,text);button.addEventListener('click',()=>choose(record.id));
      button.addEventListener('keydown',event=>{let next=null;if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(i+1)%visible.length;if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(i+visible.length-1)%visible.length;if(event.key==='Home')next=0;if(event.key==='End')next=visible.length-1;if(next!==null){event.preventDefault();choose(visible[next].id);document.getElementById('extra-tab-'+visible[next].id).focus();}});
      root.append(button);
    });
    if(visible.length)choose(visible.some(record=>record.id===active?.id)?active.id:visible[0].id);
  }
  video.addEventListener('timeupdate',syncStage);
  video.addEventListener('play',syncStage);
  document.getElementById('extra-restart').addEventListener('click',()=>{video.currentTime=0;video.play().catch(()=>{});});
  document.getElementById('demo-kind-filter').addEventListener('change',showList);
  if(L.zh){
    const texts={
      '#more-demos .section-heading .eyebrow':'完整场景演示库', '#extra-gallery-heading':'按证据类型组织全部场景。',
      '#more-demos .section-heading>p':'图学习、冻结图检查、工具使用及基础环境。',
      '#extra-gallery-intro':'主报告按论文顺序展开；完整演示库集中收录额外材料。候选图、真实操作、物理预览和基础环境分别标注，不将它们混写为校准后的模型结果。',
      '.extra-question .eyebrow':'要回答的问题', '#extra-question':'机械臂改变载荷或目标后，哪些候选方向得到证据支持？',
      '#extra-title':'平衡模组 · 五节点图学习', '#extra-description':'从候选关系、观察检验和目标选择开始，展示两轮真实操作及其后的图更新。',
      '#extra-badge':'候选图 · 真实证据更新', '#extra-restart':'从头观看', '#extra-download':'下载这段视频', '#extra-scope-label':'这段视频能说明什么',
      '#extra-scope':'任务层候选图，不等于完整 DAG 恢复或 ACC 基准结果。',
      '#extra-gallery-note':'每类材料保留自己的验证范围。接触检查针对有限轨迹，基础环境素材未作为主表验证证据；配对仿真重放不是模型预测。原视频的语言与图示保留，网页说明提供中英文。',
      '#extra-manifest-link':'图学习与配对视频清单', '#extra-audit-link':'接触检查与图结构边界', '#extra-query-link':'查看模型查询', '#library-manifest-link':'完整库的媒体来源清单'
    };
    for(const [selector,value]of Object.entries(texts))document.querySelector(selector).textContent=value;
    document.getElementById('extra-list').setAttribute('aria-label','选择额外演示');
    document.getElementById('demo-kind-label').firstChild.textContent='类型';
    const names={all:'全部',candidate_graph:'图学习记录',frozen_graph_check:'冻结图下的操作',paired_operation:'配对物理操作',mechanical_preview:'工具使用预览',environment_preview:'基础环境概览'};
    for(const option of document.querySelectorAll('#demo-kind-filter option'))option.textContent=names[option.value];
  }
  document.getElementById('demo-kind-filter').value='candidate_graph';
  document.querySelector('.extra-gallery-layout').prepend(document.getElementById('extra-list'));
  document.querySelector('.extra-question').prepend(document.getElementById('extra-badge'));
  video.before(document.getElementById('extra-chapters'),document.getElementById('extra-stage'));
  const status=document.createElement('p');status.id='gallery-load-status';status.setAttribute('role','status');
  const retry=document.createElement('button');retry.type='button';retry.id='gallery-retry';retry.textContent=t('Retry gallery loading','重新加载演示库');retry.hidden=true;
  document.querySelector('.library-filter').after(status,retry);
  async function jsonAsset(file){
    const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
    try{const response=await fetch('assets/'+file,{signal:controller.signal});
      if(!response.ok)throw new Error(response.status===401||response.status===403?'authentication':'asset');
      if(!response.headers.get('content-type')?.includes('json'))throw new Error('authentication');
      return await response.json();
    }finally{clearTimeout(timer);}
  }
  async function loadGallery(){
    retry.hidden=true;status.textContent=t('Loading recorded scenes…','正在加载场景…');
    const bundles=await Promise.allSettled([jsonAsset('extra-demos.json'),jsonAsset('demo-library.json')]);
    const available=bundles.filter(b=>b.status==='fulfilled').flatMap(b=>b.value.videos||[]);
    if(!available.length){status.textContent=t('The scene list is unavailable. Check your site sign-in and retry; the default recorded video remains available.','场景列表暂不可用。请检查网站登录状态后重试；默认录制视频仍可播放。');retry.hidden=false;document.getElementById('more-demos').dataset.galleryState='unavailable';return;}
    records=[...new Map(available.map(record=>[record.id,record])).values()];showList();
    const manifests=await Promise.allSettled([jsonAsset('extra-source-manifest.json'),jsonAsset('demo-library-manifest.json')]);
    let incomplete=bundles.some(b=>b.status==='rejected')||manifests.some(b=>b.status==='rejected');
    for(const record of records){const binding=manifests.filter(m=>m.status==='fulfilled').flatMap(m=>m.value.videos||[]).find(row=>row.id===record.id);
      if(binding){if(Number.isFinite(binding.seconds))record.seconds=binding.seconds;else if(binding.stream){const [a,b]=binding.stream.r_frame_rate.split('/').map(Number);record.seconds=Number(binding.stream.nb_frames)/(a/b);}}
    }
    await Promise.all(records.filter(record=>record.checks).map(async record=>{try{record.timeline=(await jsonAsset(record.checks)).timeline;}catch{incomplete=true;}}));
    showList();document.getElementById('more-demos').dataset.galleryState=incomplete?'partial':'ready';
    status.textContent=incomplete?t('Some supplementary metadata did not load. Available scenes remain playable; retry to restore chapter details.','部分补充信息未加载，已有场景仍可播放；可重试恢复章节。'):'';retry.hidden=!incomplete;
  }
  let loading=false;
  async function runLoad(){
    if(loading)return;loading=true;retry.disabled=true;
    try{await loadGallery();}catch{
      status.textContent=t('Gallery metadata could not be read. Available recordings remain accessible; retry after checking sign-in.','无法读取部分场景信息。已有录制仍保留；检查登录状态后可重试。');
      retry.hidden=false;document.getElementById('more-demos').dataset.galleryState=records.length?'partial':'unavailable';
    }finally{loading=false;retry.disabled=false;}
  }
  retry.addEventListener('click',runLoad);runLoad();
})();
