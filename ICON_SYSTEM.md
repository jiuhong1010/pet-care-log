# Icon System: 毛毛档案

界面图标统一使用 `@phosphor-icons/react` 2.1.10，并且只通过 `src/components/UiIcon.tsx` 的语义名称调用。业务组件不直接导入图标库，不再使用手写 SVG 图标。

默认图标使用 `regular` 字重、圆角端点和 `currentColor`。图标本身为装饰性元素并设为 `aria-hidden`；纯图标按钮的可访问名称由外层按钮的 `aria-label` 提供。图标视觉尺寸为 16–34px，交互热区仍保持至少 44×44px。

| glyph | 用途 | Phosphor 名称 | size | weight | 容器 / 状态 | 可访问名称来源 |
| --- | --- | --- | --- | --- | --- | --- |
| paw | 产品标记、欢迎区 | PawPrint | 21 / 42 | regular | 品牌标记 / 欢迎符号 | 周边真实文字 |
| settings | 打开设置 | SlidersHorizontal | 22 | regular | 44×44 按钮 | `aria-label="设置"` |
| plus | 新增宠物、记录 | Plus | 16–19 | regular | 44px 按钮 | 按钮文字或 `aria-label` |
| syringe | 疫苗、疫苗驱虫入口 | Syringe | 20 / 34 | regular | 快捷入口 / 空状态 | 周边真实文字 |
| pill | 驱虫、用药 | Pill | 20 / 34 | regular | 快捷入口 / 记录行 | 周边真实文字 |
| chart | 体重趋势 | ChartLineUp | 20 / 34 | regular | 快捷入口 / 空状态 | 周边真实文字 |
| medicalKit | 就诊记录 | FirstAidKit | 19–34 | regular | 快捷入口 / 记录行 | 周边真实文字 |
| clock | 临近到期 | Clock | 19 / 20 | regular | 状态标识 | 同行状态文字 |
| warning | 已逾期 | WarningCircle | 20 | regular | 状态标识 | 同行状态文字 |
| check | 状态正常 | Check | 19 / 22 | regular | 状态标识 | 同行状态文字 |
| trash | 删除记录或宠物 | Trash | 19 / 20 | regular | 44×44 按钮 | 对象化 `aria-label` |
| close | 关闭弹层 | X | 20 | regular | 44×44 按钮 | `aria-label="关闭"` |
| download | 导出备份 | DownloadSimple | 16 / 20 | regular | 按钮 / 设置行 | 周边真实文字 |
| feedback | 反馈入口 | ChatCircleDots | 20 | regular | 设置行 | 周边真实文字 |

宠物头像是通过 image2 生成的插画图集，属于身份内容资产，不承担设置、导航、状态或快捷操作 glyph 的职责。数据层继续保留原 emoji 值，以兼容已有记录和导入备份。
