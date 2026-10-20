"use strict";
(() => {
  const zh=window.ICD_L10N?.zh===true;
  const t=(en,cn)=>zh?cn:en;
  const main=document.getElementById('top');
  // Keep all recorded demos and event handlers; separate them from paper evidence.
  const order=['motivation','related','problem','method','experiment-setup',
    'results','orientation-evidence','key-evidence','prediction-results','image-results',
    'conclusion','demos','discovery','calibration','queries','more-demos','evidence'];
  for(const id of order){const node=document.getElementById(id);if(node)main.append(node);}
  const set=(selector,en,cn)=>{const node=document.querySelector(selector);if(node)node.textContent=t(en,cn);};
  set('.lead',
    'Align visual readouts with verified intervention values. Use the calibrated responses to discover causal directions, then predict state and image consequences in the same coordinates.',
    '让视觉读数对齐真实干预达到的值，再用校准后的响应发现因果方向，并在同一套坐标中预测状态和图像后果。');
  set('.method-steps article:nth-child(1) > p',
    'Pair each target’s image readout with its verified attained value. With encoder and decoder frozen, fit an invertible, dimension-wise map T using fixed round-robin interventions. Visual observations and target settings then share numerical units; T is frozen before graph discovery.',
    '将目标变量的图像读数与实际达到的核验值配对。冻结编码器和解码器，用固定轮转干预拟合逐维可逆映射 T，让视觉观测与目标设定使用同一套数值单位；开始学图前冻结 T。');
  set('#results .section-heading > p',
    'Results reported in the paper; supplementary demonstrations are shown after the conclusion.',
    '这里展示论文结果；补充演示统一放在结论之后。');
  set('#key-evidence-heading','Intervention-value calibration and effects','干预值校准与效应');
  set('#demos > h2','Supplementary demonstrations','补充场景演示');
  set('#demos > .section-intro',
    'Explore the full recorded workflow, calibration readouts and paired image queries, followed by the complete scene library. These examples illustrate the method and remain separate from the benchmark results above.',
    '先看完整图学习过程、校准读数与配对图像查询，再浏览全部场景库。这些示例用于理解方法，与前面的基准实验结果分开展示。');
  const nav=document.querySelector('.site-header nav a[href="#more-demos"]');
  if(nav)nav.href='#demos';
  const route=document.querySelector('.curated-path');
  if(route){
    route.replaceChildren();
    for(const [href,en,cn] of [['#method','How the method works','方法如何解决问题'],
      ['#results','Read the paper results','查看论文实验结果'],
      ['#demos','Explore the demonstrations','浏览补充演示']]){
      const a=document.createElement('a');a.href=href;a.textContent=t(en,cn);route.append(a);
    }
  }
  document.documentElement.dataset.paperNarrative='preprint-condensed-20261019';
})();
