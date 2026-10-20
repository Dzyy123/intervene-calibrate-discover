"use strict";
(() => {
  const zh=window.ICD_L10N?.zh===true;
  const t=(en,cn)=>zh?cn:en;
  const rows={
    balance_learning:[['Relocate the load, then move the goal marker.','搬动砝码，再移动目标标记。'],['Watch beam tilt and ball motion; distinguish them from the goal-distance readout.','看横梁和球如何变化，并区分真实运动与目标距离读数。'],['Load → tilt and goal → match receive directional support; ball relations remain incomplete.','载荷→倾角、目标→匹配读数得到方向证据；球相关关系尚未完整恢复。']],
    pnp_six_learning:[['Change gripper spacing, then transport the gripper horizontally.','改变夹爪间距，再水平搬运夹爪。'],['Watch object position and height, not just the robot trajectory.','重点看物体的位置和高度，而不是只看机械臂运动。'],['Gripper-to-object directions gain support; the matching-readout relations remain incomplete.','夹爪到物体状态的方向得到支持；匹配读数相关关系仍未完整恢复。']],
    balance_load_pair:[['Place the same mass on opposite sides in matched resets.','在匹配复位的场景中，把同一质量放到相反两侧。'],['Compare the direction of beam tilt and the ball’s final position.','比较横梁倾斜方向和球的最终位置。'],['A physical operation contrast, with the same mass and initial context.','展示同质量、同初始情境下的物理操作差异。']],
    balance_target_pair:[['Move only the goal marker between matched trials.','在配对试验间仅改变目标标记位置。'],['The ball and beam stay fixed while the horizontal match readout changes.','球和横梁保持不变，改变的是水平匹配读数。'],['Goal position changes the score, not an attractive force on the ball.','目标位置改变评分，不是对球施加吸引力。']],
    pnp_grasp_pair:[['Repeat transport with different gripper spacings.','用不同夹爪间距重复搬运操作。'],['Compare whether the object follows the moving gripper.','对比物体是否随夹爪移动。'],['Paired simulator outcomes; these are not decoder predictions.','这是配对仿真结果，不是解码器预测图像。']],
    domino_hold_middle:[['Hold domino 4 while triggering the upstream chain.','夹住第4块骨牌，再触发上游。'],['Watch the pieces before and after the held domino.','对比被夹骨牌上游与下游的响应。'],['Checks propagation blocking against an already frozen chain graph.','在已有冻结链式图下检查传播是否被阻断。']],
    domino_push_middle:[['Push domino 4 directly.','直接推动第4块骨牌。'],['Compare downstream toppling with the upstream pieces.','看下游倾倒与上游状态的差别。'],['A frozen-graph physical check, not a new discovery run.','是冻结图下的物理检查，不是新一轮学图。']],
    domino_push_last:[['Operate the final domino.','操作最后一块骨牌。'],['Watch whether earlier pieces change.','观察前面的骨牌是否变化。'],['Tests upstream preservation under a terminal-node operation.','检查末端操作是否保持上游不变。']],
    domino_frozen_operations:[['Compare holding, middle push and terminal push.','依次对比夹持、推动中间和推动末端。'],['Follow the affected portion of the same chain.','观察同一条链上哪些部分受到影响。'],['Three recorded checks of a fixed graph; no online re-learning.','三种固定图检查，不涉及在线重新学图。']],
    tool_hook_pull:[['Grasp the tool and pull through contact with the cube.','握住工具，通过接触拉动方块。'],['Watch tool–cube contact and the cube’s response.','重点看工具与方块的接触和方块响应。'],['Contact mechanics preview; no learned graph accompanies this clip.','接触物理预览；这段不包含学到的因果图。']],
    tool_miss_cube:[['Pull with the tool missing the cube.','拉动工具，但不接触方块。'],['Compare tool motion with object motion.','区分工具运动与物体运动。'],['A no-contact control for the mechanics preview, not a graph result.','物理预览的无接触对照，不是图发现结果。']],
    tool_open_gripper:[['Attempt the operation with an open gripper.','在夹爪张开时尝试操作。'],['Watch whether the tool is actually grasped before interpreting motion.','先看工具是否真的被握住，再判断后续运动。'],['A grasp-condition control; the source uses no object-attachment constraint.','夹持条件对照；记录来源没有物体附着约束。']]
  };
  const primary={
    parallel:[['Operate Entry A and Entry B in separate matched batches.','分批、配对操作入口 A 和入口 B。'],['Follow which output responds and when the graph arrows change.','看哪个输出响应，以及箭头在何时更新。'],['The recorded run resolves two independent channels, after calibration.','这次校准后的记录恢复了两条独立通道。']],
    chain:[['Hold or trigger the entry paddle.','保持或触发入口翻板。'],['Follow the response along the four paddles and the recorded orientations.','看响应如何沿四块翻板传播，以及记录中的方向更新。'],['A calibrated four-node chain: entry → relay 1 → relay 2 → output.','校准后的四节点链：入口→中继1→中继2→输出。']],
    domino:[['Use paired operations on a six-domino chain.','对六块骨牌链进行配对操作。'],['Distinguish intervention-supported arrows from graph-rule propagation.','区分干预证据支持的箭头与图规则传播得到的箭头。'],['A graph-learning reference without learned calibration.','未使用学习型校准的图学习参考。']]
  };
  function render(root,values){
    root.replaceChildren();
    [t('Operate','做什么'),t('Watch','看哪里'),t('Takeaway','这段说明什么')].forEach((label,i)=>{
      const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');
      dt.textContent=label;dd.textContent=t(...values[i]);row.append(dt,dd);root.append(row);
    });
  }
  window.ICD_DEMO_BRIEFS={renderExtra(record){
    let root=document.getElementById('demo-brief');
    if(!root){root=document.createElement('dl');root.id='demo-brief';root.className='demo-brief';document.getElementById('extra-video').after(root);}
    const questions={balance_learning:['What changes when the robot moves the load versus the goal?','机械臂搬动砝码、移动目标，分别会改变什么？'],pnp_six_learning:['How do gripper opening and position affect the object?','夹爪的开合与位置，怎样影响物体？']};
    if(questions[record.id])document.getElementById('extra-question').textContent=t(...questions[record.id]);
    render(root,rows[record.id]||[['Inspect the saved environment overview.','查看保存的环境概览。'],['Observe the scene and displayed variables.','观察场景及画面中的变量。'],['Background material only; no evaluated graph or predictor is attached.','仅作为背景素材，没有对应的评测图或预测器结果。']]);
  },stage(id,stage){
    if(id==='balance_learning'){
      if(stage==='round1_act')return t('The robot places the load on one side. Watch beam tilt and ball displacement.','机械臂把砝码放到一侧。请看横梁倾斜和球的位移。');
      if(stage==='round2_act')return t('The robot moves the goal marker. Watch the distance readout rather than expecting the ball to follow.','机械臂移动目标标记。请看距离读数，不要把它理解为球会追随目标。');
    }
    if(id==='pnp_six_learning'){
      if(stage==='round1_act')return t('Change gripper spacing. Watch whether the object is gripped and lifted.','改变夹爪间距。请看物体是否被夹住及抬起。');
      if(stage==='round2_act')return t('Change gripper position. Watch the object’s horizontal response during transport.','改变夹爪位置。请看搬运过程中物体的水平响应。');
    }
    if(stage==='final'&&rows[id])return t(...rows[id][2]);
    return null;
  }};
  document.addEventListener('DOMContentLoaded',()=>{
    const root=document.createElement('dl');root.className='demo-brief';root.id='primary-demo-brief';
    const status=document.createElement('p');status.className='demo-evidence-type';
    document.getElementById('scene-node-key').after(status,root);
    const select=key=>{render(root,primary[key]);status.textContent=key==='domino'?t('Graph-discovery reference · no learned calibration','图发现参考 · 未做学习型校准'):t('Calibrated static-module workflow · one recorded run','校准后的静态模组流程 · 一次记录运行');};
    select('parallel');window.addEventListener('icd-scene-selected',event=>select(event.detail));
    const tab=document.getElementById('tab-domino');if(tab)tab.textContent=t('Six dominoes · reference','六块骨牌 · 参考');
  });
})();
