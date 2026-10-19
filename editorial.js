"use strict";
(() => {
  const zh = window.ICD_L10N?.zh === true;
  const titles = [
    ['h1 span:nth-child(1)', 'Intervene,', '干预、'],
    ['h1 span:nth-child(2)', 'Calibrate,', '校准、'],
    ['h1 span:nth-child(3)', 'Discover', '发现'],
    ['#motivation-heading', 'Introduction', '研究动机'],
    ['#related-heading', 'Related work', '相关工作'],
    ['#problem-heading', 'Problem formulation', '问题定义'],
    ['#method-heading', 'Method', '方法'],
    ['#setup-heading', 'Experimental setup', '实验设置'],
    ['#results-heading', 'Causal graph discovery', '因果图发现'],
    ['#discovery-heading', 'Graph-learning demonstrations', '图学习过程'],
    ['#key-evidence-heading', 'Calibration and intervention effects', '校准与干预效应'],
    ['#calibration-heading', 'Visual readouts before and after calibration', '校准前后的视觉读数'],
    ['#query-heading', 'Counterfactual image examples', '反事实图像示例'],
    ['#conclusion-heading', 'Conclusion', '结论'],
    ['#demos > h2', 'More demonstrations', '更多场景演示'],
    ['#demos > .section-intro', 'Browse additional Balance, Pick-and-Place, Domino, and tool-use scenes below.', '下面收录平衡、抓取放置、多米诺和工具操作等更多场景。'],
    ['#extra-gallery-intro', 'Select a scene or filter by type. Recorded graph traces, simulator operations, and model outputs are labeled separately.', '可以选择场景，或按类型筛选。图学习记录、仿真操作与模型输出分别标注。'],
    ['#evidence > h2', 'Reproducibility and assumptions', '复现资料与适用假设'],
    ['.resource-links a:first-child', 'Demonstrations', '演示视频'],
    ['.report-lead-figure figcaption', 'Recorded simulation and its discovered graph. A single-seed calibrated workflow example, separate from the paper’s benchmark cohort; original annotations are in Chinese.', '独立双通道中的已记录仿真与发现图。单个种子的校准流程示例，与论文的基准评测区分。'],
    ['.query-definitions article:nth-child(1) h3', 'Population consequence prediction', '总体干预后果预测'],
    ['.query-definitions article:nth-child(2) h3', 'Same-context counterfactual images', '同一事实情境下的反事实图像'],
    ['.orientation-evidence h3', 'Observational and interventional graph acquisition', '观察与干预数据的图采集对照'],
    ['.evidence-grid article:nth-child(1) h3', 'Recorded states and graph updates', '仿真状态与图更新记录'],
    ['.evidence-grid article:nth-child(2) h3', 'Identifiability assumptions', '可识别性假设']
  ];
  for (const [selector, en, cn] of titles) {
    const element = document.querySelector(selector);
    if (element) element.textContent = zh ? cn : en;
  }
  if (zh) document.querySelector('h1').textContent = '干预、校准、发现';
  const cover = document.querySelector('.report-lead-figure img');
  if (cover && zh) cover.alt = '机械臂操作独立双通道的仿真场景与实际发现的四节点图';
  const figure = document.querySelector('.method-overview');
  if (figure) figure.id = 'method-figure';
})();
