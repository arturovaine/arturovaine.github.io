/**
 * CSS optimization templates
 * modular, tailwind, fonts, theme
 */

export const modular = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-neutral-500">/* theme.css - Single entry point */</span>
<span class="text-purple-400">@import</span> <span class="text-green-300">'base.css'</span>;        <span class="text-neutral-500">/* Variables */</span>
<span class="text-purple-400">@import</span> <span class="text-green-300">'buttons.css'</span>;     <span class="text-neutral-500">/* .btn-* */</span>
<span class="text-purple-400">@import</span> <span class="text-green-300">'cards.css'</span>;       <span class="text-neutral-500">/* .card */</span>
<span class="text-purple-400">@import</span> <span class="text-green-300">'modal.css'</span>;       <span class="text-neutral-500">/* .modal */</span>
<span class="text-purple-400">@import</span> <span class="text-green-300">'light-theme.css'</span>; <span class="text-neutral-500">/* Theme */</span></pre>
    </div>
    <table class="w-full text-xs">
      <thead>
        <tr class="text-neutral-500 border-b border-neutral-700">
          <th class="text-left py-1">File</th>
          <th class="text-right py-1">Size</th>
          <th class="text-left py-1 pl-3">Purpose</th>
        </tr>
      </thead>
      <tbody class="text-neutral-400">
        <tr class="border-b border-neutral-800">
          <td class="py-1 text-cyan-400">base.css</td>
          <td class="text-right">2.1 KB</td>
          <td class="pl-3">Variables, reset</td>
        </tr>
        <tr class="border-b border-neutral-800">
          <td class="py-1 text-cyan-400">buttons.css</td>
          <td class="text-right">1.4 KB</td>
          <td class="pl-3">Button variants</td>
        </tr>
        <tr class="border-b border-neutral-800">
          <td class="py-1 text-cyan-400">cards.css</td>
          <td class="text-right">1.8 KB</td>
          <td class="pl-3">Card component</td>
        </tr>
        <tr>
          <td class="py-1 text-cyan-400">light-theme.css</td>
          <td class="text-right">1.2 KB</td>
          <td class="pl-3">Theme overrides</td>
        </tr>
      </tbody>
      <tfoot>
        <tr class="border-t border-neutral-700 text-neutral-300">
          <td class="py-1 font-medium">Total</td>
          <td class="text-right font-medium text-green-400">7.4 KB</td>
          <td></td>
        </tr>
      </tfoot>
    </table>
    <div class="text-xs text-neutral-500 border-l-2 border-orange-500/30 pl-3">
      <strong class="text-neutral-400">Architecture:</strong> Single-responsibility files. No specificity wars.
    </div>
  </div>
`;

export const tailwind = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-pink-400">&lt;script</span> <span class="text-cyan-300">src</span>=<span class="text-green-300">"https://cdn.tailwindcss.com"</span><span class="text-pink-400">&gt;&lt;/script&gt;</span>
<span class="text-pink-400">&lt;script&gt;</span>
tailwind.config = {
  <span class="text-purple-400">theme</span>: {
    <span class="text-purple-400">extend</span>: {
      <span class="text-purple-400">fontFamily</span>: {
        <span class="text-cyan-300">sans</span>: [<span class="text-green-300">'Inter'</span>],
        <span class="text-cyan-300">mono</span>: [<span class="text-green-300">'JetBrains Mono'</span>],
      }
    }
  }
}
<span class="text-pink-400">&lt;/script&gt;</span></pre>
    </div>
    <div class="grid grid-cols-2 gap-3 text-xs">
      <div class="p-3 rounded bg-neutral-800/50">
        <div class="text-green-400 font-medium mb-2">CDN Pros</div>
        <ul class="space-y-1 text-neutral-500">
          <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Zero build</li>
          <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Browser-cached</li>
          <li class="flex items-center gap-2"><span class="text-green-400">✓</span> All utilities</li>
        </ul>
      </div>
      <div class="p-3 rounded bg-neutral-800/50">
        <div class="text-yellow-400 font-medium mb-2">Tradeoffs</div>
        <ul class="space-y-1 text-neutral-500">
          <li class="flex items-center gap-2"><span class="text-yellow-400">△</span> 110KB runtime</li>
          <li class="flex items-center gap-2"><span class="text-yellow-400">△</span> JIT in browser</li>
          <li class="flex items-center gap-2"><span class="text-yellow-400">△</span> No purge</li>
        </ul>
      </div>
    </div>
    <div class="text-xs text-neutral-500 border-l-2 border-orange-500/30 pl-3">
      <strong class="text-neutral-400">Use case:</strong> Perfect for portfolios and prototypes.
    </div>
  </div>
`;

export const fonts = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-pink-400">&lt;link</span> <span class="text-cyan-300">rel</span>=<span class="text-green-300">"preconnect"</span> <span class="text-cyan-300">href</span>=<span class="text-green-300">"https://fonts.googleapis.com"</span><span class="text-pink-400">&gt;</span>
<span class="text-pink-400">&lt;link</span> <span class="text-cyan-300">href</span>=<span class="text-green-300">"...?family=Inter&<span class="text-amber-400">display=swap</span>"</span> <span class="text-cyan-300">rel</span>=<span class="text-green-300">"stylesheet"</span><span class="text-pink-400">&gt;</span>

<span class="text-purple-400">@font-face</span> {
<span class="text-cyan-300">font-family</span>: <span class="text-green-300">'Inter'</span>;
<span class="text-cyan-300">font-display</span>: <span class="text-green-300">swap</span>;  <span class="text-neutral-500">/* Key! */</span>
}</pre>
    </div>
    <div class="grid grid-cols-3 gap-2 text-xs text-center">
      <div class="p-2 rounded bg-red-500/10 border border-red-500/20">
        <div class="text-red-400 font-medium">block</div>
        <div class="text-neutral-600 text-[10px]">FOIT: Invisible</div>
      </div>
      <div class="p-2 rounded bg-green-500/10 border border-green-500/20">
        <div class="text-green-400 font-medium">swap</div>
        <div class="text-neutral-600 text-[10px]">FOUT: System → swap</div>
      </div>
      <div class="p-2 rounded bg-blue-500/10 border border-blue-500/20">
        <div class="text-blue-400 font-medium">optional</div>
        <div class="text-neutral-600 text-[10px]">May skip</div>
      </div>
    </div>
    <div class="p-3 rounded bg-neutral-800/50 text-xs">
      <div class="text-neutral-400 mb-2">Timeline:</div>
      <div class="flex items-center gap-1">
        <div class="h-3 w-12 bg-neutral-600 rounded-l flex items-center justify-center text-[9px]">system</div>
        <div class="h-3 w-4 bg-amber-500/50 rounded text-[9px]">↻</div>
        <div class="h-3 flex-1 bg-green-500/30 rounded-r flex items-center justify-center text-[9px] text-green-300">Inter</div>
      </div>
    </div>
    <div class="text-xs text-neutral-500 border-l-2 border-orange-500/30 pl-3">
      <strong class="text-neutral-400">FOUT &gt; FOIT:</strong> Show content immediately, swap fonts when ready.
    </div>
  </div>
`;

export const theme = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-neutral-500">&lt;!-- In &lt;head&gt; BEFORE CSS --&gt;</span>
<span class="text-pink-400">&lt;script&gt;</span>
(<span class="text-cyan-300">function</span>() {
  <span class="text-cyan-300">const</span> saved = localStorage.getItem(<span class="text-green-300">'theme'</span>);
  <span class="text-cyan-300">const</span> prefersDark = matchMedia(<span class="text-green-300">'(prefers-color-scheme: dark)'</span>).matches;

  <span class="text-cyan-300">if</span> (saved === <span class="text-green-300">'light'</span> || (!saved && !prefersDark)) {
    document.documentElement.classList.add(<span class="text-green-300">'light-theme'</span>);
  }
})();
<span class="text-pink-400">&lt;/script&gt;</span></pre>
    </div>
    <div class="grid grid-cols-2 gap-3 text-xs">
      <div class="p-2 rounded bg-red-500/10 border border-red-500/20">
        <div class="text-red-400 font-medium mb-1">Without script</div>
        <div class="flex items-center gap-1">
          <div class="h-2 w-8 bg-white rounded"></div>
          <div class="h-2 w-4 bg-red-400 rounded animate-pulse"></div>
          <div class="h-2 w-12 bg-neutral-800 rounded"></div>
        </div>
        <div class="text-neutral-600 mt-1">Flash of wrong theme</div>
      </div>
      <div class="p-2 rounded bg-green-500/10 border border-green-500/20">
        <div class="text-green-400 font-medium mb-1">With script</div>
        <div class="flex items-center gap-1">
          <div class="h-2 flex-1 bg-neutral-800 rounded"></div>
        </div>
        <div class="text-neutral-600 mt-1">Correct immediately</div>
      </div>
    </div>
    <div class="text-xs text-neutral-500 border-l-2 border-orange-500/30 pl-3">
      <strong class="text-neutral-400">Critical:</strong> Must run before CSS loads. Respects <code class="text-cyan-400">prefers-color-scheme</code>.
    </div>
  </div>
`;
