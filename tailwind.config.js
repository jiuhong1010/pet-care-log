/**
 * iOS 语义色 / 排版 / 动效的 Tailwind 映射。
 *
 * 关于色值的来源与可靠性：Apple 不公开保证的 hex 值 —— 系统色按 trait environment
 * 自适应。下面的数字来自社区对 UIColor 的逆向测量，多个独立来源（noahgilmore.com、
 * swiftuicolors.com）互相吻合，对 Web 复刻足够，但不是官方规范。
 *
 * 深浅两套通过 CSS 变量在 index.css 里切换，这里只声明变量名，
 * 因为 Tailwind 的 config 是静态的、无法表达「跟随系统」。
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 语义色：值由 CSS 变量提供，随 prefers-color-scheme 切换
        blue: 'rgb(var(--c-blue) / <alpha-value>)',
        green: 'rgb(var(--c-green) / <alpha-value>)',
        red: 'rgb(var(--c-red) / <alpha-value>)',
        orange: 'rgb(var(--c-orange) / <alpha-value>)',
        teal: 'rgb(var(--c-teal) / <alpha-value>)',
        pink: 'rgb(var(--c-pink) / <alpha-value>)',

        // 背景层级（grouped 系列，对应 iOS 设置类界面）
        'bg-grouped': 'rgb(var(--c-bg-grouped) / <alpha-value>)',
        'bg-card': 'rgb(var(--c-bg-card) / <alpha-value>)',
        'bg-elevated': 'rgb(var(--c-bg-elevated) / <alpha-value>)',

        // 文字层级。secondary/tertiary 自带不透明度，故直接给完整 rgba
        label: 'rgb(var(--c-label) / <alpha-value>)',
        'label-2': 'var(--c-label-2)',
        'label-3': 'var(--c-label-3)',
        'label-4': 'var(--c-label-4)',

        // 分隔线与填充
        separator: 'var(--c-separator)',
        'separator-opaque': 'rgb(var(--c-separator-opaque) / <alpha-value>)',
        fill: 'var(--c-fill)',
        'fill-2': 'var(--c-fill-2)',
        'fill-3': 'var(--c-fill-3)',

        gray: {
          DEFAULT: 'rgb(var(--c-gray) / <alpha-value>)',
          3: 'rgb(var(--c-gray-3) / <alpha-value>)',
          4: 'rgb(var(--c-gray-4) / <alpha-value>)',
        },
      },

      fontFamily: {
        // system-ui 已被 Chrome/Safari 支持，-apple-system 保留用于旧 Safari
        sys: [
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'sans-serif',
        ],
        // 圆体：产品名保留一点圆润感（对应 SF Pro Rounded，提醒事项 App 用的那种）
        rounded: [
          'ui-rounded',
          '"SF Pro Rounded"',
          'system-ui',
          '-apple-system',
          '"PingFang SC"',
          'sans-serif',
        ],
      },

      /**
       * Dynamic Type 默认（Large）尺寸，含 leading。
       * 数值来自 Apple HIG 排版规范：largeTitle 34/41、title1 28/34、title2 22/28、
       * title3 20/25、headline 17 semibold/22、body 17/22、callout 16/21、
       * subheadline 15/20、footnote 13/18、caption1 12/16、caption2 11/13。
       */
      fontSize: {
        'large-title': ['34px', { lineHeight: '41px', letterSpacing: '0.011em' }],
        title1: ['28px', { lineHeight: '34px', letterSpacing: '0.007em' }],
        title2: ['22px', { lineHeight: '28px', letterSpacing: '0.013em' }],
        title3: ['20px', { lineHeight: '25px', letterSpacing: '0.019em' }],
        headline: ['17px', { lineHeight: '22px', letterSpacing: '-0.024em' }],
        body: ['17px', { lineHeight: '22px', letterSpacing: '-0.024em' }],
        callout: ['16px', { lineHeight: '21px', letterSpacing: '-0.02em' }],
        subheadline: ['15px', { lineHeight: '20px', letterSpacing: '-0.016em' }],
        footnote: ['13px', { lineHeight: '18px', letterSpacing: '-0.006em' }],
        caption1: ['12px', { lineHeight: '16px', letterSpacing: '0' }],
        caption2: ['11px', { lineHeight: '13px', letterSpacing: '0.006em' }],
      },

      borderRadius: {
        // inset grouped 卡片的默认圆角是 10pt（社区测量，iOS 26 起系统默认为 26）
        card: '10px',
        // 控件与弹层
        control: '12px',
        sheet: '14px',
      },

      spacing: {
        // inset grouped 列表的左右外边距与行内边距
        gutter: '16px',
        // 分隔线的左缩进：与行内文字左对齐
        'sep-inset': '16px',
      },

      minHeight: {
        // HIG 明确的最小可点击尺寸
        tap: '44px',
      },

      transitionTimingFunction: {
        // iOS 的默认缓动更接近这条曲线，比 ease-in-out 更"贴手"
        ios: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'ios-out': 'cubic-bezier(0.32, 0.72, 0, 1)',
      },

      keyframes: {
        'sheet-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'sheet-up': 'sheet-up 0.35s cubic-bezier(0.32, 0.72, 0, 1)',
        'fade-in': 'fade-in 0.25s cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}
