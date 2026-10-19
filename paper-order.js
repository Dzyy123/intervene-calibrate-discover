"use strict";
(() => {
  const L=window.ICD_L10N||{zh:false,text:en=>en,label:en=>en};const t=L.text;
  if(L.zh){
    const content={
      '#related>.eyebrow':'02 · 相关工作', '#related-heading':'连接表征、实验与操作值。',
      '#related .setting-grid article:nth-child(1) h3':'视觉因果表征', '#related .setting-grid article:nth-child(1) p':'论文讨论 CausalVAE、CITRIS 系列与 ILCM 如何从视觉信息学习因果变量、执行潜变量查询。',
      '#related .setting-grid article:nth-child(2) h3':'主动实验', '#related .setting-grid article:nth-child(2) p':'Causal Curiosity、可控因素学习和主动实验设计，为通过交互获得结构证据提供背景。',
      '#related .setting-grid article:nth-child(3) h3':'干预值对齐', '#related .setting-grid article:nth-child(3) p':'本文专注已知节点视觉读数与可核验操作值之间的共享数值接口，而不是对这些不同研究设定进行统一排名。',
      '#related-paper-link':'论文中的相关工作与分类条件',
      '#problem-notation':'符号：图像 x、初始读数 z = E(x)、可逆校准 T、估计图 Ĝ、目标与数值 (j, u)。节点含义已锚定；直接父节点集合与机制需要学习。校准和图采集均计入干预预算。',
      '#experiment-setup>.eyebrow':'5.1 · 实验设置', '#setup-heading':'三项任务，分别说明计分与访问权限。',
      '#setup-copy':'论文报告八个基准列。图结构、总体后果和图像指标回答不同问题；论文结果与额外场景演示分开展示。',
      '#setup-scope-title':'比较前先看协议', '#setup-scope-copy':'预测覆盖已执行查询，排除被阻止查询。ID／幅值变化与测试集 A/B 不能互换。物理多米诺 ILCM 和给定图 ICM-VAE 按原范围保留参考标签；流程完成数不等于图完全正确数。',
      '#prediction-results .eyebrow':'5.4 · 非目标状态后果', '#image-results .eyebrow':'5.5 · 同情境图像查询',
      '#conclusion>.eyebrow':'06 · 结论', '#conclusion-heading':'通过后果，检验操作值接口。',
      '#conclusion-copy':'报告围绕三个相连的问题：干预提供结构证据，校准连接视觉读数与操作值，再用冻结机制和解码检验查询。收益具有条件性；仿射优势、未定向图与负迁移均保留在证据中。'
    };
    for(const [selector,value]of Object.entries(content)){const element=document.querySelector(selector);if(element)element.textContent=value;}
    for(const link of document.querySelectorAll('.task-paper-link'))link.textContent='论文表格与评测协议';
  }
  function drawTask(task,prefix,data){
    const copy=paperTaskCopy[task];
    for(const key of ['caption','finding','scope'])document.getElementById(prefix+'-'+key).textContent=copy[key];
    const methods=task==='consequences'?['ours','causalvae','ilcm','no_graph']:['ours','causalvae','ilcm','icm_vae','no_graph'];
    const head=document.getElementById(prefix+'-head');head.replaceChildren();const hr=document.createElement('tr');
    [t('Benchmark','基准'),...methods.map(m=>methodNames[m])].forEach((label,i)=>{const th=document.createElement('th');th.scope='col';th.textContent=label;if(i===1)th.className='ours-cell';hr.append(th);});head.append(hr);
    const body=document.getElementById(prefix+'-body');body.replaceChildren();
    for(const dataset of data.datasets){
      const values=data[task][dataset.id];const tr=document.createElement('tr');const name=document.createElement('th');name.scope='row';name.textContent=L.label(dataset.name)+(task==='consequences'&&dataset.ab_only?' †':'');
      if(task==='consequences'){const note=document.createElement('span');note.className='secondary-number';note.textContent=L.label(dataset.test_groups);name.append(note);}tr.append(name);
      const eligible=methods.map(m=>values[m]).filter(c=>c&&!c.reference_only);
      for(const m of methods){
        const td=document.createElement('td');if(m==='ours')td.classList.add('ours-cell');const cell=values[m];if(!cell){td.textContent='—';tr.append(td);continue;}
        if(cell.reference_only)td.classList.add('reference-cell');const count=task==='images'?1:2;
        for(let i=0;i<count;i++){if(i)td.append(document.createTextNode(' / '));const best=Math.min(...eligible.map(c=>c.values[i]));putNumber(td,cell.display[i],!cell.reference_only&&cell.values[i]===best);}
        if(task==='consequences'){const ratio=document.createElement('span');ratio.className='secondary-number';ratio.textContent='r = '+labelNumber(cell.display[2]);td.append(ratio);}
        if(cell.reference_only)td.append(document.createTextNode(m==='ilcm'?' †':t(' (ref.)','（参考）')));tr.append(td);
      }body.append(tr);
    }
    document.getElementById(prefix+'-table').closest('.table-scroll').setAttribute('aria-label',copy.caption);
  }
  fetch('assets/paper-results.json').then(r=>{if(!r.ok)throw new Error('Task tables unavailable');return r.json();}).then(data=>{
    drawTask('consequences','prediction-results',data);drawTask('images','image-results',data);
  }).catch(()=>{for(const id of ['prediction-results','image-results'])document.getElementById(id+'-finding').textContent=t('Table data could not load; use the linked paper.','表格未能加载，请查看链接中的论文。');});
})();
