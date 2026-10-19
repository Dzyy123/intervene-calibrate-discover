"use strict";
(() => {
  const zh=window.ICD_L10N?.zh===true;
  const t=(en,cn)=>zh?cn:en;
  const movie=document.getElementById('discovery-video');
  const section=document.getElementById('discovery');
  const startPath=document.createElement('p');startPath.className='curated-path';
  for(const[href,en,cn]of [['#discovery','Follow one complete case','先看一个完整案例'],['#key-evidence','Inspect the calibration evidence','看校准证据'],['#queries','Inspect counterfactual outputs','看反事实输出']]){const a=document.createElement('a');a.href=href;a.textContent=t(en,cn);startPath.append(a);}
  document.querySelector('.resource-links').after(startPath);
  let source=null, preferFocus=true, currentKey='';
  const phases={
    question:{state:0,title:t('Begin with unresolved directions','先看方向未定的候选图'),action:t('Use the calibrated visual interface and observational data.','使用已校准的视觉接口与观察数据。'),evidence:t('The two neighboring pairs are visible, but their directions remain unresolved.','两个相邻节点对已进入候选图，但方向尚未确定。'),conclusion:t('An undirected edge is a question to test, not a discovered causal direction.','无向边表示待检验关系，不表示已经知道因果方向。')},
    calibration:{state:0,title:t('Calibrate before discovering the graph','先校准读数，再开始学图'),action:t('Use verified entry values to fit T; then freeze it.','用核验后的入口值拟合 T，随后冻结。'),evidence:t('Entry A readout NMSE: 0.00391 → 0.00124 on 128 ID images.','128 张 ID 图像中，入口 A 读数 NMSE：0.00391 → 0.00124。'),conclusion:t('This measures readout calibration, not graph accuracy or OOD performance.','这一步说明读数对齐，不等于证明图准确或 OOD 泛化。')},
    round1:{state:0,title:t('Test Entry A','对入口 A 做配对操作'),action:t('Hold Entry A inactive, reset, then trigger it.','先保持入口 A 未触发，复位后再触发它。'),evidence:t('The clip shows one context from a 32-pair batch. Watch Output A and the other channel.','画面是 32 对情境中的一对。观察输出 A，以及另一通道是否变化。'),conclusion:t('The graph stays unchanged until the complete batch is evaluated.','完整批次评估前，图保持不变。')},
    update1:{state:1,title:t('Update after the first batch','第一批证据到齐后更新图'),action:t('Evaluate all 32 paired contexts, totaling 64 graph calls.','评估全部 32 对情境，共 64 次图阶段调用。'),evidence:t('The recorded test accepts Entry A → Output A.','记录中的检验接受“入口 A → 输出 A”。'),conclusion:t('The second channel is still unresolved. No direction is filled in for display.','另一通道仍未定向，不为展示补画箭头。')},
    round2:{state:1,title:t('Test Entry B in a separate batch','用独立批次检验入口 B'),action:t('Reset the environment and compare inactive versus triggered Entry B.','复位环境，对比入口 B 未触发和触发两种操作。'),evidence:t('Observe Output B with the same paired-batch procedure.','按相同配对流程观察输出 B。'),conclusion:t('Keep the first accepted direction; test the remaining one.','保留第一条已有方向，检验剩余关系。')},
    update2:{state:2,title:t('Update after the second batch','第二批后接受剩余方向'),action:t('Evaluate the second complete batch of 32 pairs.','评估第二批完整的 32 对情境。'),evidence:t('The recorded test accepts Entry B → Output B.','记录中的检验接受“入口 B → 输出 B”。'),conclusion:t('Two separate directed channels remain in this recorded run.','这次运行得到两条彼此分开的有向通道。')},
    graph:{state:2,title:t('Freeze the discovered graph','冻结发现图'),action:t('Finish graph acquisition: 32 calibration + 128 graph calls.','完成图采集：校准 32 次，图阶段 128 次调用。'),evidence:t('Recorded result: Entry A → Output A; Entry B → Output B.','记录结果：入口 A → 输出 A；入口 B → 输出 B。'),conclusion:t('This is one static, single-seed example—not a claim of universal graph recovery.','这是单种子的静态示例，不代表普遍可恢复任意因果图。')},
    query:{state:2,title:t('Query the frozen model','用冻结模型执行替代操作查询'),action:t('Keep the factual context; change the target value and decode.','保留事实情境，改变目标值，传播后解码。'),evidence:t('The final panel compares actual decoder outputs with simulation ground truth.','末尾面板比较真实解码器输出与仿真真值。'),conclusion:t('The no-propagation column is a component control, not a published baseline.','“不传播”列是组件对照，不是已发表基线。')}
  };
  const guide=document.createElement('div');guide.className='case-guide';guide.id='case-guide';
  guide.innerHTML='<p class="case-kicker"></p><h3 id="case-title"></h3><div class="case-step-buttons" aria-label="'+t('Recorded case stages','案例阶段')+'"></div><dl class="case-explanation"><div><dt>'+t('Action','做什么')+'</dt><dd id="case-action"></dd></div><div><dt>'+t('Evidence','看到什么')+'</dt><dd id="case-evidence"></dd></div><div><dt>'+t('Meaning','能说明什么')+'</dt><dd id="case-conclusion"></dd></div></dl>';
  guide.querySelector('.case-kicker').textContent=t('One complete case · independent channels','一个完整例子 · 独立双通道');
  const shell=section.querySelector('.video-shell');shell.before(guide);
  const row=document.createElement('div');row.className='case-media';shell.before(row);row.append(shell);
  const graph=document.createElement('aside');graph.className='case-graph';graph.innerHTML='<h3>'+t('Recorded graph state','记录的图状态')+'</h3><div id="case-graph-drawing"></div><p>'+t('Gray dashed: unresolved. Blue arrow: accepted from intervention evidence.','灰色虚线：方向未定。蓝色箭头：干预证据支持的方向。')+'</p>';row.append(graph);
  const controls=document.createElement('div');controls.className='case-controls';controls.innerHTML='<button type="button" id="case-play">'+t('Play / pause','播放／暂停')+'</button><label class="case-seek-label">'+t('Playback','进度')+'<input id="case-seek" type="range" min="0" max="49.5" step="0.05" value="0"></label><button type="button" id="case-view"></button><a href="#queries" id="case-query-link">'+t('Inspect this model query','查看这个模型的查询结果')+'</a>';row.after(controls);
  const explanation=guide.querySelector('.case-explanation');controls.after(explanation);
  function seek(time){
    if(typeof activeScene!=='undefined'&&activeScene!=='parallel')chooseScene('parallel');
    const jump=()=>{movie.currentTime=time;sync();movie.play().catch(()=>{});};
    if(movie.readyState>=1)jump();else movie.addEventListener('loadedmetadata',jump,{once:true});
  }
  for(const [id,en,cn]of [['calibration','Calibrate','校准'],['round1','Operate A','操作 A'],['update1','Update graph','更新图'],['round2','Operate B','操作 B'],['query','Query','执行查询']]){
    const b=document.createElement('button');b.type='button';b.dataset.caseStep=id;b.textContent=t(en,cn);b.addEventListener('click',()=>{const ch=source?.chapters.find(c=>c.id===id);if(ch)seek(ch.time);});guide.querySelector('.case-step-buttons').append(b);
  }
  const svgNS='http://www.w3.org/2000/svg';
  function svgNode(tag,attrs,body){const e=document.createElementNS(svgNS,tag);for(const[k,v]of Object.entries(attrs))e.setAttribute(k,String(v));if(body)e.textContent=body;return e;}
  function drawGraph(g){
    const positions=[[80,55],[80,180],[300,55],[300,180]];
    const labels=[t('Entry A','入口 A'),t('Output A','输出 A'),t('Entry B','入口 B'),t('Output B','输出 B')];
    const svg=svgNode('svg',{viewBox:'0 0 380 255',role:'img','aria-label':t('Graph copied from recorded graph states','由原始记录重绘的图状态')});
    const defs=svgNode('defs',{}),marker=svgNode('marker',{id:'case-arrow',markerWidth:9,markerHeight:9,refX:7,refY:4,orient:'auto'});marker.append(svgNode('path',{d:'M0 0 L8 4 L0 8 Z',fill:'#356a83'}));defs.append(marker);svg.append(defs);
    const edges=(g.undirected||[]).map(([i,j])=>[i,j,false]);g.directed.forEach((r,i)=>r.forEach((v,j)=>{if(v>.5)edges.push([i,j,true]);}));
    for(const[i,j,directed]of edges){const[a,b]=positions[i],[c,d]=positions[j],len=Math.hypot(c-a,d-b),ux=(c-a)/len,uy=(d-b)/len;const line=svgNode('line',{x1:a+27*ux,y1:b+27*uy,x2:c-30*ux,y2:d-30*uy,stroke:directed?'#356a83':'#8c9498','stroke-width':3});if(directed)line.setAttribute('marker-end','url(#case-arrow)');else line.setAttribute('stroke-dasharray','7 6');svg.append(line);}
    positions.forEach(([x,y],i)=>{svg.append(svgNode('circle',{cx:x,cy:y,r:24,fill:'#fff',stroke:['#4757a3','#665299','#8f4f7d','#578787'][i],'stroke-width':2}));svg.append(svgNode('text',{x,y:y+7,'text-anchor':'middle','font-size':22,fill:'#253d40'},String(i+1)));svg.append(svgNode('text',{x,y:i%2===0?y-39:y+47,'text-anchor':'middle','font-size':19,fill:'#253d40'},labels[i]));});
    document.getElementById('case-graph-drawing').replaceChildren(svg);
  }
  function sync(){
    const on=source&&typeof activeScene!=='undefined'&&activeScene==='parallel';guide.hidden=!on;controls.hidden=!on;graph.hidden=!on;explanation.hidden=!on;row.classList.toggle('case-other',!on);section.classList.toggle('case-active',!!on);
    if(!on){shell.classList.remove('case-focus');movie.controls=true;currentKey='';return;}
    let chapter=source.chapters[0];for(const c of source.chapters)if(c.time<=movie.currentTime+.02)chapter=c;
    const p=phases[chapter.id]||phases.question;
    shell.classList.toggle('case-focus',preferFocus&&chapter.id!=='query');movie.controls=!shell.classList.contains('case-focus');
    document.getElementById('case-view').textContent=preferFocus?t('View full recording','查看完整画面'):t('Enlarge scene and graph','放大场景与图');
    document.getElementById('case-seek').value=movie.currentTime;
    document.getElementById('case-play').textContent=movie.paused?t('Play','播放'):t('Pause','暂停');
    if(currentKey===chapter.id)return;currentKey=chapter.id;
    for(const[k,v]of Object.entries({title:p.title,action:p.action,evidence:p.evidence,conclusion:p.conclusion}))document.getElementById('case-'+k).textContent=v;
    guide.querySelectorAll('[data-case-step]').forEach(b=>b.setAttribute('aria-current',String(b.dataset.caseStep===chapter.id)));
    drawGraph(source.graphs[p.state]);
  }
  document.getElementById('case-play').addEventListener('click',()=>movie.paused?movie.play().catch(()=>{}):movie.pause());
  document.getElementById('case-view').addEventListener('click',()=>{preferFocus=!preferFocus;sync();});
  document.getElementById('case-seek').addEventListener('input',e=>{movie.currentTime=Number(e.target.value);sync();});
  document.getElementById('case-query-link').addEventListener('click',()=>{const choice=document.getElementById('query-choice');const option=[...choice.options].find(o=>o.value==='parallel-1');if(option){choice.value=option.value;choice.dispatchEvent(new Event('change'));const context=document.getElementById('query-context');if(source&&source.query_context_index!==undefined)context.value=String(source.query_context_index);context.dispatchEvent(new Event('change'));}});
  ['timeupdate','loadedmetadata','play','pause','emptied'].forEach(e=>movie.addEventListener(e,sync));
  document.querySelectorAll('[data-scene]').forEach(b=>b.addEventListener('click',sync));
  guide.hidden=true;controls.hidden=true;graph.hidden=true;explanation.hidden=true;row.classList.add('case-other');
  fetch('assets/parallel-case-guide.json').then(r=>{if(!r.ok)throw new Error('Source-bound case unavailable');return r.json();}).then(data=>{source=data;sync();}).catch(()=>{guide.hidden=true;controls.hidden=true;graph.hidden=true;row.classList.add('case-other');movie.controls=true;});
  for(const[id,questionEn,questionZh,meaningEn,meaningZh]of [
    ['results','Can environment interventions recover direct edges and their directions?','环境干预能否恢复直接边及其方向？','Read SHD and AUPRC together; completed runs are not correct-graph counts.','结合 SHD 与 AUPRC 判断；流程跑完不等于图完全正确。'],
    ['prediction-results','Can the frozen model predict mean non-target states under the listed test conditions?','冻结模型能否预测各测试条件下的非目标平均状态？','This tests conditional mean consequences, not robot task success. A/B-only results do not establish an OOD axis.','这里检验条件平均后果，不是机械臂任务成功率；仅有 A/B 标签不证明 OOD 泛化。'],
    ['image-results','Does a latent intervention decode into the same-context outcome image?','修改潜变量后，能否解码出同一情境的后果图像？','RGB error reflects both reconstruction and consequence prediction, so it does not isolate calibration by itself.','RGB 误差同时受重构和后果预测影响，不能单独归因于校准。']
  ]){
    const area=document.createElement('div');area.className='experiment-reading';
    for(const[label,value]of [[t('Test','检验'),t(questionEn,questionZh)],[t('Interpretation','解读'),t(meaningEn,meaningZh)]]){const p=document.createElement('p'),b=document.createElement('strong');b.textContent=label+t(': ','：');p.append(b,document.createTextNode(value));area.append(p);}
    const root=document.getElementById(id),finding=root.querySelector('.result-finding');finding.before(area);
  }
  const picks=document.createElement('div');picks.className='curated-path';const pickLabel=document.createElement('p');pickLabel.textContent=t('Suggested viewing:','建议先看：');picks.append(pickLabel);
  for(const[id,en,cn]of [['balance_learning','Balance · candidate-graph updates','平衡：候选图更新'],['pnp_six_learning','Pick-and-place · graph-learning replay','抓取放置：图学习重放'],['tool_hook_pull','Tool use · mechanics preview','工具操作：物理预览']]){const b=document.createElement('button');b.type='button';b.textContent=t(en,cn);b.addEventListener('click',()=>{const filter=document.getElementById('demo-kind-filter');filter.value='all';filter.dispatchEvent(new Event('change'));document.querySelector('[data-extra="'+id+'"]')?.click();document.getElementById('extra-panel').scrollIntoView({block:'start'});});picks.append(b);}
  document.getElementById('extra-gallery-intro').after(picks);
})();
