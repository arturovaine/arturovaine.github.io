/**
 * Rendering optimization templates
 * skeleton, aspect, contain, gpu
 */

export const skeleton = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-pink-400">&lt;div</span> <span class="text-cyan-300">class</span>=<span class="text-green-300">"skeleton-card"</span><span class="text-pink-400">&gt;</span>
<span class="text-pink-400">&lt;div</span> <span class="text-cyan-300">class</span>=<span class="text-green-300">"skeleton-image animate-pulse"</span><span class="text-pink-400">&gt;&lt;/div&gt;</span>
<span class="text-pink-400">&lt;div</span> <span class="text-cyan-300">class</span>=<span class="text-green-300">"skeleton-text animate-pulse"</span><span class="text-pink-400">&gt;&lt;/div&gt;</span>
<span class="text-pink-400">&lt;/div&gt;</span>

<span class="text-purple-400">.skeleton-text</span> {
<span class="text-cyan-300">background</span>: <span class="text-green-300">linear-gradient(90deg, #262626 25%, #3d3d3d 50%, #262626 75%)</span>;
<span class="text-cyan-300">background-size</span>: <span class="text-orange-300">200% 100%</span>;
<span class="text-cyan-300">animation</span>: <span class="text-green-300">shimmer 1.5s infinite</span>;
}</pre>
    </div>
    <div class="flex items-center gap-4 p-3 rounded bg-neutral-800/50">
      <div class="flex-1 space-y-2">
        <div class="h-4 bg-neutral-700 rounded animate-pulse"></div>
        <div class="h-4 bg-neutral-700 rounded animate-pulse w-3/4"></div>
        <div class="h-4 bg-neutral-700 rounded animate-pulse w-1/2"></div>
      </div>
      <div class="text-xs text-neutral-500 shrink-0">← Live</div>
    </div>
    <div class="text-xs text-neutral-500 border-l-2 border-cyan-500/30 pl-3">
      <strong class="text-neutral-400">CLS Prevention:</strong> Skeletons maintain exact dimensions. Zero layout shift.
    </div>
  </div>
`;

export const aspect = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-neutral-500">&lt;!-- Without aspect ratio --&gt;</span>
<span class="text-pink-400">&lt;img</span> <span class="text-cyan-300">src</span>=<span class="text-green-300">"photo.webp"</span> <span class="text-pink-400">/&gt;</span>  <span class="text-red-400">/* ❌ CLS */</span>

<span class="text-neutral-500">&lt;!-- With Tailwind aspect-ratio --&gt;</span>
<span class="text-pink-400">&lt;div</span> <span class="text-cyan-300">class</span>=<span class="text-green-300">"aspect-video"</span><span class="text-pink-400">&gt;</span>
<span class="text-pink-400">&lt;img</span> <span class="text-cyan-300">class</span>=<span class="text-green-300">"object-cover w-full h-full"</span> <span class="text-pink-400">/&gt;</span>
<span class="text-pink-400">&lt;/div&gt;</span>  <span class="text-green-400">/* ✓ CLS = 0 */</span>

<span class="text-purple-400">.aspect-video</span>  { <span class="text-cyan-300">aspect-ratio</span>: <span class="text-orange-300">16/9</span>; }
<span class="text-purple-400">.aspect-square</span> { <span class="text-cyan-300">aspect-ratio</span>: <span class="text-orange-300">1/1</span>; }</pre>
    </div>
    <div class="grid grid-cols-2 gap-3 text-xs text-center">
      <div class="p-3 rounded bg-red-500/10 border border-red-500/20">
        <div class="text-red-400 font-bold text-lg">0.25</div>
        <div class="text-neutral-500">CLS without</div>
        <div class="text-red-400 text-[10px]">Poor (&gt;0.1)</div>
      </div>
      <div class="p-3 rounded bg-green-500/10 border border-green-500/20">
        <div class="text-green-400 font-bold text-lg">0.00</div>
        <div class="text-neutral-500">CLS with</div>
        <div class="text-green-400 text-[10px]">Good (&lt;0.1)</div>
      </div>
    </div>
    <div class="text-xs text-neutral-500 border-l-2 border-cyan-500/30 pl-3">
      <strong class="text-neutral-400">Core Web Vitals:</strong> CLS is a Google ranking factor.
    </div>
  </div>
`;

export const contain = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-purple-400">.card</span> {
<span class="text-cyan-300">contain</span>: <span class="text-green-300">layout style paint</span>;
<span class="text-cyan-300">content-visibility</span>: <span class="text-green-300">auto</span>;
}

<span class="text-purple-400">.project-grid-item</span> {
<span class="text-cyan-300">contain</span>: <span class="text-green-300">strict</span>;
<span class="text-cyan-300">contain-intrinsic-size</span>: <span class="text-orange-300">0 300px</span>;
}</pre>
    </div>
    <div class="grid grid-cols-2 gap-2 text-xs">
      <div class="p-2 rounded bg-neutral-800/50">
        <div class="text-cyan-400 font-medium">layout</div>
        <div class="text-neutral-500">Isolated layout changes</div>
      </div>
      <div class="p-2 rounded bg-neutral-800/50">
        <div class="text-purple-400 font-medium">paint</div>
        <div class="text-neutral-500">Own paint boundary</div>
      </div>
      <div class="p-2 rounded bg-neutral-800/50">
        <div class="text-green-400 font-medium">style</div>
        <div class="text-neutral-500">Scoped style recalc</div>
      </div>
      <div class="p-2 rounded bg-neutral-800/50">
        <div class="text-orange-400 font-medium">content-visibility</div>
        <div class="text-neutral-500">Skip offscreen</div>
      </div>
    </div>
    <div class="text-xs text-neutral-500 border-l-2 border-cyan-500/30 pl-3">
      <strong class="text-neutral-400">Gain:</strong> Up to 90% reduction in reflow time.
    </div>
  </div>
`;

export const gpu = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-red-400">/* ❌ AVOID: Triggers layout */</span>
<span class="text-purple-400">.bad</span> { <span class="text-cyan-300">transition</span>: <span class="text-green-300">top 0.3s, left 0.3s</span>; }

<span class="text-green-400">/* ✓ GPU-accelerated */</span>
<span class="text-purple-400">.good</span> {
<span class="text-cyan-300">transition</span>: <span class="text-green-300">transform 0.3s, opacity 0.3s</span>;
<span class="text-cyan-300">will-change</span>: <span class="text-green-300">transform</span>;
}

<span class="text-purple-400">.card</span>:hover {
<span class="text-cyan-300">transform</span>: <span class="text-green-300">scale(1.02) translateY(-2px)</span>;
}</pre>
    </div>
    <div class="grid grid-cols-2 gap-3 text-xs">
      <div class="p-2 rounded bg-red-500/10 border border-red-500/20 text-center">
        <div class="text-red-400 font-medium mb-1">Main Thread</div>
        <div class="text-neutral-500">top, left, width, margin</div>
        <div class="text-red-400 mt-1">~16ms budget</div>
      </div>
      <div class="p-2 rounded bg-green-500/10 border border-green-500/20 text-center">
        <div class="text-green-400 font-medium mb-1">GPU</div>
        <div class="text-neutral-500">transform, opacity</div>
        <div class="text-green-400 mt-1">60fps</div>
      </div>
    </div>
    <div class="text-xs text-neutral-500 border-l-2 border-cyan-500/30 pl-3">
      <strong class="text-neutral-400">Warning:</strong> <code class="text-cyan-400">will-change</code> uses VRAM. Use sparingly.
    </div>
  </div>
`;
