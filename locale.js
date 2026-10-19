"use strict";
(() => {
  const zh = new URL(location.href).searchParams.get('lang') === 'zh';
  const labels = {
    'Uncalibrated':'无校准', 'Fully fitted affine':'完全拟合的仿射校准',
    'Nonlinear (ours)':'非线性校准（本文）', 'Ordinary joint updating (reference)':'普通联合更新（参考）',
    'Joint updating (ref.)':'联合更新（参考）', 'Domino SCM':'多米诺 SCM', 'Physical Domino':'物理多米诺',
    'Pick-and-Place':'抓取与放置', 'Balance':'平衡模组', 'Gears':'齿轮模组',
    'CAUSAL3D Spring':'CAUSAL3D 弹簧', 'CAUSAL3D Seesaw':'CAUSAL3D 跷跷板',
    'ID / Amplitude shift':'ID / 幅值分布变化', 'ID / amplitude shift':'ID / 幅值分布变化',
    'Test A / Test B':'测试集 A / 测试集 B', 'A / B':'A / B'
  };
  window.ICD_L10N = {zh, text:(en,cn)=>zh?cn:en, label:en=>zh?(labels[en]||en):en, missing:[]};
  function updateLanguageLinks(){
    for (const link of document.querySelectorAll('[data-language]')) {
      const url = new URL(location.href);url.searchParams.set('lang',link.dataset.language);
      link.href=url.pathname+url.search+url.hash;
      link.setAttribute('aria-current',link.dataset.language===(zh?'zh':'en')?'page':'false');
    }
  }
  updateLanguageLinks();window.addEventListener('hashchange',updateLanguageLinks);
  if (!zh) return;
  document.documentElement.lang='zh-CN';
  document.title='干预、校准、发现 · 从像素学习因果结构';
  document.querySelector('meta[name="description"]').content='让从像素得到的变量，能够按真实环境中的操作值执行干预查询。探索视觉校准、主动因果图发现、干预后果预测和反事实图像示例。';
  const content = [
    ['.skip-link','跳转到演示'], ['.brand>span:last-child','从像素到因果结构'],
    ['.site-header nav a[href="#motivation"]','引言'], ['.site-header nav a[href="#method"]','方法'],
    ['.site-header nav a[href="#experiment-setup"]','实验'], ['.site-header nav a[href="#related"]','相关工作'], ['.site-header nav a[href="#more-demos"]','全部演示'],
    ['.intro .eyebrow','研究项目 · 从干预中学习'], ['h1 span:nth-child(1)','干预。'], ['h1 span:nth-child(2)','校准。'], ['h1 span:nth-child(3)','发现。'],
    ['.paper-title','从像素学习因果结构'],
    ['.paper-author-notes','<span>* 共同第一作者。</span> <span>† 通讯作者：<a href="mailto:xpzhang@ieee.org">xpzhang@ieee.org</a>；<a href="mailto:jiayuc@hku.hk">jiayuc@hku.hk</a>。</span>'],
    ['.lead','让从像素得到的变量，能够按真实环境中的操作值执行查询。用可核验数值校准视觉读数，选择实验来消除因果方向歧义，再预测状态和图像后果。'],
    ['.resource-links a:nth-child(1)','观看图学习过程'], ['.resource-links a:nth-child(2)','阅读论文（中文）'], ['.resource-links a:nth-child(3)','项目代码'],
    ['#discovery .section-heading .eyebrow','因果发现过程'], ['#discovery-heading','操作环境，逐步确定因果图。'],
    ['#discovery .section-heading>p','左侧是记录的场景；右侧是学到的结构。'],
    ['#discovery .demo-label','机械模组中的已记录流程演示，与前述论文基准比较分开呈现。'],
    ['#tab-parallel','独立双通道'], ['#tab-chain','机械链'], ['#tab-domino','六块多米诺'],
    ['.scene-question>span','要回答的问题'], ['#scene-question','操作入口 A 或入口 B，会改变哪个输出？'],
    ['#scene-node-key','1＝入口 A · 2＝输出 A · 3＝入口 B · 4＝输出 B'],
    ['#video-error','视频未能加载。<a id="video-download" href="assets/parallel-story-zh.mp4" download>下载演示视频</a>。'],
    ['#scene-title','独立双通道'], ['#scene-description','分别操作两个入口。记录的证据支持“入口 A → 输出 A”和“入口 B → 输出 B”。'],
    ['#scene-meta','4 个节点 · 校准 32 次＋图采集 128 次'], ['#restart-video','从头观看'],
    ['.replay-controls>p','每次图更新使用完整配对批次，并非仅凭画面中的一次接触。'],
    ['#story-navigation>p:first-child','跳转到已记录的阶段'],
    ['.watch-guide li:nth-child(1) strong','观察'], ['.watch-guide li:nth-child(1) span','灰色边保留尚未确定的方向。'],
    ['.watch-guide li:nth-child(2) strong','比较操作'], ['.watch-guide li:nth-child(2) span','先保持入口未触发，再从相同的复位情境触发它。'],
    ['.watch-guide li:nth-child(3) strong','依据证据更新'], ['.watch-guide li:nth-child(3) span','接受证据支持的方向，只传播满足规则的关系。'],
    ['.graph-legend span:nth-child(1)','<i class="legend-line gray"></i>观察数据仍有歧义'],
    ['.graph-legend span:nth-child(2)','<i class="legend-line blue"></i>干预证据支持的方向'],
    ['.graph-legend span:nth-child(3)','<i class="legend-line green"></i>图规则传播的方向'],
    ['#scene-scope','节点表示最终的触发状态。静态图概括一次性操作的影响，不描述刚体运动的每一帧。'],
    ['#motivation>.eyebrow','01 · 引言'], ['#motivation-heading','识别一个状态，不等于知道如何设置它。'], ['#problem>.eyebrow','03 · 问题定义'], ['#problem-heading','已知什么，需要学习什么？'], ['.site-header nav a[href="#problem"]','问题定义'],
    ['#motivation .problem-columns>div>p:first-child','编码器可能识别出骨牌状态，但其数值读数仍与环境中的操作值不同。直接设置这个读数，即使图的方向正确，也可能回答了错误的查询。'],
    ['#motivation .problem-columns>div>p:nth-child(2)','这里有两个不同的问题：<strong>哪些变量影响哪些变量？</strong>以及<strong>模型中怎样的设置，才对应可核验的环境操作值？</strong>干预响应为前者提供证据；校准处理后者。'],
    ['.central-claim .eyebrow','研究重点'], ['.central-claim>p:nth-child(2)','让像素得到的变量，能够执行用真实环境操作值表达的查询。'],
    ['.central-claim>span','节点含义已知 · 图与机制未知'],
    ['.setting-grid article:nth-child(1) h3','已知什么'], ['.setting-grid article:nth-child(1) p','图像、用于锚定节点身份的状态标签、允许操作的目标及可行值。操作接口核验直接目标实际达到的数值。'],
    ['.setting-grid article:nth-child(2) h3','学习什么'], ['.setting-grid article:nth-child(2) p','保持节点身份的校准映射、未知的直接因果结构，以及描述父节点如何影响各节点的局部机制。'],
    ['.setting-grid article:nth-child(3) h3','检验什么'], ['.setting-grid article:nth-child(3) p','图结构准确性、非目标节点的状态后果，以及替代操作下的图像。测试时所有已拟合模块保持冻结。'],
    ['#problem>.scope-note:last-child','节点含义来自允许的状态监督；不提供父节点集合。干预反馈提供响应图像和核验后的目标值，而非完整真值状态向量。如果单帧无法显示某个声明变量，协议须增加观测，并给予对照方法同等访问权限。'],
    ['#method .eyebrow','04 · 方法'], ['#method-heading','从像素到查询，共用一套操作坐标。'],
    ['#method .section-intro','校准、图学习和机制拟合使用一致的读数坐标。生成图像前，通过逆校准回到原解码器坐标。'],
    ['.method-overview figcaption','论文原始方法图（英文）；点击可查看矢量版。灰色表示输入与输出，蓝色表示模型计算，绿色表示校准。图中的因果图是示意结构，并非某场景的发现结果。OOD 示意对应明确的连续命令分布变化；仅有 A/B 测试标签不能自动视为 OOD。'],
    ['.method-steps article:nth-child(1) .step-number','1 · 对齐数值'], ['.method-steps article:nth-child(1) h3','校准冻结的视觉接口'],
    ['.method-steps article:nth-child(1) p','训练节点对齐的编码器与解码器后，将二者冻结。预定的轮转干预提供可核验目标值，以拟合逐维、可逆的映射 <em>T</em>。它校正尺度、偏移和非线性读数偏差，不改变节点身份。'],
    ['.method-steps article:nth-child(2) .step-number','2 · 确定方向'], ['.method-steps article:nth-child(2) h3','选择有信息量的图发现实验'],
    ['.method-steps article:nth-child(2) p','冻结 <em>T</em> 后，条件独立性检验给出观察骨架及部分方向。选择仍有较多未定向邻边、且可操作的目标，采集响应，检查候选方向，再传播一致的图规则。证据不足时保留未定向关系。'],
    ['.method-steps article:nth-child(2) .formula','观察数据＋目标干预响应 → Ĝ'],
    ['.method-steps article:nth-child(3) .step-number','3 · 执行查询'], ['.method-steps article:nth-child(3) h3','拟合机制，预测干预后果'],
    ['.method-steps article:nth-child(3) p','在合法且方向足够确定的图上，按估计父节点集合拟合局部函数。将目标设为共享坐标中的操作值，再传播至其他节点。生成图像时，先撤销标准化，再经 <em>T</em><sup>−1</sup> 送入冻结解码器。'],
    ['.method-steps article:nth-child(3) .formula','h<sup>query</sup> → 撤销标准化 → T<sup>−1</sup> → D'],
    ['.query-definitions article:nth-child(1) .eyebrow','总体后果预测'], ['.query-definitions article:nth-child(1) h3','这项操作的平均响应是什么？'],
    ['.query-definitions article:nth-child(1)>p:last-child','输入目标与数值 <em>(j, u)</em>，不输入事实图像。对拟合的根节点及残差重采样，沿图传播，再平均<strong>非目标节点</strong>的状态。排除被操作节点，避免把复制命令计为预测能力。'],
    ['.query-definitions article:nth-child(2) .eyebrow','反事实图像生成'], ['.query-definitions article:nth-child(2) h3','同一事实情境下，如果改变操作会怎样？'],
    ['.query-definitions article:nth-child(2)>p:last-child','输入事实图像与替代操作 <em>(j, u)</em>。估计并保留事实残差，设置目标值，再更新后代节点。非后代保留事实读数，通过逆校准完成解码。'],
    ['#method .technical-note summary','坐标、主动选择与预算'],
    ['#method .technical-note p:nth-of-type(1)','<em>T</em> 校准图像读数，不对操作命令再校准一次。可核验数值 <em>u</em> 通过固定的训练和观察标准化，直接映射为目标设置 <em>q</em><sub>j</sub><em>(u)</em>。图发现和机制拟合使用 <em>h(x) = (T(E(x)) − μ<sup>c</sup>)/σ<sup>c</sup></em>；解码器接收原编码器坐标。'],
    ['#method .technical-note p:nth-of-type(2)','校准采集采用预定轮转；图阶段的目标选择依赖已有证据。新增干预记录的总成本包含两阶段：<strong>B = B<sub>cal</sub> + B<sub>graph</sub></strong>。重放不增加环境调用。方法针对最终状态，不是逐帧动力学。'],
    ['.method-positioning','贡献在于：为冻结、已知节点含义的视觉模型建立统一的干预值接口。潜变量干预和主动因果发现是已有能力；论文分别检验数值对齐、图采集和解码。'],
    ['#key-evidence>.eyebrow','5.3 · 干预值校准与效应'], ['#key-evidence-heading','不仅看读数，也要检验查询。'],
    ['.orientation-evidence h3','干预能消除增加观察数据仍留下的方向歧义。'],
    ['.orientation-evidence>div:first-child>p:nth-of-type(1)','在三个种子的受控多米诺实验中，加入匹配数量的观察记录后，仍有六条边未定向。加入 1,800 或 3,600 条图阶段干预记录后，可以恢复真图。'],
    ['.orientation-evidence .scope-note','覆盖导向与轮转干预在这里都能成功；覆盖导向并未比轮转节省记录。这组比较共享同一校准。'],
    ['.orientation-evidence a','论文第 5.2 节'], ['.orientation-comparison>div:first-child>span','增加观察数据'], ['.orientation-comparison>div:first-child>p','条边仍未定向'],
    ['.orientation-comparison>div:last-child>span','加入干预响应'], ['.orientation-comparison>div:last-child>strong','方向确定'], ['.orientation-comparison>div:last-child>p','该受控任务中恢复真图'],
    ['.calibration-paper-evidence>.eyebrow','同数据校准对照 · 论文表 2 · 3 个种子'],
    ['.calibration-paper-evidence>h3','读数更准确，干预效应预测却可能更差。'],
    ['.calibration-paper-evidence>p:nth-of-type(2)','这组受控实验共享事实情境和命令。普通联合更新的平均读数误差低于非线性校准，但非目标节点的平均效应预测误差更高。因此应检验干预引起的变化，而不只用读数准确性评价校准。'],
    ['.plot-heading>p','在同一组数据上比较两种度量。'], ['.plot-heading>label','效应测试组<select id="effect-group" aria-label="效应测试组"><option value="id">ID（分布内）</option><option value="shift">幅值分布变化</option></select>'],
    ['.plot-source','各面板均为越低越好。三个种子的均值 ± 标准差，误差乘以 10³。联合更新具有额外训练权限。这里是论文中的测量值，不是新增场景重放的分数。'],
    ['#paper-calibration-table caption','七节点多米诺 · 64 × 64 RGB · 误差 ×10³ · 种子 5/6/7 的均值 ± 样本标准差'],
    ['#paper-calibration-table th:nth-child(1)','配置'], ['#paper-calibration-table th:nth-child(2)','读数 MSE'], ['#paper-calibration-table th:nth-child(3)','效应 NMSE<br>ID'], ['#paper-calibration-table th:nth-child(4)','效应 NMSE<br>幅值变化'], ['#paper-calibration-table th:nth-child(5)','RGB MSE<br>ID'], ['#paper-calibration-table th:nth-child(6)','RGB MSE<br>幅值变化'],
    ['.calibration-paper-evidence>.table-note','效应 NMSE 在配对情境中衡量非目标状态相对事实状态的预测变化，与表 3 的总体平均状态误差不同。前三行共享冻结编码器、数据、图和 ID 重拟合解码器；各配置在自己的坐标中拟合机制。普通联合更新还训练读数头和解码器，因此属于不同权限的参考，不能单凭它归因于可逆性。'],
    ['.finding-boundary','这组数据中，校准相对无校准降低了平均效应误差。非线性并非始终优于完全拟合的仿射映射：仿射的 ID 效应与 RGB 误差更低，非线性的幅值变化效应误差更低。齿轮对照也表明，读数改善未必改善查询。'],
    ['#results .section-heading .eyebrow','5.2 · 因果图发现'], ['#results-heading','边与方向恢复得是否准确？'], ['#results .section-heading>p','数值来自投稿论文，与新增场景演示区分。'],
    ['.task-overview article:nth-child(1) h3','因果图发现'], ['.task-overview article:nth-child(1) p','估计的直接边及方向是否与真图一致？'],
    ['.task-overview article:nth-child(2) h3','干预后果预测'], ['.task-overview article:nth-child(2) p','冻结模型能否预测其他节点的平均最终状态？'], ['.task-overview article:nth-child(2) span','非目标平均状态 NMSE ↓'],
    ['.task-overview article:nth-child(3) h3','反事实图像生成'], ['.task-overview article:nth-child(3) p','改变潜变量目标后，能否生成同一情境中的干预图像？'],
    ['#result-tab-graph','因果图发现'], ['#result-tab-consequences','分布变化下的干预后果预测'], ['#result-tab-images','反事实 RGB 图像生成'],
    ['#paper-completion-details summary','流程完成数不等于图完全正确数'],
    ['.result-source a:nth-child(1)','论文表格与协议'], ['.result-source a:nth-child(2)','机器可读的报告数值'], ['.result-source>span','本页面没有新增或重跑测量。'],
    ['#results>.container>.technical-note summary','比较范围与解读'],
    ['#results>.container>.technical-note p:nth-of-type(1)','CausalVAE 和 ILCM 是已发表方法；ILCM 本身使用干预配对学习，不能以“没有干预数据”解释其结果。各系统使用自己的表征与查询机制。ICM-VAE 是给定图的生成参考，不是图发现竞争方法。'],
    ['#results>.container>.technical-note p:nth-of-type(2)','预测和图像汇总覆盖已执行查询，排除被阻止的查询；它们不是端到端成功率，也不保证查询总体完全一致。物理多米诺 ILCM 的权限与预算不同，不参加统一图像排名。ID／幅值变化与测试集 A/B 仍有区别；A/B 标签本身不能确定 OOD 变化轴。'],
    ['#demos>.eyebrow','补充 · 完整演示库'], ['#demos>h2','按证据类型浏览所有独立演示。'], ['#demos>.section-intro','演示库收录图学习、冻结图下的操作检查、平衡和抓取放置、工具使用及基础环境概览。各类材料保留自己的验证范围，不与论文主表或模型预测混写。'], ['#demos>a','返回图学习视频'],
    ['#calibration .section-heading .eyebrow','新增场景 · ID 读数检查'], ['#calibration-heading','将视觉读数对齐到操作坐标。'], ['#calibration .section-heading>p','同一个冻结编码器；独立校准数据。'],
    ['#calibration>.section-intro','校准将已有、节点对齐的视觉坐标映射到操作接口的数值。下面两个场景同时说明：读数改善是一项测量结果，并不保证下游性能提高。'],
    ['.calibration-controls>label','场景<select id="calibration-scene" aria-label="校准场景"><option value="parallel">独立双通道</option><option value="chain">机械链</option></select>'],
    ['#calibration-caption','ID 验证 · 128 张图像 · 单个训练种子'], ['.calibration-insight>.scope-note','NMSE 是训练标准化锚点坐标中的平方误差，越低越好。统计包含全部 128 张验证图像。'],
    ['#calibration-example label','查看固定验证图像 <select id="calibration-sample-choice" aria-label="验证图像"></select>'],
    ['#calibration .technical-note summary','校准了什么，未校准什么？'], ['#calibration .technical-note p','映射使用核验后的目标值与 RGB 拟合，保持节点身份并进行单调修正。它不识别未知节点身份，也不解混纠缠潜变量。非入口坐标不变。图发现使用固定 0.5 触发阈值，该阈值不是按查询结果选择的。'],
    ['#queries .section-heading .eyebrow','新增场景 · 配对查询检查'], ['#query-heading','改变操作，保留事实情境。'], ['#queries .section-heading>p','真实解码器输出与仿真真值并列。'],
    ['#queries .section-intro','预测通过修改潜变量目标、保留事实残差并沿拟合机制传播，再回到原编码器坐标进行解码。'],
    ['.query-controls>label:first-child','场景与被操作节点<select id="query-choice" aria-label="查询场景与节点"></select>'], ['.query-controls>label:nth-child(2)','记录的情境<select id="query-context" aria-label="查询情境"></select>'],
    ['.query-grid figure:nth-child(1) figcaption','事实图像'], ['.query-grid figure:nth-child(1) p','记录的操作＝0'], ['.query-grid figure:nth-child(2) figcaption','仿真真值'], ['.query-grid figure:nth-child(2) p','相同情境，操作＝1'],
    ['.query-grid figure:nth-child(3) figcaption','不传播'], ['.query-grid figure:nth-child(3) p','组件对照'], ['.query-grid figure:nth-child(4) figcaption','校准后图查询'], ['.query-grid figure:nth-child(4) p','编码器、T、图与解码器冻结'], ['.query-grid figure:nth-child(5) figcaption','局部误差'], ['.query-grid figure:nth-child(5) p','平均 |RGB 误差| · 色标 0–0.25'],
    ['#queries .technical-note summary','如何正确解读这组比较'],
    ['#queries .technical-note p:nth-of-type(1)','展示的是现有图发现重放中固定的前四个情境。机制只用观察 RGB 数据库拟合；配对结果不是预测器输入。比较项是共享解码器的不传播组件对照，不是独立训练的已发表基线。所有图像使用模型原生 128 × 128 分辨率，未经增强。'],
    ['#queries .technical-note p:nth-of-type(2)','示例在二值触发状态上使用线性加性噪声机制。它是配对的最终状态查询展示，不是非线性二值 SCM 的精确反事实识别，也不是新情境泛化检验。所示图像误差只对应该情境，不构成 SOTA 比较。0/1 操作变化不是连续幅值 OOD。'],
    ['#evidence>.eyebrow','复现资料 · 来源与边界'], ['#evidence>h2','让结论与证据相对应。'],
    ['.evidence-grid article:nth-child(1) h3','真实重放与记录的图更新'], ['.evidence-grid article:nth-child(1) p','机械链和双通道视频重放记录的仿真状态。图更新来自发现日志；发现程序没有输入真图。视频颜色区分观察歧义、干预支持方向与图规则传播，与方法图中的模块配色含义不同。'],
    ['.evidence-grid article:nth-child(2) h3','明确适用假设'], ['.evidence-grid article:nth-child(2) p','问题设定采用已知节点含义、无遗漏共同原因的有向无环图，并要求可靠校准、邻接估计与干预覆盖。单张事实图像未必能识别全部外生原因；这些评测不证明普适或个体层面的反事实可识别性。'],
    ['#evidence .technical-note summary','测量与场景假设'], ['#evidence .technical-note p:nth-of-type(1)','视觉编码器以已知节点锚点训练；入口校准使用独立干预数据。触发状态读数采用固定阈值，编码器、校准映射与读数规则在发现阶段保持冻结。铰接翻板使用理想化的局部止回力学约束，并非模拟棘齿接触。释放后不重置物体姿态。'],
    ['#evidence .technical-note p:nth-of-type(2)','六块多米诺视频来自另一组没有学习型校准的图发现运行，其操作重放不等于拟合的状态预测器或模型生成的反事实图像。这些新增场景尚未提供独立留出的 OOD 评测或已发表基线比较。'],
    ['#evidence .evidence-links a:nth-child(1)','分章节视频来源绑定'], ['#evidence .evidence-links a:nth-child(2)','原始重放与模型来源'], ['#evidence .evidence-links a:nth-child(3)','校准与查询记录'],
    ['footer p:first-child','干预、校准、发现'], ['footer p:last-child','论文结果与新增仿真示例分开标注。']
  ];
  for (const [selector,html] of content) {
    const elements=document.querySelectorAll(selector);
    if(!elements.length)window.ICD_L10N.missing.push(selector);
    for(const element of elements)element.innerHTML=html;
  }
  const attrs = [
    ['.brand','aria-label','干预、校准、发现：主页'], ['.site-header nav','aria-label','主导航'],
    ['.scene-tabs','aria-label','选择仿真场景'], ['#discovery-video','aria-label','独立双通道的操作与图学习重放'],
    ['#story-chapters','aria-label','视频章节'], ['.graph-legend','aria-label','图边颜色含义'],
    ['.method-overview img','alt','论文方法：冻结编码器、可逆校准与标准化、主动图发现、局部机制拟合及三项评测'],
    ['#calibration-evidence-bars','aria-label','论文表 2 的读数与干预效应误差'], ['#calibration-chart','aria-label','校准前后的读数误差'],
    ['#calibration-image','alt','固定的 ID 验证场景图像'],
    ['#query-factual','alt','真实记录的事实最终状态图像'], ['#query-gt','alt','相同情境下改变操作后的仿真真值'],
    ['#query-control','alt','只替换目标而不传播后代的解码器对照输出'], ['#query-prediction','alt','校准坐标中保留事实残差并传播后的真实解码器输出'], ['#query-error','alt','模型预测相对仿真真值的逐像素误差']
  ];
  for(const [selector,name,value] of attrs){const element=document.querySelector(selector);if(element)element.setAttribute(name,value);else window.ICD_L10N.missing.push(selector);}
  document.querySelector('#evidence .evidence-links a:first-child').href='assets/story-source-bindings-zh.json';
  for(const link of document.querySelectorAll('a[href^="assets/paper.pdf"]'))link.href='assets/paper-zh.pdf';
  document.querySelector('#paper-calibration-table').closest('.table-scroll').setAttribute('aria-label','论文的受控校准表格');
  document.querySelector('#paper-result-table').closest('.table-scroll').setAttribute('aria-label','论文报告的基准结果表');
  document.documentElement.dataset.i18nMissing=String(window.ICD_L10N.missing.length);
})();
