// uiTheme.js
export const UI = {
  input: `
    w-full p-4 rounded-2xl outline-none text-sm font-medium transition-all
    bg-white text-slate-900 border border-slate-200
    dark:bg-white/5 dark:text-white dark:border-white/5
    focus:bg-slate-50 dark:focus:bg-white/[0.08]
    focus:border-green-500/30
  `,

  card: `
    bg-white/80 dark:bg-transparent
    border border-slate-200 dark:border-white/10
    backdrop-blur-xl
  `,

  label: `
    text-[10px] font-black uppercase tracking-[0.2em]
    text-slate-600 dark:text-slate-400
  `,
};
