/**
 * Assets optimization templates
 * webp, cloud, native, svg
 */

export const webp = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-neutral-500"># Conversion command (cwebp)</span>
<span class="text-cyan-300">cwebp</span> -q <span class="text-orange-300">80</span> input.png -o output.webp

<span class="text-neutral-500"># Batch convert all PNGs</span>
<span class="text-cyan-300">for</span> f <span class="text-cyan-300">in</span> *.png; <span class="text-cyan-300">do</span>
cwebp -q <span class="text-orange-300">80</span> <span class="text-green-300">"$f"</span> -o <span class="text-green-300">"\${f%.png}.webp"</span>
<span class="text-cyan-300">done</span></pre>
    </div>
    <table class="w-full text-xs">
      <thead>
        <tr class="text-neutral-500 border-b border-neutral-700">
          <th class="text-left py-1">Image</th>
          <th class="text-right py-1">PNG</th>
          <th class="text-right py-1">WebP</th>
          <th class="text-right py-1">Saved</th>
        </tr>
      </thead>
      <tbody class="text-neutral-400">
        <tr class="border-b border-neutral-800">
          <td class="py-1">hero-bg</td>
          <td class="text-right text-red-400">2.9 MB</td>
          <td class="text-right text-green-400">180 KB</td>
          <td class="text-right text-green-400">94%</td>
        </tr>
        <tr class="border-b border-neutral-800">
          <td class="py-1">project-thumb</td>
          <td class="text-right text-red-400">450 KB</td>
          <td class="text-right text-green-400">45 KB</td>
          <td class="text-right text-green-400">90%</td>
        </tr>
      </tbody>
    </table>
    <div class="flex justify-center gap-6">
      <div class="text-center">
        <div class="text-2xl font-bold text-green-400">~90%</div>
        <div class="text-xs text-neutral-500">avg reduction</div>
      </div>
      <div class="text-center">
        <div class="text-2xl font-bold text-purple-400">q80</div>
        <div class="text-xs text-neutral-500">quality</div>
      </div>
    </div>
  </div>
`;

export const cloud = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-neutral-500">// AwardsRenderer.js</span>
<span class="text-cyan-300">const</span> GCS_BASE = <span class="text-green-300">'https://storage.googleapis.com/arturovaine'</span>;

<span class="text-pink-400">&lt;video</span>
<span class="text-cyan-300">src</span>=<span class="text-green-300">"\${GCS_BASE}/videos/demo.mp4"</span>
<span class="text-cyan-300">preload</span>=<span class="text-green-300">"metadata"</span>
<span class="text-cyan-300">controls</span> <span class="text-cyan-300">playsinline</span>
<span class="text-pink-400">&gt;&lt;/video&gt;</span></pre>
    </div>
    <div class="grid grid-cols-2 gap-3 text-xs">
      <div class="p-3 rounded bg-neutral-800/50">
        <div class="text-red-400 font-medium mb-2">GitHub Pages</div>
        <ul class="space-y-1 text-neutral-500">
          <li class="flex items-center gap-2"><span class="text-red-400">✕</span> 100MB limit</li>
          <li class="flex items-center gap-2"><span class="text-red-400">✕</span> No streaming</li>
        </ul>
      </div>
      <div class="p-3 rounded bg-neutral-800/50">
        <div class="text-green-400 font-medium mb-2">GCS</div>
        <ul class="space-y-1 text-neutral-500">
          <li class="flex items-center gap-2"><span class="text-green-400">✓</span> 5TB limit</li>
          <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Global CDN</li>
        </ul>
      </div>
    </div>
    <div class="text-xs text-neutral-500 border-l-2 border-purple-500/30 pl-3">
      <strong class="text-neutral-400">Cost:</strong> ~$0.02/GB storage. Less than $1/month for portfolio.
    </div>
  </div>
`;

export const native = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-pink-400">&lt;img</span>
<span class="text-cyan-300">src</span>=<span class="text-green-300">"images/project.webp"</span>
<span class="text-cyan-300">loading</span>=<span class="text-green-300">"lazy"</span>       <span class="text-neutral-500">&lt;!-- Browser handles it --&gt;</span>
<span class="text-cyan-300">decoding</span>=<span class="text-green-300">"async"</span>     <span class="text-neutral-500">&lt;!-- Non-blocking --&gt;</span>
<span class="text-cyan-300">width</span>=<span class="text-green-300">"400"</span> <span class="text-cyan-300">height</span>=<span class="text-green-300">"300"</span>  <span class="text-neutral-500">&lt;!-- CLS prevention --&gt;</span>
<span class="text-pink-400">/&gt;</span>

<span class="text-neutral-500">&lt;!-- Critical images --&gt;</span>
<span class="text-pink-400">&lt;img</span> <span class="text-cyan-300">loading</span>=<span class="text-green-300">"eager"</span> <span class="text-cyan-300">fetchpriority</span>=<span class="text-green-300">"high"</span> <span class="text-pink-400">/&gt;</span></pre>
    </div>
    <div class="grid grid-cols-3 gap-2 text-xs text-center">
      <div class="p-2 rounded bg-green-500/10 border border-green-500/20">
        <div class="text-green-400 font-bold">loading=lazy</div>
        <div class="text-neutral-500 mt-1">Defer offscreen</div>
      </div>
      <div class="p-2 rounded bg-blue-500/10 border border-blue-500/20">
        <div class="text-blue-400 font-bold">decoding=async</div>
        <div class="text-neutral-500 mt-1">Non-blocking</div>
      </div>
      <div class="p-2 rounded bg-purple-500/10 border border-purple-500/20">
        <div class="text-purple-400 font-bold">fetchpriority</div>
        <div class="text-neutral-500 mt-1">Network hint</div>
      </div>
    </div>
    <div class="text-xs text-neutral-500 border-l-2 border-purple-500/30 pl-3">
      <strong class="text-neutral-400">Support:</strong> 93%+ global. No JavaScript required.
    </div>
  </div>
`;

export const svg = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-neutral-500">&lt;!-- Declaration --&gt;</span>
<span class="text-pink-400">&lt;i</span> <span class="text-cyan-300">data-lucide</span>=<span class="text-green-300">"zap"</span> <span class="text-cyan-300">class</span>=<span class="text-green-300">"w-5 h-5 text-amber-400"</span><span class="text-pink-400">&gt;&lt;/i&gt;</span>

<span class="text-neutral-500">// Rendered as inline SVG</span>
<span class="text-pink-400">&lt;svg</span> <span class="text-cyan-300">stroke</span>=<span class="text-green-300">"currentColor"</span><span class="text-pink-400">&gt;</span>
<span class="text-pink-400">&lt;polygon</span> <span class="text-cyan-300">points</span>=<span class="text-green-300">"13 2 3 14..."</span><span class="text-pink-400">/&gt;</span>
<span class="text-pink-400">&lt;/svg&gt;</span></pre>
    </div>
    <div class="grid grid-cols-2 gap-3 text-xs">
      <div class="p-3 rounded bg-red-500/10 border border-red-500/20">
        <div class="text-red-400 font-medium mb-2">Icon Fonts</div>
        <ul class="space-y-1 text-neutral-500">
          <li>~150KB font file</li>
          <li>All icons downloaded</li>
          <li>FOIT flash</li>
        </ul>
      </div>
      <div class="p-3 rounded bg-green-500/10 border border-green-500/20">
        <div class="text-green-400 font-medium mb-2">Lucide SVG</div>
        <ul class="space-y-1 text-neutral-500">
          <li>~50KB library</li>
          <li>Tree-shakeable</li>
          <li>CSS color/size</li>
        </ul>
      </div>
    </div>
    <div class="text-xs text-neutral-500 border-l-2 border-purple-500/30 pl-3">
      <strong class="text-neutral-400">Benefit:</strong> <code class="text-cyan-400">currentColor</code> inherits text color.
    </div>
  </div>
`;
