"use client";

import { useLanguage } from "@/components/LanguageProvider";

type Copy = { cn: string; en: string };
const copy = (language: "cn" | "en", value: Copy) => language === "cn" ? value.cn : value.en;

function Meta({ number, year, label }: { number: string; year: string; label: Copy }) {
  const { language } = useLanguage();
  return <div className="profile-film-meta"><span>CHAPTER {number}</span><i /> <span>{year}</span><strong>{copy(language, label)}</strong></div>;
}

export function CareerProfile() {
  const { language } = useLanguage();
  const cn = language === "cn";

  return <section className="profile-documentary" aria-label={cn ? "个人履历" : "Career Profile"}>
    <header className="profile-cover">
      <div>
        <p className="profile-cover-kicker">02 / PROFILE</p>
        <h1>{cn ? "个人履历" : "Career Profile"}</h1>
        <p className="profile-cover-years">2015 — NOW</p>
        <p className="profile-cover-intro">{cn ? "从摄影、创意写作到品牌运营与系统建设，这是一条由视觉表达逐渐走向执行、协作与系统搭建的路径。" : "From photography and creative writing to brand operations and system building — a path from visual expression toward execution, collaboration and systems."}</p>
      </div>
      <aside className="profile-cover-facts" aria-label="Profile summary">
        <p>CAREER ARCHIVE</p>
        <dl><div><dt>10</dt><dd>{cn ? "年持续创作与实践" : "Years of making"}</dd></div><div><dt>7</dt><dd>{cn ? "个成长阶段" : "Stages"}</dd></div><div><dt>2</dt><dd>{cn ? "段专业学习经历" : "Degrees"}</dd></div><div><dt>1</dt><dd>{cn ? "个当前职业角色" : "Current role"}</dd></div></dl>
      </aside>
    </header>

    <section className="profile-opening" aria-label={cn ? "职业起点" : "Career opening"}>
      <p>{cn ? "这不是一份按职位排列的简历，而是一段逐渐形成工作方式的职业记录。" : "This is not a résumé arranged by job title, but a record of how a working method gradually took shape."}</p>
      <span>SCROLL TO FOLLOW THE MAKING</span>
    </section>

    <article className="profile-sequence profile-sequence--observation" id="profile-01">
      <div className="profile-observation-frame" aria-hidden="true"><b /><b /><b /><b /><em>35MM</em><i>FRAME 01</i></div>
      <div className="profile-sequence-copy">
        <Meta number="01" year="2015—2018" label={{ cn: "观察", en: "Observation" }} />
        <p className="profile-sequence-year">2015</p><h2>{cn ? "摄影工作室学习与个人创作" : <>Photography Studio Learning<br />&amp; Personal Practice</>}</h2>
        <p className="profile-role">{cn ? "摄影学习阶段" : "Photography Learning Stage"}</p>
        <p>{cn ? "2015 年开始进入摄影工作室学习摄影，接触拍摄、光线、构图、人物与现场观察，并在学习过程中持续进行个人摄影创作。" : "In 2015, I began learning photography in a studio environment, exploring shooting, light, composition, people and observation on location while continuing my own personal photography practice."}</p>
        <p>{cn ? "这段经历是我视觉能力的起点，也让我逐渐建立对画面、光线、人物状态和现场氛围的敏感度。" : "This was the starting point of my visual ability, gradually building my sensitivity to imagery, light, people and the atmosphere of a scene."}</p>
        <div className="profile-words"><span>{cn ? "摄影学习" : "Photography Learning"}</span><span>{cn ? "工作室实践" : "Studio Practice"}</span><span>{cn ? "个人创作" : "Personal Practice"}</span><span>{cn ? "视觉观察" : "Visual Observation"}</span></div>
      </div>
      <p className="profile-margin-note">{cn ? "先看见，才有判断。" : "See first. Then decide."}</p>
    </article>

    <article className="profile-sequence profile-sequence--photography" id="profile-02">
      <div className="profile-photo-index" aria-hidden="true"><span>IMAGE STUDIES</span><b>02</b><i>2018 / 2022</i></div>
      <div className="profile-sequence-copy">
        <Meta number="02" year="2018.09—2022.06" label={{ cn: "摄影", en: "Photography" }} />
        <h2>{cn ? "本科 · 摄影专业" : "Bachelor’s Degree · Photography"}</h2><p className="profile-role">{cn ? "摄影专业本科阶段" : "Undergraduate photography studies"}</p>
        <p>{cn ? "系统学习摄影、视觉表达与创作方法。在长期拍摄练习和作品实践中，我逐渐理解画面不仅是记录，也是组织观看与传递感受的方式。" : "I studied photography, visual expression and creative methods in a structured way. Through sustained practice, I learned that images not only record — they organise attention and convey feeling."}</p>
        <div className="profile-crop-marks" aria-hidden="true"><i /><i /><i /><i /></div>
      </div>
      <aside className="profile-photo-caption"><span>IMAGE NO. 024</span><strong>{cn ? "视觉表达" : "Visual Expression"}</strong><small>{cn ? "画面开始有了方法。" : "Images began to have a method."}</small></aside>
    </article>

    <article className="profile-sequence profile-sequence--writing" id="profile-03">
      <div className="profile-script-lines" aria-hidden="true"><span>01</span><span>02</span><span>03</span><span>04</span><span>05</span><span>06</span><span>07</span><span>08</span></div>
      <div className="profile-script">
        <Meta number="03" year="2022.09—2023.09" label={{ cn: "叙事", en: "Storytelling" }} />
        <p className="profile-scene">INT. — CREATIVE WRITING / DAY</p><h2>{cn ? "研究生 · 创意写作专业" : "Master’s Degree · Creative Writing"}</h2><p className="profile-role">{cn ? "创意写作研究生阶段" : "Graduate studies in creative writing"}</p>
        <p>{cn ? "学习舞台剧、动画、剧本、脚本与人物传记等多个内容方向。这段经历强化了我对信息组织、人物塑造和叙事节奏的理解，也让我更加重视内容背后的结构。" : "I explored stage plays, animation, scripts, screenwriting and biographical writing. The work strengthened my understanding of information, character and narrative rhythm — and the structure behind content."}</p>
        <blockquote>{cn ? "“内容需要情绪、结构和记忆点。”" : "“Content needs emotion, structure and a reason to be remembered.”"}</blockquote>
      </div>
    </article>

    <article className="profile-sequence profile-sequence--brand" id="profile-04">
      <div className="profile-brand-map" aria-hidden="true"><span>{cn ? "目标" : "GOAL"}</span><i>→</i><span>{cn ? "内容" : "CONTENT"}</span><i>→</i><span>{cn ? "现场" : "LIVE"}</span><i>→</i><span>{cn ? "交付" : "DELIVERY"}</span></div>
      <div className="profile-sequence-copy">
        <Meta number="04" year="2023.09—2024.01" label={{ cn: "品牌", en: "Brand" }} />
        <h2>{cn ? "开始进入品牌运营" : "Entering Brand Operations"}</h2><p className="profile-role">{cn ? "从表达转向品牌实践" : "From expression to brand practice"}</p>
        <p>{cn ? "开始将摄影、视觉与内容能力带入实际品牌场景。我逐渐理解，创意不仅需要成立，也需要服务于传播目标、现场执行与协作关系。" : "I began bringing photography, visual thinking and content into real brand settings. I learned that creative work must serve communication goals, live delivery and collaboration — not only itself."}</p>
      </div>
    </article>

    <article className="profile-sequence profile-sequence--refine" id="profile-05">
      <div className="profile-refine-stamp" aria-hidden="true"><span>RESET</span><span>REFINE</span><span>REBUILD</span></div>
      <div className="profile-sequence-copy">
        <Meta number="05" year="2024.01—2024.06" label={{ cn: "打磨", en: "Refinement" }} />
        <h2>{cn ? "个人作品创作 / 新媒体运营学习" : "Personal Work / New Media Learning"}</h2><p className="profile-role">{cn ? "个人作品与运营学习阶段" : "Personal work and operations learning"}</p>
        <p>{cn ? "继续整理与打磨个人作品，同时补充新媒体运营、内容传播和平台相关知识。这是一个从创作回到整理、从表达逐渐走向方法的过渡阶段。" : "I kept refining personal work while building knowledge in new-media operation, content distribution and platforms. It was a transition from making to organising, and from expression toward a working method."}</p>
      </div>
      <p className="profile-refine-note">{cn ? "留白，也是重新组织的开始。" : "Space is where reorganising begins."}</p>
    </article>

    <article className="profile-sequence profile-sequence--assistant" id="profile-06">
      <div className="profile-workflow" aria-label={cn ? "多任务工作流" : "Multi-task workflow"}><span>VISUAL</span><i>+</i><span>VIDEO</span><i>+</i><span>PLATFORM</span><i>+</i><span>EVENT</span></div>
      <div className="profile-sequence-copy">
        <Meta number="06" year="2024.07—2025.07" label={{ cn: "执行", en: "Execution" }} />
        <h2>{cn ? "品牌助理" : "Brand Assistant"}</h2><p className="profile-role">{cn ? "从视觉到平台运营的实战阶段" : "Practical work from visual production to platform operations"}</p>
        <p>{cn ? "开始以品牌助理的身份参与长期品牌工作，负责视觉摄影、大型活动摄影、视频剪辑、平台运营，并参与团队活动执行。我第一次长期站在品牌工作的真实现场。" : "I joined ongoing brand work as a brand assistant across visual photography, event coverage, video editing, platform operation and event delivery — experiencing the daily reality of brand work."}</p>
      </div>
      <div className="profile-workflow-list"><span>{cn ? "视觉摄影与活动拍摄" : "Visual photography & event coverage"}</span><span>{cn ? "视频剪辑与内容输出" : "Video editing & content output"}</span><span>{cn ? "平台日常运营" : "Platform operation"}</span><span>{cn ? "品牌活动现场执行" : "Live event delivery"}</span></div>
    </article>

    <article className="profile-sequence profile-sequence--lead" id="profile-07">
      <header><Meta number="07" year={cn ? "2025.08—至今" : "2025.08—Present"} label={{ cn: "系统", en: "System" }} /><p className="profile-lead-now">CURRENT ROLE</p><h2>{cn ? "网络运营部主管" : "Network Operations Lead"}</h2><p>{cn ? "从执行走向系统建设" : "From execution to system building"}</p></header>
      <div className="profile-system-diagram" aria-hidden="true"><b>PEOPLE</b><i>↘</i><b>CONTENT</b><strong>SYSTEM</strong><b>PLATFORM</b><i>↗</i><b>PROCESS</b></div>
      <div className="profile-lead-copy"><p>{cn ? "升任网络运营部主管后，我的角色从单点执行进一步走向团队协作、平台管理、活动策划与系统建设。工作重点逐渐扩展到 AI 工作流、内容协同、线上学习体系和运营架构。" : "As Network Operations Lead, my role expanded from single-point delivery into team collaboration, platform management, event planning and system building. My focus now includes AI workflows, content coordination, online learning systems and operational structure."}</p></div>
      <div className="profile-lead-responsibilities"><section><span>BRAND / CONTENT</span><p>{cn ? "策划团队大小型活动，输出视觉海报、活动物料与现场传播内容。" : "Plan team events and deliver posters, campaign materials and on-site communication."}</p><p>{cn ? "规划线下展位与宣传内容，负责大型现场拍摄并协调视频、文章与公告输出。" : "Plan offline booths and communication, lead major-event coverage, and coordinate video, articles and announcements."}</p></section><section><span>PLATFORM / TEAM</span><p>{cn ? "从 0 到 1 搭建约 500 人企业微信后台，负责日常管理、维护与 IT 支持。" : "Built a WeCom backend for roughly 500 people from zero, then managed maintenance and IT support."}</p><p>{cn ? "搭建 500+ 同事线上学习体系，整理团队 AI 知识库与工作流程。" : "Built an online learning system for 500+ colleagues and organised the team AI knowledge base and workflows."}</p></section></div>
      <p className="profile-lead-ending">{cn ? "从观察世界，到组织内容，再到搭建系统。" : "From observing the world, to organising content, to building systems."}</p>
    </article>

    <section className="profile-evolution" aria-labelledby="profile-evolution-title"><p>CAPABILITY EVOLUTION</p><h2 id="profile-evolution-title">{cn ? "能力演变路径" : "Capability Evolution"}</h2><div><span>{cn ? "摄影" : "Photography"}</span><i>→</i><span>{cn ? "视觉表达" : "Visual Expression"}</span><i>→</i><span>{cn ? "内容叙事" : "Content Narrative"}</span><i>→</i><span>{cn ? "活动执行" : "Event Execution"}</span><i>→</i><span>{cn ? "品牌运营" : "Brand Operation"}</span><i>→</i><span>{cn ? "团队协同" : "Team Collaboration"}</span><i>→</i><span>{cn ? "系统建设" : "System Building"}</span></div></section>
  </section>;
}
