---
name: 毛毛档案
description: 温暖、可靠、轻松的宠物健康记录工具
colors:
  care-teal: "#1A7580"
  care-deep: "#0E4A56"
  sea-glass: "#DDF5F0"
  sky-wash: "#E1F3F7"
  sun-node: "#F9D361"
  reassurance-green: "#1D7E5D"
  attention-amber: "#B86711"
  urgent-red: "#B73E35"
  grouped-background: "#F7FBFA"
  clean-surface: "#FFFFFF"
  primary-ink: "#1C1C23"
  secondary-ink: "#5F606E"
  quiet-fill: "#ECECF3"
  separator: "#DFE0E8"
typography:
  display:
    fontFamily: "ui-rounded, SF Pro Rounded, system-ui, PingFang SC, sans-serif"
    fontSize: "34px"
    fontWeight: 700
    lineHeight: 1.205
    letterSpacing: "0.011em"
  title:
    fontFamily: "system-ui, SF Pro Text, PingFang SC, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.25
  body:
    fontFamily: "system-ui, SF Pro Text, PingFang SC, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.294
    letterSpacing: "-0.024em"
  label:
    fontFamily: "system-ui, SF Pro Text, PingFang SC, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.333
rounded:
  card: "14px"
  control: "11px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  tap: "44px"
components:
  button-primary:
    backgroundColor: "{colors.care-teal}"
    textColor: "{colors.clean-surface}"
    rounded: "{rounded.control}"
    padding: "11px 16px"
    height: "44px"
  button-quiet:
    backgroundColor: "{colors.quiet-fill}"
    textColor: "{colors.care-teal}"
    rounded: "{rounded.control}"
    padding: "11px 16px"
    height: "44px"
  card-group:
    backgroundColor: "{colors.clean-surface}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.card}"
    padding: "16px"
  input-boxed:
    backgroundColor: "{colors.quiet-fill}"
    textColor: "{colors.primary-ink}"
    rounded: "{rounded.control}"
    padding: "10px 14px"
---

# Design System: 毛毛档案

## 1. Overview

**Creative North Star: "安静的照护台"**

界面像家中一个随手可用、始终整洁的照护位置：重要日期放在最容易看见的地方，记录工具伸手可得，历史信息则保持安静。它应该清楚、亲近、克制，让用户感到事情已被理顺，而不是被健康提醒追着走。

系统以熟悉的移动端交互为基础，但拒绝照搬 iOS 设置页。视觉身份来自稳定的信息层级、亲和的状态语言与少量有意义的色彩，不来自满屏灰白卡片、装饰性阴影或卖萌元素。

**Key Characteristics:**

- 任务优先、历史退后
- 单手可完成的紧凑操作
- 高对比、低压力的状态表达
- 熟悉而不仿制系统界面
- 深浅模式保持相同的信息层级

## 2. Colors

海玻璃青负责主动作和照护路径，深青色建立可信锚点，日光黄只标记下一件要做的事，安心绿负责完成与稳定状态，橙红只在真正需要行动时出现；云白和白色承担绝大多数表面。

### Primary

- **海玻璃青**：主操作、当前选择、链接与焦点，不用于大面积装饰。
- **照护深靛**：欢迎区和宠物状态区的稳定背景，用来形成产品识别。

### Secondary

- **安心绿**：完成、正常和体重趋势图，表达放心而非奖励。
- **关注琥珀**：近期到期与轻度警示，只在需要用户采取行动时使用。

### Tertiary

- **紧急红**：逾期、保存失败与破坏性操作，禁止作为品牌装饰色。

### Neutral

- **晨雾底色**：页面底层，承接内容而不与卡片竞争。
- **洁净表面**：记录组、表单与弹层的主要内容表面。
- **主墨色**：标题、正文和关键数值。
- **次级墨色**：辅助日期、说明和次级标签。
- **安静填充**：输入、分段控件和未选中标签的轻量背景。

**The One Voice Rule.** 可信靛蓝只服务交互和当前状态；深靛品牌块只出现在顶层身份区域，避免全页泛滥。

**The Calm Alert Rule.** 橙色和红色必须伴随文字或图标，永远不能只靠颜色表达状态。

## 3. Typography

**Display Font:** SF Pro Rounded / ui-rounded（系统圆体回退）

**Body Font:** system-ui / SF Pro Text / PingFang SC

**Character:** 单一系统字体家族保证中文和数字清楚稳定，仅在产品名上保留轻微圆润感。数字、日期和单位必须比装饰性标题更值得注意。

### Hierarchy

- **Display**（700，34px，41px）：仅用于产品名和顶层页面标题。
- **Headline**（600，17px，22px）：弹层标题和关键行标题。
- **Title**（600，20px，25px）：宠物名称和主要分区标题。
- **Body**（400，17px，22px）：记录、表单和说明正文；长文本限制在 70ch 内。
- **Label**（500，15px，20px）：按钮、筛选和紧凑状态标签，不使用全大写或夸张字距。

**The Data Reads First Rule.** 日期、体重和状态必须使用清晰的字重与等宽数字；产品名不能抢走任务信息的注意力。

## 4. Elevation

系统以色调分层为主，静止状态不使用装饰性投影。卡片通过表面与页面背景的明度差建立层级；阴影只允许用于选中控件或正在浮起的弹层，并保持短、清晰、低模糊。

### Shadow Vocabulary

- **选中抬升**（`0 1px 3px rgba(0,0,0,0.10)`）：仅用于分段控件的当前项。
- **弹层分离**（`0 8px 24px rgba(0,0,0,0.16)`）：仅用于桌面居中的活动弹层，不与装饰边框叠加。

**The Flat-by-Default Rule.** 表面在静止时保持平坦；如果所有卡片都浮起来，信息层级已经失败。

## 5. Components

### Buttons

- **Shape:** 稳定的轻弧矩形（12px），主要点击高度至少 44px。
- **Primary:** 可信靛蓝底配洁净白字，横向内边距 16px，只用于当前流程最重要的动作。
- **Hover / Focus:** 桌面悬停略微加深；键盘焦点使用清晰的 2px 外环；按下只做短暂明度变化。
- **Secondary / Ghost:** 安静填充或无底色，仍保持完整点击面积，不用低对比灰字伪装禁用状态。

### Chips

- **Style:** 全圆角、小面积安静填充；文字保持 15px 与中等字重。
- **State:** 选中使用可信靛蓝底和白字，未选中使用中性色；状态同时由 `aria-pressed` 表达。

### Cards / Containers

- **Corner Style:** 轻微圆角（14px），不超过 16px。
- **Background:** 洁净表面置于晨雾底色之上，配 1px 安静分隔线。
- **Shadow Strategy:** 默认无阴影，依靠色调差分层。
- **Border:** 统一使用 1px 低对比分隔线维持边界，不叠加装饰性阴影。
- **Internal Padding:** 主要内容 16px；紧凑列表行保持至少 44px 高度。

### Inputs / Fields

- **Style:** 透明行内输入或安静填充的独立输入，12px 圆角，文字不小于 16px。
- **Focus:** 2px 可信靛蓝焦点环，不通过阴影制造漂浮感。
- **Error / Disabled:** 错误同时显示明确文案；禁用态仍需满足可读对比度。

### Navigation

顶部只承载产品名、照护承诺和设置入口；宠物切换紧随其后，当前选择以可信靛蓝与明确状态标识表达。移动端保持单行可滚动宠物切换，不自定义滚动条样式。

### Icons

所有界面 glyph 统一使用 Phosphor Icons 的 `regular` 字重，并通过 `UiIcon` 语义入口调用。业务组件禁止直接导入图标库、手写小型 SVG 或使用位图充当按钮图标。图标尺寸与点击热区分离：glyph 通常为 16–22px，空状态可放大至 34px，交互区域始终至少 44×44px。

### Pet Portraits

宠物头像是身份内容而非界面 glyph，使用十张独立透明 PNG。每张素材采用相同的 256×256 画布、210px 主体视觉高度和统一底部基线，从资产层消除串格、裁剪差异与上下跳动。界面统一套用约 5:6 的竖向圆角框：主状态区采用 90×108px（桌面 100×120px），切换器使用 28×34px 缩略图，选择器使用 74×88px 预览；所有选择项始终显示同样的边框，选中态仅改变边框颜色。已有数据仍保存原 emoji 值，仅在显示层映射为独立肖像，保证旧记录和备份兼容。

### Care Hero, Timeline & Visit Pack

当前宠物和 30 天照护状态先出现，但不再用整块深色抢走首屏。下方只有一个主动作「记下刚刚的变化」，把食欲、精神、呕吐、排便、排尿、呼吸、疼痛和自定义观察接入照护事件。时间线用一条克制的弯曲路径连接节点，看诊包默认收起，展开后按「发生了什么、现在怎样、正在使用什么、想问什么」组织资料。疫苗、体重、用药和就诊进入明确的「记录其他照护」菜单，避免四个等权按钮。

### Care mascot

首次使用页使用 `src/assets/generated/care-mascot.png`：透明背景、橘猫与薄荷色看诊包，作为产品叙事资产而不是按钮或图标。功能性 glyph 继续统一从 `UiIcon` 调用，用户宠物头像仍使用十张独立透明肖像，避免圆形裁剪损失细节。

### Due Status Row

到期行是系统的签名组件：左侧图标与状态词解释紧迫性，中间给出项目与日期，右侧给出可扫读的剩余时间。红橙状态永远搭配文字，不让颜色独自承担含义。

## 6. Do's and Don'ts

### Do:

- **Do** 先展示“现在需要做什么”，再展示完整历史。
- **Do** 保持主要点击目标至少 44×44px，并为键盘用户提供可见焦点。
- **Do** 用可信靛蓝作为唯一交互主色，并将深靛品牌块限制在顶层身份区域。
- **Do** 用文字、图标和颜色共同表达逾期、近期和完成状态。
- **Do** 在浅色与深色模式中保持相同的信息顺序和对比关系。

### Don't:

- **Don't** “照搬 iOS 设置页”，也不要使用满屏灰白分组卡片和系统控件仿制作为视觉身份。
- **Don't** 做“幼稚、玩具化或过度卡通的宠物 App”，不要依赖大量 emoji 营造可爱。
- **Don't** 做“冷硬的医院后台、密集表格或让用户产生压力的警报墙”。
- **Don't** 使用“玻璃拟态、渐变文字、巨大圆角、同质卡片网格和无意义装饰”。
- **Don't** 在卡片上同时使用 1px 边框和大于 8px 模糊的装饰性投影。
- **Don't** 用颜色作为唯一状态信号，或把正文降到 WCAG AA 以下的对比度。
