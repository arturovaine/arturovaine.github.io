/**
 * Performance optimization templates
 * Loaded on demand when user clicks a grid item
 */
export const perfTemplates = {
  lazy: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">// ComponentLoader.js - Core lazy loading implementation</span>
<span class="text-cyan-300">const</span> observer = <span class="text-cyan-300">new</span> <span class="text-yellow-300">IntersectionObserver</span>(
  (entries) => {
    entries.<span class="text-yellow-300">forEach</span>(entry => {
      <span class="text-cyan-300">if</span> (entry.isIntersecting) {
        <span class="text-cyan-300">const</span> placeholder = entry.target;
        <span class="text-cyan-300">const</span> componentPath = placeholder.dataset.component;

        <span class="text-neutral-500">// Fetch HTML component</span>
        <span class="text-yellow-300">fetch</span>(<span class="text-green-300">\`components/\${componentPath}.html\`</span>)
          .<span class="text-yellow-300">then</span>(r => r.<span class="text-yellow-300">text</span>())
          .<span class="text-yellow-300">then</span>(html => {
            placeholder.outerHTML = html;
            <span class="text-neutral-500">// Re-initialize icons in new content</span>
            lucide.<span class="text-yellow-300">createIcons</span>();
          });

        observer.<span class="text-yellow-300">unobserve</span>(placeholder); <span class="text-neutral-500">// Stop watching</span>
      }
    });
  },
  {
    <span class="text-purple-400">rootMargin</span>: <span class="text-green-300">'300px'</span>,  <span class="text-neutral-500">// Load 300px before visible</span>
    <span class="text-purple-400">threshold</span>: <span class="text-orange-300">0</span>         <span class="text-neutral-500">// Trigger on any intersection</span>
  }
);</pre>
      </div>
      <div class="grid grid-cols-3 gap-3 text-center text-xs">
        <div class="p-2 rounded bg-blue-500/10 border border-blue-500/20">
          <div class="text-lg font-bold text-blue-400">300px</div>
          <div class="text-neutral-500">rootMargin buffer</div>
        </div>
        <div class="p-2 rounded bg-green-500/10 border border-green-500/20">
          <div class="text-lg font-bold text-green-400">~50ms</div>
          <div class="text-neutral-500">avg load time</div>
        </div>
        <div class="p-2 rounded bg-purple-500/10 border border-purple-500/20">
          <div class="text-lg font-bold text-purple-400">8</div>
          <div class="text-neutral-500">lazy components</div>
        </div>
      </div>
      <div class="text-xs text-neutral-500 border-l-2 border-blue-500/30 pl-3">
        <strong class="text-neutral-400">Why 300px?</strong> Provides enough buffer for slow connections while avoiding unnecessary early loads. Components are ready before user scrolls to them, ensuring zero perceived latency.
      </div>
    </div>
  `,

  priority: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">// ComponentLoader.js - Priority configuration</span>
<span class="text-cyan-300">const</span> PRIORITIES = {
  <span class="text-amber-400">immediate</span>: [<span class="text-green-300">'header'</span>],         <span class="text-neutral-500">// Blocks render</span>
  <span class="text-green-400">critical</span>:  [<span class="text-green-300">'hero'</span>, <span class="text-green-300">'intro'</span>],   <span class="text-neutral-500">// Above the fold</span>
  <span class="text-blue-400">lazy</span>:      [<span class="text-green-300">'projects'</span>, <span class="text-green-300">'awards'</span>, <span class="text-green-300">'experience'</span>...], <span class="text-neutral-500">// IntersectionObserver</span>
  <span class="text-neutral-400">footer</span>:    [<span class="text-green-300">'footer'</span>]           <span class="text-neutral-500">// Load last</span>
};

<span class="text-neutral-500">// Execution order</span>
<span class="text-cyan-300">async function</span> <span class="text-yellow-300">initComponents</span>() {
  <span class="text-cyan-300">await</span> loadImmediate();  <span class="text-neutral-500">// Blocks until done</span>
  loadCritical();         <span class="text-neutral-500">// Non-blocking</span>
  setupLazyObservers();   <span class="text-neutral-500">// IntersectionObserver</span>
  loadFooter();           <span class="text-neutral-500">// Lowest priority</span>
}</pre>
      </div>
      <div class="grid grid-cols-4 gap-2 text-center text-xs">
        <div class="p-2 rounded bg-amber-500/10 border border-amber-500/20">
          <div class="w-3 h-3 rounded-full bg-amber-400 mx-auto mb-1"></div>
          <div class="text-amber-300 font-medium">Immediate</div>
          <div class="text-neutral-500 text-[10px] mt-1">header</div>
          <div class="text-amber-400 text-[10px]">0ms</div>
        </div>
        <div class="p-2 rounded bg-green-500/10 border border-green-500/20">
          <div class="w-3 h-3 rounded-full bg-green-400 mx-auto mb-1"></div>
          <div class="text-green-300 font-medium">Critical</div>
          <div class="text-neutral-500 text-[10px] mt-1">hero, intro</div>
          <div class="text-green-400 text-[10px]">~100ms</div>
        </div>
        <div class="p-2 rounded bg-blue-500/10 border border-blue-500/20">
          <div class="w-3 h-3 rounded-full bg-blue-400 mx-auto mb-1"></div>
          <div class="text-blue-300 font-medium">Lazy</div>
          <div class="text-neutral-500 text-[10px] mt-1">projects, awards...</div>
          <div class="text-blue-400 text-[10px]">on scroll</div>
        </div>
        <div class="p-2 rounded bg-neutral-500/10 border border-neutral-500/20">
          <div class="w-3 h-3 rounded-full bg-neutral-400 mx-auto mb-1"></div>
          <div class="text-neutral-300 font-medium">Footer</div>
          <div class="text-neutral-500 text-[10px] mt-1">footer</div>
          <div class="text-neutral-400 text-[10px]">last</div>
        </div>
      </div>
      <div class="text-xs text-neutral-500 border-l-2 border-green-500/30 pl-3">
        <strong class="text-neutral-400">Result:</strong> First Contentful Paint (FCP) happens in &lt;500ms because only critical components block initial render. Non-critical content loads progressively as user scrolls.
      </div>
    </div>
  `,

  prefetch: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">&lt;!-- index.html &lt;head&gt; - Connection hints --&gt;</span>

<span class="text-neutral-500">&lt;!-- DNS Prefetch: Resolve domain names early --&gt;</span>
<span class="text-pink-400">&lt;link</span> <span class="text-cyan-300">rel</span>=<span class="text-green-300">"dns-prefetch"</span> <span class="text-cyan-300">href</span>=<span class="text-green-300">"//fonts.googleapis.com"</span><span class="text-pink-400">&gt;</span>
<span class="text-pink-400">&lt;link</span> <span class="text-cyan-300">rel</span>=<span class="text-green-300">"dns-prefetch"</span> <span class="text-cyan-300">href</span>=<span class="text-green-300">"//cdn.tailwindcss.com"</span><span class="text-pink-400">&gt;</span>
<span class="text-pink-400">&lt;link</span> <span class="text-cyan-300">rel</span>=<span class="text-green-300">"dns-prefetch"</span> <span class="text-cyan-300">href</span>=<span class="text-green-300">"//unpkg.com"</span><span class="text-pink-400">&gt;</span>

<span class="text-neutral-500">&lt;!-- Preconnect: DNS + TCP + TLS handshake --&gt;</span>
<span class="text-pink-400">&lt;link</span> <span class="text-cyan-300">rel</span>=<span class="text-green-300">"preconnect"</span> <span class="text-cyan-300">href</span>=<span class="text-green-300">"https://fonts.gstatic.com"</span> <span class="text-cyan-300">crossorigin</span><span class="text-pink-400">&gt;</span>
<span class="text-pink-400">&lt;link</span> <span class="text-cyan-300">rel</span>=<span class="text-green-300">"preconnect"</span> <span class="text-cyan-300">href</span>=<span class="text-green-300">"https://storage.googleapis.com"</span><span class="text-pink-400">&gt;</span></pre>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="p-3 rounded bg-neutral-800/50 text-xs">
          <div class="text-neutral-400 font-medium mb-2">dns-prefetch</div>
          <div class="flex items-center gap-2">
            <span class="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">DNS</span>
            <span class="text-neutral-600">→ ~20-120ms saved</span>
          </div>
        </div>
        <div class="p-3 rounded bg-neutral-800/50 text-xs">
          <div class="text-neutral-400 font-medium mb-2">preconnect</div>
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">DNS</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">TCP</span>
            <span class="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400">TLS</span>
            <span class="text-neutral-600">→ ~100-500ms saved</span>
          </div>
        </div>
      </div>
      <div class="text-xs text-neutral-500 border-l-2 border-blue-500/30 pl-3">
        <strong class="text-neutral-400">Performance impact:</strong> Eliminates connection latency for critical third-party resources. When fonts.gstatic.com is requested, the connection is already warm.
      </div>
    </div>
  `,

  defer: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">&lt;!-- index.html - Script loading strategy --&gt;</span>

<span class="text-neutral-500">&lt;!-- ES Modules: Deferred by default, parsed in parallel --&gt;</span>
<span class="text-pink-400">&lt;script</span> <span class="text-cyan-300">type</span>=<span class="text-green-300">"module"</span> <span class="text-cyan-300">src</span>=<span class="text-green-300">"js/main.js"</span><span class="text-pink-400">&gt;&lt;/script&gt;</span>

<span class="text-neutral-500">&lt;!-- CDN scripts with async: Non-blocking --&gt;</span>
<span class="text-pink-400">&lt;script</span> <span class="text-cyan-300">src</span>=<span class="text-green-300">"cdn.tailwindcss.com"</span> <span class="text-cyan-300">async</span><span class="text-pink-400">&gt;&lt;/script&gt;</span>
<span class="text-pink-400">&lt;script</span> <span class="text-cyan-300">src</span>=<span class="text-green-300">"unpkg.com/lucide"</span> <span class="text-cyan-300">defer</span><span class="text-pink-400">&gt;&lt;/script&gt;</span></pre>
      </div>
      <div class="grid grid-cols-3 gap-2 text-xs">
        <div class="p-2 rounded bg-neutral-800/50">
          <div class="text-red-400 font-medium mb-1">Regular</div>
          <div class="flex gap-0.5">
            <div class="h-2 w-8 bg-red-500/50 rounded-l"></div>
            <div class="h-2 w-4 bg-red-500/80 rounded-r" title="Blocks HTML parsing"></div>
          </div>
          <div class="text-neutral-600 mt-1">Blocks parsing</div>
        </div>
        <div class="p-2 rounded bg-neutral-800/50">
          <div class="text-yellow-400 font-medium mb-1">async</div>
          <div class="flex gap-0.5">
            <div class="h-2 w-8 bg-yellow-500/50 rounded-l"></div>
            <div class="h-2 w-4 bg-yellow-500/80 rounded-r"></div>
          </div>
          <div class="text-neutral-600 mt-1">Runs when ready</div>
        </div>
        <div class="p-2 rounded bg-neutral-800/50">
          <div class="text-green-400 font-medium mb-1">defer / module</div>
          <div class="flex gap-0.5">
            <div class="h-2 w-8 bg-green-500/30 rounded"></div>
            <div class="h-2 w-4 bg-green-500/80 rounded"></div>
          </div>
          <div class="text-neutral-600 mt-1">After DOM ready</div>
        </div>
      </div>
      <div class="text-xs text-neutral-500 border-l-2 border-blue-500/30 pl-3">
        <strong class="text-neutral-400">Key insight:</strong> <code class="text-cyan-400">type="module"</code> scripts are deferred automatically, maintain execution order, and enable ES6 imports without bundlers.
      </div>
    </div>
  `,

  webp: `
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
            <th class="text-left py-1 font-medium">Image</th>
            <th class="text-right py-1 font-medium">PNG</th>
            <th class="text-right py-1 font-medium">WebP</th>
            <th class="text-right py-1 font-medium">Saved</th>
          </tr>
        </thead>
        <tbody class="text-neutral-400">
          <tr class="border-b border-neutral-800">
            <td class="py-1">hero-bg.png</td>
            <td class="text-right text-red-400">2.9 MB</td>
            <td class="text-right text-green-400">180 KB</td>
            <td class="text-right text-green-400">94%</td>
          </tr>
          <tr class="border-b border-neutral-800">
            <td class="py-1">project-thumb.png</td>
            <td class="text-right text-red-400">450 KB</td>
            <td class="text-right text-green-400">45 KB</td>
            <td class="text-right text-green-400">90%</td>
          </tr>
          <tr>
            <td class="py-1">avatar.png</td>
            <td class="text-right text-red-400">120 KB</td>
            <td class="text-right text-green-400">18 KB</td>
            <td class="text-right text-green-400">85%</td>
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
          <div class="text-xs text-neutral-500">quality setting</div>
        </div>
      </div>
    </div>
  `,

  cloud: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">// AwardsRenderer.js - Video source configuration</span>
<span class="text-cyan-300">const</span> GCS_BASE = <span class="text-green-300">'https://storage.googleapis.com/arturovaine'</span>;

<span class="text-cyan-300">const</span> videoSources = {
  award_1: <span class="text-green-300">\`\${GCS_BASE}/videos/hackathon-demo.mp4\`</span>,
  award_2: <span class="text-green-300">\`\${GCS_BASE}/videos/startup-pitch.mp4\`</span>,
};

<span class="text-neutral-500">// HTML5 video with streaming</span>
<span class="text-pink-400">&lt;video</span>
  <span class="text-cyan-300">src</span>=<span class="text-green-300">"\${videoSources.award_1}"</span>
  <span class="text-cyan-300">preload</span>=<span class="text-green-300">"metadata"</span>   <span class="text-neutral-500">&lt;!-- Only load metadata initially --&gt;</span>
  <span class="text-cyan-300">controls</span>
  <span class="text-cyan-300">playsinline</span>
<span class="text-pink-400">&gt;&lt;/video&gt;</span></pre>
      </div>
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded bg-neutral-800/50">
          <div class="text-red-400 font-medium mb-2">GitHub Pages</div>
          <ul class="space-y-1 text-neutral-500">
            <li class="flex items-center gap-2"><span class="text-red-400">✕</span> 100MB file limit</li>
            <li class="flex items-center gap-2"><span class="text-red-400">✕</span> No streaming</li>
            <li class="flex items-center gap-2"><span class="text-red-400">✕</span> Single region</li>
          </ul>
        </div>
        <div class="p-3 rounded bg-neutral-800/50">
          <div class="text-green-400 font-medium mb-2">Google Cloud Storage</div>
          <ul class="space-y-1 text-neutral-500">
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> 5TB file limit</li>
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> HTTP Range requests</li>
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Global edge CDN</li>
          </ul>
        </div>
      </div>
      <div class="text-xs text-neutral-500 border-l-2 border-purple-500/30 pl-3">
        <strong class="text-neutral-400">Cost:</strong> ~$0.02/GB storage + $0.12/GB egress. For a portfolio with moderate traffic, this costs less than $1/month while providing enterprise-grade video delivery.
      </div>
    </div>
  `,

  native: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">&lt;!-- ProjectRenderer.js - Image rendering --&gt;</span>
<span class="text-pink-400">&lt;img</span>
  <span class="text-cyan-300">src</span>=<span class="text-green-300">"images/project-\${id}.webp"</span>
  <span class="text-cyan-300">alt</span>=<span class="text-green-300">"\${project.title}"</span>
  <span class="text-cyan-300">loading</span>=<span class="text-green-300">"lazy"</span>       <span class="text-neutral-500">&lt;!-- Browser handles intersection --&gt;</span>
  <span class="text-cyan-300">decoding</span>=<span class="text-green-300">"async"</span>     <span class="text-neutral-500">&lt;!-- Non-blocking decode --&gt;</span>
  <span class="text-cyan-300">width</span>=<span class="text-green-300">"400"</span>          <span class="text-neutral-500">&lt;!-- Intrinsic size for CLS --&gt;</span>
  <span class="text-cyan-300">height</span>=<span class="text-green-300">"300"</span>
  <span class="text-cyan-300">class</span>=<span class="text-green-300">"object-cover w-full h-full"</span>
<span class="text-pink-400">/&gt;</span>

<span class="text-neutral-500">&lt;!-- For critical above-fold images --&gt;</span>
<span class="text-pink-400">&lt;img</span>
  <span class="text-cyan-300">src</span>=<span class="text-green-300">"hero.webp"</span>
  <span class="text-cyan-300">loading</span>=<span class="text-green-300">"eager"</span>      <span class="text-neutral-500">&lt;!-- Load immediately --&gt;</span>
  <span class="text-cyan-300">fetchpriority</span>=<span class="text-green-300">"high"</span>  <span class="text-neutral-500">&lt;!-- Prioritize in network queue --&gt;</span>
<span class="text-pink-400">/&gt;</span></pre>
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
        <strong class="text-neutral-400">Browser support:</strong> 93%+ global coverage. Native lazy loading has ~200px threshold (browser-determined) and requires no JavaScript. Falls back gracefully.
      </div>
    </div>
  `,

  svg: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">&lt;!-- Declaration in HTML --&gt;</span>
<span class="text-pink-400">&lt;i</span> <span class="text-cyan-300">data-lucide</span>=<span class="text-green-300">"zap"</span> <span class="text-cyan-300">class</span>=<span class="text-green-300">"w-5 h-5 text-amber-400"</span><span class="text-pink-400">&gt;&lt;/i&gt;</span>

<span class="text-neutral-500">// After lucide.createIcons() - Rendered as:</span>
<span class="text-pink-400">&lt;svg</span>
  <span class="text-cyan-300">xmlns</span>=<span class="text-green-300">"http://www.w3.org/2000/svg"</span>
  <span class="text-cyan-300">width</span>=<span class="text-green-300">"24"</span> <span class="text-cyan-300">height</span>=<span class="text-green-300">"24"</span>
  <span class="text-cyan-300">viewBox</span>=<span class="text-green-300">"0 0 24 24"</span>
  <span class="text-cyan-300">fill</span>=<span class="text-green-300">"none"</span>
  <span class="text-cyan-300">stroke</span>=<span class="text-green-300">"currentColor"</span>  <span class="text-neutral-500">&lt;!-- Inherits text color! --&gt;</span>
  <span class="text-cyan-300">stroke-width</span>=<span class="text-green-300">"2"</span>
  <span class="text-cyan-300">class</span>=<span class="text-green-300">"w-5 h-5 text-amber-400"</span>
<span class="text-pink-400">&gt;</span>
  <span class="text-pink-400">&lt;polygon</span> <span class="text-cyan-300">points</span>=<span class="text-green-300">"13 2 3 14 12 14 11 22 21 10 12 10 13 2"</span><span class="text-pink-400">/&gt;</span>
<span class="text-pink-400">&lt;/svg&gt;</span></pre>
      </div>
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded bg-red-500/10 border border-red-500/20">
          <div class="text-red-400 font-medium mb-2">Icon Fonts</div>
          <ul class="space-y-1 text-neutral-500">
            <li>~150KB font file</li>
            <li>All icons downloaded</li>
            <li>FOIT flash</li>
            <li>Limited styling</li>
          </ul>
        </div>
        <div class="p-3 rounded bg-green-500/10 border border-green-500/20">
          <div class="text-green-400 font-medium mb-2">Lucide SVG</div>
          <ul class="space-y-1 text-neutral-500">
            <li>~50KB library</li>
            <li>Tree-shakeable</li>
            <li>Instant render</li>
            <li>CSS color/size</li>
          </ul>
        </div>
      </div>
      <div class="text-xs text-neutral-500 border-l-2 border-purple-500/30 pl-3">
        <strong class="text-neutral-400">Benefit:</strong> <code class="text-cyan-400">stroke="currentColor"</code> means icons automatically inherit text color from Tailwind classes. No separate icon color system needed.
      </div>
    </div>
  `,

  skeleton: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">&lt;!-- Skeleton placeholder in HTML --&gt;</span>
<span class="text-pink-400">&lt;div</span> <span class="text-cyan-300">id</span>=<span class="text-green-300">"projects-placeholder"</span> <span class="text-cyan-300">data-component</span>=<span class="text-green-300">"projects"</span><span class="text-pink-400">&gt;</span>
  <span class="text-pink-400">&lt;div</span> <span class="text-cyan-300">class</span>=<span class="text-green-300">"skeleton-card"</span><span class="text-pink-400">&gt;</span>
    <span class="text-pink-400">&lt;div</span> <span class="text-cyan-300">class</span>=<span class="text-green-300">"skeleton-image animate-pulse"</span><span class="text-pink-400">&gt;&lt;/div&gt;</span>
    <span class="text-pink-400">&lt;div</span> <span class="text-cyan-300">class</span>=<span class="text-green-300">"skeleton-text animate-pulse"</span><span class="text-pink-400">&gt;&lt;/div&gt;</span>
    <span class="text-pink-400">&lt;div</span> <span class="text-cyan-300">class</span>=<span class="text-green-300">"skeleton-text w-3/4 animate-pulse"</span><span class="text-pink-400">&gt;&lt;/div&gt;</span>
  <span class="text-pink-400">&lt;/div&gt;</span>
<span class="text-pink-400">&lt;/div&gt;</span>

<span class="text-neutral-500">/* CSS */</span>
<span class="text-purple-400">.skeleton-text</span> {
  <span class="text-cyan-300">height</span>: <span class="text-orange-300">1rem</span>;
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
        <div class="text-xs text-neutral-500 shrink-0">← Live demo</div>
      </div>
      <div class="text-xs text-neutral-500 border-l-2 border-cyan-500/30 pl-3">
        <strong class="text-neutral-400">CLS Prevention:</strong> Skeletons maintain the exact layout dimensions of final content. When real content loads, it replaces the skeleton with zero layout shift (CLS = 0).
      </div>
    </div>
  `,

  aspect: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">&lt;!-- Without fixed aspect ratio --&gt;</span>
<span class="text-pink-400">&lt;img</span> <span class="text-cyan-300">src</span>=<span class="text-green-300">"photo.webp"</span> <span class="text-pink-400">/&gt;</span>  <span class="text-red-400">/* ❌ CLS when image loads */</span>

<span class="text-neutral-500">&lt;!-- With Tailwind aspect-ratio --&gt;</span>
<span class="text-pink-400">&lt;div</span> <span class="text-cyan-300">class</span>=<span class="text-green-300">"aspect-video relative overflow-hidden"</span><span class="text-pink-400">&gt;</span>
  <span class="text-pink-400">&lt;img</span>
    <span class="text-cyan-300">src</span>=<span class="text-green-300">"photo.webp"</span>
    <span class="text-cyan-300">class</span>=<span class="text-green-300">"absolute inset-0 w-full h-full object-cover"</span>
  <span class="text-pink-400">/&gt;</span>
<span class="text-pink-400">&lt;/div&gt;</span>  <span class="text-green-400">/* ✓ CLS = 0 */</span>

<span class="text-neutral-500">&lt;!-- Common aspect ratios --&gt;</span>
<span class="text-purple-400">.aspect-video</span>   { <span class="text-cyan-300">aspect-ratio</span>: <span class="text-orange-300">16/9</span>; }
<span class="text-purple-400">.aspect-square</span>  { <span class="text-cyan-300">aspect-ratio</span>: <span class="text-orange-300">1/1</span>; }
<span class="text-purple-400">.aspect-[4/3]</span>   { <span class="text-cyan-300">aspect-ratio</span>: <span class="text-orange-300">4/3</span>; }</pre>
      </div>
      <div class="grid grid-cols-2 gap-3 text-xs text-center">
        <div class="p-3 rounded bg-red-500/10 border border-red-500/20">
          <div class="text-red-400 font-bold text-lg">0.25</div>
          <div class="text-neutral-500">CLS without aspect</div>
          <div class="text-red-400 text-[10px]">Poor score (&gt;0.1)</div>
        </div>
        <div class="p-3 rounded bg-green-500/10 border border-green-500/20">
          <div class="text-green-400 font-bold text-lg">0.00</div>
          <div class="text-neutral-500">CLS with aspect</div>
          <div class="text-green-400 text-[10px]">Good score (&lt;0.1)</div>
        </div>
      </div>
      <div class="text-xs text-neutral-500 border-l-2 border-cyan-500/30 pl-3">
        <strong class="text-neutral-400">Core Web Vitals:</strong> CLS (Cumulative Layout Shift) is a Google ranking factor. Score &gt;0.25 is "poor". Fixed aspect ratios guarantee 0 shift because space is reserved before images load.
      </div>
    </div>
  `,

  contain: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">/* css/cards.css - Containment for independent components */</span>
<span class="text-purple-400">.card</span> {
  <span class="text-cyan-300">contain</span>: <span class="text-green-300">layout style paint</span>;
  <span class="text-cyan-300">content-visibility</span>: <span class="text-green-300">auto</span>;  <span class="text-neutral-500">/* Skip rendering if offscreen */</span>
}

<span class="text-purple-400">.project-grid-item</span> {
  <span class="text-cyan-300">contain</span>: <span class="text-green-300">strict</span>;  <span class="text-neutral-500">/* layout + style + paint + size */</span>
  <span class="text-cyan-300">contain-intrinsic-size</span>: <span class="text-orange-300">0 300px</span>;  <span class="text-neutral-500">/* Estimated height */</span>
}</pre>
      </div>
      <div class="grid grid-cols-2 gap-2 text-xs">
        <div class="p-2 rounded bg-neutral-800/50">
          <div class="text-cyan-400 font-medium">layout</div>
          <div class="text-neutral-500">Internal layout changes don't affect parent</div>
        </div>
        <div class="p-2 rounded bg-neutral-800/50">
          <div class="text-purple-400 font-medium">paint</div>
          <div class="text-neutral-500">Element is its own paint boundary</div>
        </div>
        <div class="p-2 rounded bg-neutral-800/50">
          <div class="text-green-400 font-medium">style</div>
          <div class="text-neutral-500">Style recalc scoped to element</div>
        </div>
        <div class="p-2 rounded bg-neutral-800/50">
          <div class="text-orange-400 font-medium">content-visibility</div>
          <div class="text-neutral-500">Skip rendering offscreen content</div>
        </div>
      </div>
      <div class="text-xs text-neutral-500 border-l-2 border-cyan-500/30 pl-3">
        <strong class="text-neutral-400">Performance gain:</strong> When a card's content changes, browser only recalculates styles and layout for that card—not the entire page. This reduces reflow time by up to 90% on complex pages.
      </div>
    </div>
  `,

  gpu: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">/* css/base.css - Animation best practices */</span>

<span class="text-red-400">/* ❌ AVOID: Triggers layout/paint on every frame */</span>
<span class="text-purple-400">.bad-animation</span> {
  <span class="text-cyan-300">transition</span>: <span class="text-green-300">top 0.3s, left 0.3s, width 0.3s</span>;
}

<span class="text-green-400">/* ✓ GPU-accelerated: Runs on compositor thread */</span>
<span class="text-purple-400">.good-animation</span> {
  <span class="text-cyan-300">transition</span>: <span class="text-green-300">transform 0.3s, opacity 0.3s</span>;
  <span class="text-cyan-300">will-change</span>: <span class="text-green-300">transform</span>;  <span class="text-neutral-500">/* Promote to own layer */</span>
}

<span class="text-neutral-500">/* Example: Hover scale effect */</span>
<span class="text-purple-400">.card</span>:hover {
  <span class="text-cyan-300">transform</span>: <span class="text-green-300">scale(1.02) translateY(-2px)</span>;  <span class="text-neutral-500">/* Not margin-top! */</span>
}

<span class="text-neutral-500">/* Example: Fade in animation */</span>
<span class="text-purple-400">.fade-in</span> {
  <span class="text-cyan-300">animation</span>: <span class="text-green-300">fadeIn 0.3s ease-out</span>;
}
<span class="text-purple-400">@keyframes fadeIn</span> {
  <span class="text-cyan-300">from</span> { <span class="text-cyan-300">opacity</span>: <span class="text-orange-300">0</span>; <span class="text-cyan-300">transform</span>: <span class="text-green-300">translateY(10px)</span>; }
  <span class="text-cyan-300">to</span>   { <span class="text-cyan-300">opacity</span>: <span class="text-orange-300">1</span>; <span class="text-cyan-300">transform</span>: <span class="text-green-300">translateY(0)</span>; }
}</pre>
      </div>
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="p-2 rounded bg-red-500/10 border border-red-500/20 text-center">
          <div class="text-red-400 font-medium mb-1">Main Thread</div>
          <div class="text-neutral-500">top, left, width, height, margin, padding</div>
          <div class="text-red-400 mt-1">~16ms/frame budget</div>
        </div>
        <div class="p-2 rounded bg-green-500/10 border border-green-500/20 text-center">
          <div class="text-green-400 font-medium mb-1">GPU Compositor</div>
          <div class="text-neutral-500">transform, opacity, filter</div>
          <div class="text-green-400 mt-1">60fps guaranteed</div>
        </div>
      </div>
      <div class="text-xs text-neutral-500 border-l-2 border-cyan-500/30 pl-3">
        <strong class="text-neutral-400">Warning:</strong> <code class="text-cyan-400">will-change</code> creates a new compositor layer (uses VRAM). Only apply to elements that will actually animate. Remove after animation completes on mobile to save memory.
      </div>
    </div>
  `,

  modular: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">/* theme.css - Single entry point, cascade order controlled */</span>
<span class="text-purple-400">@import</span> <span class="text-green-300">'base.css'</span>;        <span class="text-neutral-500">/* 1. Reset, variables, typography */</span>
<span class="text-purple-400">@import</span> <span class="text-green-300">'buttons.css'</span>;     <span class="text-neutral-500">/* 2. .btn-*, .tag components */</span>
<span class="text-purple-400">@import</span> <span class="text-green-300">'cards.css'</span>;       <span class="text-neutral-500">/* 3. .card, hover overlays */</span>
<span class="text-purple-400">@import</span> <span class="text-green-300">'modal.css'</span>;       <span class="text-neutral-500">/* 4. .modal, .banner, .toast */</span>
<span class="text-purple-400">@import</span> <span class="text-green-300">'light-theme.css'</span>; <span class="text-neutral-500">/* 5. Theme overrides (last!) */</span></pre>
      </div>
      <table class="w-full text-xs">
        <thead>
          <tr class="text-neutral-500 border-b border-neutral-700">
            <th class="text-left py-1 font-medium">File</th>
            <th class="text-right py-1 font-medium">Size</th>
            <th class="text-left py-1 pl-3 font-medium">Purpose</th>
          </tr>
        </thead>
        <tbody class="text-neutral-400">
          <tr class="border-b border-neutral-800">
            <td class="py-1 text-cyan-400">base.css</td>
            <td class="text-right">2.1 KB</td>
            <td class="pl-3">CSS variables, scroll behavior, selection</td>
          </tr>
          <tr class="border-b border-neutral-800">
            <td class="py-1 text-cyan-400">buttons.css</td>
            <td class="text-right">1.4 KB</td>
            <td class="pl-3">Button variants, tags, badges</td>
          </tr>
          <tr class="border-b border-neutral-800">
            <td class="py-1 text-cyan-400">cards.css</td>
            <td class="text-right">1.8 KB</td>
            <td class="pl-3">Card component, hover effects, containment</td>
          </tr>
          <tr class="border-b border-neutral-800">
            <td class="py-1 text-cyan-400">modal.css</td>
            <td class="text-right">0.9 KB</td>
            <td class="pl-3">Modal, banner, toast components</td>
          </tr>
          <tr>
            <td class="py-1 text-cyan-400">light-theme.css</td>
            <td class="text-right">1.2 KB</td>
            <td class="pl-3">Light mode overrides via .light-theme</td>
          </tr>
        </tbody>
        <tfoot>
          <tr class="border-t border-neutral-700 text-neutral-300">
            <td class="py-1 font-medium">Total</td>
            <td class="text-right font-medium text-green-400">7.4 KB</td>
            <td class="pl-3 text-neutral-500">Unminified</td>
          </tr>
        </tfoot>
      </table>
      <div class="text-xs text-neutral-500 border-l-2 border-orange-500/30 pl-3">
        <strong class="text-neutral-400">Architecture:</strong> Single-responsibility files. No specificity wars—import order determines cascade. Tailwind handles utilities, custom CSS handles components and themes.
      </div>
    </div>
  `,

  tailwind: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">&lt;!-- index.html - Tailwind CDN with custom config --&gt;</span>
<span class="text-pink-400">&lt;script</span> <span class="text-cyan-300">src</span>=<span class="text-green-300">"https://cdn.tailwindcss.com"</span><span class="text-pink-400">&gt;&lt;/script&gt;</span>
<span class="text-pink-400">&lt;script&gt;</span>
  tailwind.config = {
    <span class="text-purple-400">theme</span>: {
      <span class="text-purple-400">extend</span>: {
        <span class="text-purple-400">fontFamily</span>: {
          <span class="text-cyan-300">sans</span>: [<span class="text-green-300">'Inter'</span>, <span class="text-green-300">'system-ui'</span>],
          <span class="text-cyan-300">mono</span>: [<span class="text-green-300">'JetBrains Mono'</span>, <span class="text-green-300">'monospace'</span>],
        },
        <span class="text-purple-400">animation</span>: {
          <span class="text-cyan-300">'fade-in'</span>: <span class="text-green-300">'fadeIn 0.5s ease-out'</span>,
        }
      }
    }
  }
<span class="text-pink-400">&lt;/script&gt;</span></pre>
      </div>
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="p-3 rounded bg-neutral-800/50">
          <div class="text-green-400 font-medium mb-2">CDN Advantages</div>
          <ul class="space-y-1 text-neutral-500">
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Zero build step</li>
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Browser-cached globally</li>
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> Instant prototyping</li>
            <li class="flex items-center gap-2"><span class="text-green-400">✓</span> All utilities available</li>
          </ul>
        </div>
        <div class="p-3 rounded bg-neutral-800/50">
          <div class="text-yellow-400 font-medium mb-2">Tradeoffs</div>
          <ul class="space-y-1 text-neutral-500">
            <li class="flex items-center gap-2"><span class="text-yellow-400">△</span> 110KB runtime JS</li>
            <li class="flex items-center gap-2"><span class="text-yellow-400">△</span> JIT compile in browser</li>
            <li class="flex items-center gap-2"><span class="text-yellow-400">△</span> No purge (unused CSS)</li>
            <li class="flex items-center gap-2"><span class="text-yellow-400">△</span> Not for production at scale</li>
          </ul>
        </div>
      </div>
      <div class="text-xs text-neutral-500 border-l-2 border-orange-500/30 pl-3">
        <strong class="text-neutral-400">When to use:</strong> Perfect for portfolios, prototypes, and static sites where build complexity outweighs the 110KB overhead. For production apps, use the CLI build with purge.
      </div>
    </div>
  `,

  fonts: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">&lt;!-- Google Fonts with display=swap parameter --&gt;</span>
<span class="text-pink-400">&lt;link</span> <span class="text-cyan-300">rel</span>=<span class="text-green-300">"preconnect"</span> <span class="text-cyan-300">href</span>=<span class="text-green-300">"https://fonts.googleapis.com"</span><span class="text-pink-400">&gt;</span>
<span class="text-pink-400">&lt;link</span> <span class="text-cyan-300">rel</span>=<span class="text-green-300">"preconnect"</span> <span class="text-cyan-300">href</span>=<span class="text-green-300">"https://fonts.gstatic.com"</span> <span class="text-cyan-300">crossorigin</span><span class="text-pink-400">&gt;</span>
<span class="text-pink-400">&lt;link</span> <span class="text-cyan-300">href</span>=<span class="text-green-300">"https://fonts.googleapis.com/css2?
      family=Inter:wght@400;500;600&
      family=JetBrains+Mono&
      <span class="text-amber-400">display=swap</span>"</span>
      <span class="text-cyan-300">rel</span>=<span class="text-green-300">"stylesheet"</span><span class="text-pink-400">&gt;</span>

<span class="text-neutral-500">/* What display=swap does in @font-face: */</span>
<span class="text-purple-400">@font-face</span> {
  <span class="text-cyan-300">font-family</span>: <span class="text-green-300">'Inter'</span>;
  <span class="text-cyan-300">font-display</span>: <span class="text-green-300">swap</span>;  <span class="text-neutral-500">/* Use fallback immediately, swap when ready */</span>
}</pre>
      </div>
      <div class="grid grid-cols-3 gap-2 text-xs text-center">
        <div class="p-2 rounded bg-red-500/10 border border-red-500/20">
          <div class="text-red-400 font-medium">block</div>
          <div class="text-neutral-600 text-[10px] mt-1">FOIT: Invisible text until font loads</div>
        </div>
        <div class="p-2 rounded bg-green-500/10 border border-green-500/20">
          <div class="text-green-400 font-medium">swap</div>
          <div class="text-neutral-600 text-[10px] mt-1">FOUT: System font → swap</div>
        </div>
        <div class="p-2 rounded bg-blue-500/10 border border-blue-500/20">
          <div class="text-blue-400 font-medium">optional</div>
          <div class="text-neutral-600 text-[10px] mt-1">May skip if too slow</div>
        </div>
      </div>
      <div class="p-3 rounded bg-neutral-800/50 text-xs">
        <div class="text-neutral-400 mb-2">Font Loading Timeline:</div>
        <div class="flex items-center gap-1">
          <div class="h-3 w-12 bg-neutral-600 rounded-l flex items-center justify-center text-[9px] text-neutral-300">system</div>
          <div class="h-3 w-4 bg-amber-500/50 rounded flex items-center justify-center text-[9px]">↻</div>
          <div class="h-3 flex-1 bg-green-500/30 rounded-r flex items-center justify-center text-[9px] text-green-300">Inter loaded</div>
        </div>
      </div>
      <div class="text-xs text-neutral-500 border-l-2 border-orange-500/30 pl-3">
        <strong class="text-neutral-400">FOIT vs FOUT:</strong> Flash of Invisible Text (FOIT) blocks content. Flash of Unstyled Text (FOUT) shows system fonts first. FOUT is better for perceived performance—users see content immediately.
      </div>
    </div>
  `,

  theme: `
    <div class="space-y-4">
      <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
        <pre><span class="text-neutral-500">&lt;!-- index.html &lt;head&gt; - Inline script BEFORE CSS --&gt;</span>
<span class="text-pink-400">&lt;script&gt;</span>
  <span class="text-neutral-500">// Run synchronously before first paint</span>
  (<span class="text-cyan-300">function</span>() {
    <span class="text-cyan-300">const</span> saved = localStorage.getItem(<span class="text-green-300">'theme'</span>);
    <span class="text-cyan-300">const</span> prefersDark = matchMedia(<span class="text-green-300">'(prefers-color-scheme: dark)'</span>).matches;

    <span class="text-cyan-300">if</span> (saved === <span class="text-green-300">'light'</span> || (!saved && !prefersDark)) {
      document.documentElement.classList.add(<span class="text-green-300">'light-theme'</span>);
    }
  })();
<span class="text-pink-400">&lt;/script&gt;</span>

<span class="text-neutral-500">/* ThemeManager.js - Toggle handler */</span>
<span class="text-cyan-300">function</span> <span class="text-yellow-300">toggle</span>() {
  <span class="text-cyan-300">const</span> isLight = document.body.classList.toggle(<span class="text-green-300">'light-theme'</span>);
  localStorage.setItem(<span class="text-green-300">'theme'</span>, isLight ? <span class="text-green-300">'light'</span> : <span class="text-green-300">'dark'</span>);
  updateIcon(isLight);
}</pre>
      </div>
      <div class="grid grid-cols-2 gap-3 text-xs">
        <div class="p-2 rounded bg-red-500/10 border border-red-500/20">
          <div class="text-red-400 font-medium mb-1">Without inline script</div>
          <div class="flex items-center gap-1">
            <div class="h-2 w-8 bg-white rounded"></div>
            <div class="h-2 w-4 bg-red-400 rounded animate-pulse"></div>
            <div class="h-2 w-12 bg-neutral-800 rounded"></div>
          </div>
          <div class="text-neutral-600 mt-1">Flash of wrong theme</div>
        </div>
        <div class="p-2 rounded bg-green-500/10 border border-green-500/20">
          <div class="text-green-400 font-medium mb-1">With inline script</div>
          <div class="flex items-center gap-1">
            <div class="h-2 flex-1 bg-neutral-800 rounded"></div>
          </div>
          <div class="text-neutral-600 mt-1">Correct theme immediately</div>
        </div>
      </div>
      <div class="text-xs text-neutral-500 border-l-2 border-orange-500/30 pl-3">
        <strong class="text-neutral-400">Critical:</strong> Theme check must run synchronously in <code class="text-cyan-400">&lt;head&gt;</code> before any CSS loads. This prevents the jarring flash where users see wrong theme for a frame. Also respects <code class="text-cyan-400">prefers-color-scheme</code> for first-time visitors.
      </div>
    </div>
  `
};
