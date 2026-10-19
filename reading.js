"use strict";
(() => {
  const zh = window.ICD_L10N?.zh === true;
  const text = (en, cn) => zh ? cn : en;
  const find = selector => document.querySelector(selector);

  // Move the original nodes, retaining IDs, source text, event handlers and async render targets.
  function fold(selectors, en, cn, id) {
    const nodes = selectors.map(s => typeof s === 'string' ? find(s) : s).filter(Boolean);
    if (!nodes.length) return null;
    const detail = document.createElement('details');
    detail.className = 'reading-detail';
    detail.id = id;
    const summary = document.createElement('summary');
    summary.textContent = text(en, cn);
    detail.append(summary);
    nodes[0].before(detail);
    for (const node of nodes) detail.append(node);
    return detail;
  }
  function compactBefore(detail, en, cn) {
    if (!detail) return;
    const note = document.createElement('p');
    note.className = 'essential-note';
    note.textContent = text(en, cn);
    detail.before(note);
  }
  function caption(selector, en, cn, labelEn, labelCn) {
    const root = find(selector);
    if (!root) return;
    const original = document.createElement('p');
    while (root.firstChild) original.append(root.firstChild);
    const compact = document.createElement('p');
    compact.className = 'essential-note';
    compact.textContent = text(en, cn);
    const detail = document.createElement('details');
    detail.className = 'reading-detail caption-detail';
    const summary = document.createElement('summary');
    summary.textContent = text(labelEn, labelCn);
    detail.append(summary, original);
    root.append(compact, detail);
  }

  caption('.report-lead-figure figcaption',
    'Independent channels · single-seed calibrated demonstration, separate from the benchmark tables.',
    '独立双通道 · 单种子校准示例，与主表评测区分。',
    'About this illustration', '主视觉说明');
  caption('.method-overview figcaption',
    'A shared operation-value interface connects visual calibration, graph discovery, and mechanism queries.',
    '视觉校准、图发现与机制查询，共用一套操作值坐标。',
    'Figure legend and scope', '图例与适用范围');

  const methodNote = find('#method .technical-note');
  const methodPosition = find('.method-positioning');
  if (methodNote && methodPosition) methodNote.append(methodPosition);

  const graph = fold(['#paper-result-scope', '#paper-completion-details', '.result-source', '#results > .container > .technical-note'],
    'Metric definitions, comparison scope, and sources', '指标定义、比较范围与来源', 'graph-reading-details');
  compactBefore(graph,
    'SHD ↓ / AUPRC ↑. Reversed edges count once; bold marks the best listed point estimates.',
    'SHD 越低越好，AUPRC 越高越好；反向边计一次，粗体标出列内最优点估计。');

  const control = fold(['.calibration-paper-evidence .table-scroll', '.calibration-paper-evidence > .table-note', '.plot-source'],
    'Complete calibration data and protocol (Table 2)', '完整校准数据与协议（表 2）', 'calibration-reading-details');
  compactBefore(control,
    'Three seeds, mean ± SD, errors ×10³. Joint updating is a reference with extra training permissions.',
    '三种子均值 ± 标准差，误差 ×10³；联合更新是具有额外训练权限的参考。');
  fold(['#calibration-example', '#calibration > .technical-note'],
    'Per-image readouts and measurement definitions', '逐图读数与测量定义', 'readout-reading-details');

  const prediction = fold(['#prediction-results-scope', '#prediction-results .task-paper-link'],
    'Evaluation protocol and additional ratio', '评测协议与额外误差比', 'prediction-reading-details');
  compactBefore(prediction,
    'Executed queries only, not end-to-end success. † denotes test sets A/B, not a verified OOD axis.',
    '仅统计已执行查询，不是端到端成功率；† 为 A/B 测试，不自动代表 OOD。');
  if (prediction) {
    const label = document.createElement('label');
    label.className = 'reading-option';
    const input = document.createElement('input');
    input.type = 'checkbox'; input.id = 'show-prediction-ratios';
    input.addEventListener('change', () => find('#prediction-results').classList.toggle('show-ratios', input.checked));
    label.append(input, document.createTextNode(text('Show the secondary ratio r in the table', '在表格中显示额外误差比 r')));
    prediction.append(label);
  }

  const images = fold(['#image-results-scope', '#image-results .task-paper-link'],
    'Image metric, reference permissions, and source', '图像指标、参考权限与来源', 'image-reading-details');
  compactBefore(images,
    'Executed queries only. † Physical ILCM and given-graph ICM-VAE are reference-only, excluded from ranking.',
    '仅统计已执行查询；† 物理 ILCM 和给定图 ICM-VAE 只作参考，不参与排名。');

  fold(['#scene-meta', '.replay-controls > p'],
    'Collection budget and batch details', '采集预算与批次说明', 'scene-reading-details');
  fold(['#story-chapters'], 'Jump to a recorded chapter', '跳转到记录的章节', 'story-reading-details');
  const storyTitle = find('#story-navigation > p:first-child');
  if (storyTitle) storyTitle.classList.add('reading-redundant');

  fold(['#extra-gallery-note', '#more-demos > .evidence-links'],
    'Physical checks, evidence scope, and sources', '物理检查、证据范围与来源', 'gallery-reading-details');
  const evidence = fold(['#evidence .evidence-grid', '#evidence > .technical-note', '#evidence > .evidence-links'],
    'Simulation records, assumptions, and source files', '仿真记录、适用假设与来源文件', 'source-reading-details');
  compactBefore(evidence,
    'Known node meanings and a static acyclic graph; calibrated scene demonstrations remain separate from paper benchmarks.',
    '节点含义已知，图为静态 DAG；校准场景演示与论文基准结果分开。');
})();
