/**
 * Loading optimization templates
 * lazy, priority, prefetch, defer
 */

export const lazy = `
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
          lucide.<span class="text-yellow-300">createIcons</span>();
        });

      observer.<span class="text-yellow-300">unobserve</span>(placeholder);
    }
  });
},
{
  <span class="text-purple-400">rootMargin</span>: <span class="text-green-300">'300px'</span>,
  <span class="text-purple-400">threshold</span>: <span class="text-orange-300">0</span>
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
      <strong class="text-neutral-400">Why 300px?</strong> Provides enough buffer for slow connections while avoiding unnecessary early loads.
    </div>
  </div>
`;

export const priority = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-neutral-500">// ComponentLoader.js - Priority configuration</span>
<span class="text-cyan-300">const</span> PRIORITIES = {
<span class="text-amber-400">immediate</span>: [<span class="text-green-300">'header'</span>],
<span class="text-green-400">critical</span>:  [<span class="text-green-300">'hero'</span>, <span class="text-green-300">'intro'</span>],
<span class="text-blue-400">lazy</span>:      [<span class="text-green-300">'projects'</span>, <span class="text-green-300">'awards'</span>...],
<span class="text-neutral-400">footer</span>:    [<span class="text-green-300">'footer'</span>]
};

<span class="text-cyan-300">async function</span> <span class="text-yellow-300">initComponents</span>() {
<span class="text-cyan-300">await</span> loadImmediate();
loadCritical();
setupLazyObservers();
loadFooter();
}</pre>
    </div>
    <div class="grid grid-cols-4 gap-2 text-center text-xs">
      <div class="p-2 rounded bg-amber-500/10 border border-amber-500/20">
        <div class="w-3 h-3 rounded-full bg-amber-400 mx-auto mb-1"></div>
        <div class="text-amber-300 font-medium">Immediate</div>
        <div class="text-neutral-500 text-[10px]">header</div>
      </div>
      <div class="p-2 rounded bg-green-500/10 border border-green-500/20">
        <div class="w-3 h-3 rounded-full bg-green-400 mx-auto mb-1"></div>
        <div class="text-green-300 font-medium">Critical</div>
        <div class="text-neutral-500 text-[10px]">hero, intro</div>
      </div>
      <div class="p-2 rounded bg-blue-500/10 border border-blue-500/20">
        <div class="w-3 h-3 rounded-full bg-blue-400 mx-auto mb-1"></div>
        <div class="text-blue-300 font-medium">Lazy</div>
        <div class="text-neutral-500 text-[10px]">on scroll</div>
      </div>
      <div class="p-2 rounded bg-neutral-500/10 border border-neutral-500/20">
        <div class="w-3 h-3 rounded-full bg-neutral-400 mx-auto mb-1"></div>
        <div class="text-neutral-300 font-medium">Footer</div>
        <div class="text-neutral-500 text-[10px]">last</div>
      </div>
    </div>
    <div class="text-xs text-neutral-500 border-l-2 border-green-500/30 pl-3">
      <strong class="text-neutral-400">Result:</strong> FCP in &lt;500ms because only critical components block initial render.
    </div>
  </div>
`;

export const prefetch = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-neutral-500">&lt;!-- DNS Prefetch --&gt;</span>
<span class="text-pink-400">&lt;link</span> <span class="text-cyan-300">rel</span>=<span class="text-green-300">"dns-prefetch"</span> <span class="text-cyan-300">href</span>=<span class="text-green-300">"//fonts.googleapis.com"</span><span class="text-pink-400">&gt;</span>
<span class="text-pink-400">&lt;link</span> <span class="text-cyan-300">rel</span>=<span class="text-green-300">"dns-prefetch"</span> <span class="text-cyan-300">href</span>=<span class="text-green-300">"//cdn.tailwindcss.com"</span><span class="text-pink-400">&gt;</span>

<span class="text-neutral-500">&lt;!-- Preconnect: DNS + TCP + TLS --&gt;</span>
<span class="text-pink-400">&lt;link</span> <span class="text-cyan-300">rel</span>=<span class="text-green-300">"preconnect"</span> <span class="text-cyan-300">href</span>=<span class="text-green-300">"https://fonts.gstatic.com"</span> <span class="text-cyan-300">crossorigin</span><span class="text-pink-400">&gt;</span></pre>
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
        </div>
      </div>
    </div>
    <div class="text-xs text-neutral-500 border-l-2 border-blue-500/30 pl-3">
      <strong class="text-neutral-400">Impact:</strong> Eliminates connection latency for third-party resources.
    </div>
  </div>
`;

export const defer = `
  <div class="space-y-4">
    <div class="p-3 rounded bg-neutral-900/60 font-mono text-xs overflow-x-auto">
      <pre><span class="text-neutral-500">&lt;!-- ES Modules: Deferred by default --&gt;</span>
<span class="text-pink-400">&lt;script</span> <span class="text-cyan-300">type</span>=<span class="text-green-300">"module"</span> <span class="text-cyan-300">src</span>=<span class="text-green-300">"js/main.js"</span><span class="text-pink-400">&gt;&lt;/script&gt;</span>

<span class="text-neutral-500">&lt;!-- CDN scripts --&gt;</span>
<span class="text-pink-400">&lt;script</span> <span class="text-cyan-300">src</span>=<span class="text-green-300">"cdn.tailwindcss.com"</span> <span class="text-cyan-300">async</span><span class="text-pink-400">&gt;&lt;/script&gt;</span>
<span class="text-pink-400">&lt;script</span> <span class="text-cyan-300">src</span>=<span class="text-green-300">"unpkg.com/lucide"</span> <span class="text-cyan-300">defer</span><span class="text-pink-400">&gt;&lt;/script&gt;</span></pre>
    </div>
    <div class="grid grid-cols-3 gap-2 text-xs">
      <div class="p-2 rounded bg-neutral-800/50">
        <div class="text-red-400 font-medium mb-1">Regular</div>
        <div class="flex gap-0.5">
          <div class="h-2 w-8 bg-red-500/50 rounded-l"></div>
          <div class="h-2 w-4 bg-red-500/80 rounded-r"></div>
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
        <div class="text-green-400 font-medium mb-1">defer/module</div>
        <div class="flex gap-0.5">
          <div class="h-2 w-8 bg-green-500/30 rounded"></div>
          <div class="h-2 w-4 bg-green-500/80 rounded"></div>
        </div>
        <div class="text-neutral-600 mt-1">After DOM</div>
      </div>
    </div>
    <div class="text-xs text-neutral-500 border-l-2 border-blue-500/30 pl-3">
      <strong class="text-neutral-400">Key:</strong> <code class="text-cyan-400">type="module"</code> scripts are deferred automatically.
    </div>
  </div>
`;
