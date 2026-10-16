import { safeJsonSerialize } from "../core/sanitize";

export interface ThemeScriptProps {
	storageKey?: string;
	defaultMode?: "light" | "dark" | "system";
	defaultThemeId?: string;
	nonce?: string;
}

export function ThemeScript({
	storageKey = "k79_theme_state",
	defaultMode = "system",
	defaultThemeId = "dark-slate",
	nonce,
}: ThemeScriptProps) {
	const code = `(function(){try{
    var d=document.documentElement;
    var rawCookie=document.cookie.match(new RegExp('(^|;\\\\s*)('+${safeJsonSerialize(storageKey)}+')=([^;]*)'));
    var rawLocal=null;
    try{rawLocal=localStorage.getItem(${safeJsonSerialize(storageKey)})}catch(e){}
    var data=null;
    if(rawCookie){try{data=JSON.parse(decodeURIComponent(rawCookie[3]))}catch(e){}}
    if(!data&&rawLocal){try{data=JSON.parse(rawLocal)}catch(e){}}
    if(data&&data.def&&data.def!==${safeJsonSerialize(defaultThemeId)}){data=null;}
    var activeId=data&&data.id?data.id:${safeJsonSerialize(defaultThemeId)};
    var mode=data&&data.m?data.m:${safeJsonSerialize(defaultMode)};
    var mql=window.matchMedia('(prefers-color-scheme: dark)');
    var isDark=(mode==='dark')||(mode==='system'&&mql.matches);
    d.classList.add('no-transitions');
    d.classList.remove('light','dark');
    d.classList.add(isDark?'dark':'light');
    requestAnimationFrame(function(){setTimeout(function(){d.classList.remove('no-transitions');},60);});
    if(activeId==="neobrutalism"&&(!data||!data.d||data.d.tactile!=="false")){d.setAttribute("data-tactile","true");}
    try {
      var fontsToCheck = [];
      if(data&&data.d&&data.d.fontHeading) fontsToCheck.push(data.d.fontHeading);
      if(data&&data.d&&data.d.fontBody) fontsToCheck.push(data.d.fontBody);
      if(activeId==="neobrutalism"){fontsToCheck.push("Space Grotesk");fontsToCheck.push("Inter");}
      for(var i=0; i<fontsToCheck.length; i++){
        var cleanFam = fontsToCheck[i].split(",")[0].trim().replace(/['"]/g, "");
        var fSlug = cleanFam.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
        var cached = localStorage.getItem("k79_font_css_" + fSlug);
        if(cached && !document.querySelector("[data-k79-font="" + fSlug + ""]")){
          var st = document.createElement("style");
          st.setAttribute("data-k79-font", fSlug);
          st.textContent = cached;
          document.head.appendChild(st);
        }
      }
    } catch(e) {}
    if(data&&data.d){
      var t=data.d;
      for(var k in t){
        if(t[k]){
          var cssKey='--'+k.replace(/([a-z0-9])([A-Z])/g,'$1-$2').toLowerCase();
          d.style.setProperty(cssKey,t[k]);
        }
      }
      if(t.radius) { d.style.setProperty("--radius", t.radius); d.style.setProperty("--radius-card", t.radius); d.style.setProperty("--radius-lg", t.radius); d.style.setProperty("--radius-md", "calc(" + t.radius + " * 0.75)"); d.style.setProperty("--radius-sm", "calc(" + t.radius + " * 0.5)"); }
      if(t.tactile==="true") d.setAttribute("data-tactile", "true"); else if(t.tactile==="false") d.removeAttribute("data-tactile");
    }
  }catch(e){}})();`;

	return (
		<script
			id="k79-theme-script"
			nonce={nonce}
			dangerouslySetInnerHTML={{ __html: code }}
		/>
	);
}
