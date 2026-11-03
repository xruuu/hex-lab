(()=>{
 const byId=id=>document.getElementById(id);
 function snapshot(){const p=profile(),live=window.HexTelemetry.snapshot();return {profile:clone(p),profiles:project.profiles.map((p,i)=>({name:p.name,index:i})),current,selected,catalog:catalog.map(a=>({...a,capability:bindingCapability(a)})),macros:clone(project.macros),plan:window.hex16UnifiedTest.plan(current),...live,operation:window.hex16UnifiedTest.operationStatus(),onboarding:!byId('psfOnboarding').classList.contains('hidden'),status:byId('globalStatus').textContent};}
 const changed=(id,value)=>{const el=byId(id);if(!el)throw Error('Control no disponible: '+id);if(el.type==='checkbox')el.checked=!!value;else el.value=String(value);el.dispatchEvent(new Event('change',{bubbles:true}));};
 window.HexCore={snapshot,
 selectProfile(i){if(window.hex16UnifiedTest.operationStatus().busy)throw Error('Espera a que termine la transmisión antes de cambiar de perfil');if(!Number.isInteger(i)||i<0||i>=5)throw Error('Perfil no válido');byId('profileTabs').children[i].click();return snapshot()},
 selectButton(i){if(!Number.isInteger(i)||i<0||i>15)throw Error('Botón no válido');selected=i;renderButtons();renderSelected();return snapshot()},
 assign(a){const c=bindingCapability(a);if(!['known','experimental'].includes(c.status))throw Error(c.reason);mutate(()=>{profile().buttons[selected]=clone(a)});return c},
 describe:a=>describe(a),
 dpi(i,n){if(!Number.isInteger(n)||n<100||n>24000||n%100)throw Error('DPI: 100–24000, en pasos de 100');const el=byId('dpiRows').querySelectorAll('input[type=number]')[i];el.value=n;el.dispatchEvent(new Event('change',{bubbles:true}));},
 enabled(i,v){const el=byId('dpiRows').querySelectorAll('input[type=checkbox]')[i];el.checked=v;el.dispatchEvent(new Event('change',{bubbles:true}));},
 activeDpi:i=>changed('activeDpi',i),
 field:(id,v)=>changed(id,v),
 rename:name=>changed('profileName',name),
 lightingOptions:()=>[...byId('lightingEffect').options].map(o=>({value:o.value,label:o.textContent})),
 color(i,c){if(!/^#[0-9a-f]{6}$/i.test(c))throw Error('Color no válido');window.hex16PaletteAPI.set(i,c)},
 connect(){byId('homeConnect').click();setTimeout(()=>window.HexTelemetry.scan(),100)},
 applyChanges:(includeMacros=false,automatic=false)=>window.hex16UnifiedTest.sendChanged({includeMacros,automatic}),
 startCapture:()=>window.HexTelemetry.startCapture(),
 finishCapture:()=>window.HexTelemetry.finishCapture(),
 capture:()=>window.HexTelemetry.capture(),
 undo(){undo()},redo(){redo()},
 export(){byId('exportProject').click()},
 importFile(file,psf=false){const input=byId(psf?'importPsf':'importProject'),dt=new DataTransfer();dt.items.add(file);input.files=dt.files;input.dispatchEvent(new Event('change',{bubbles:true}));},
 skipOnboarding(){byId('psfOnboardSkip').click()},
 closeTool(){window.HexDialogs?.close()},
 tool(tab){
  window.HexDialogs?.open(tab);
  if(tab==='onboarding'){byId('psfOnboarding').classList.remove('hidden');return true;}
  const mount=byId('hx-tool-main');for(const child of [...mount.children])if(child.classList.contains('tab'))document.querySelector('.layout').append(child);
  document.querySelector('[data-tab="'+tab+'"]').click();const section=byId(tab);mount.append(section);section.classList.add('active');
  if(tab==='writer'){const btn=byId('unifiedApply');if(btn&&!section.contains(btn)){const bar=document.createElement('div');bar.className='toolbar';section.querySelector('#unifiedWriter').append(bar);bar.append(btn);}}
  return true;
 }
 };
 const originalMutate=mutate;mutate=function(fn){originalMutate(fn);try{if(window.parent.document.getElementById('core-dialog').open&&byId('remap').parentElement?.id==='hx-tool-main')window.parent.postMessage({type:'hex-binding-edited'},'*')}catch{}};
 byId('unifiedConsent').closest('label').hidden=true;byId('unifiedApply').onclick=()=>window.HexCore.applyChanges(true,false);
 const mount=document.createElement('main');mount.id='hx-tool-main';document.body.append(mount);document.body.append(byId('psfOnboarding'));
 const style=document.createElement('style');style.textContent=`
 :root{--bg:#111216;--surface:#18191e;--surface2:#202127;--line:#33343b;--fg:#e8e8ec;--muted:#a1a2ac;--a:#d8b671}
 [hidden]{display:none!important}#psfOnboarding>.panel{max-width:1200px!important;width:calc(100% - 32px);margin:16px auto!important}body{background:var(--bg);font:14px/1.6 'Segoe UI',sans-serif}.layout{display:none!important}#hx-tool-main{padding:30px 34px}#hx-tool-main .tab{display:block!important}.panel{border-color:var(--line);border-radius:12px;padding:24px}.fields{gap:18px}.primary{color:#151b14;background:var(--a);border-color:var(--a)}h2{font-size:21px;line-height:1.3;margin-bottom:16px}.help{font-size:14px;line-height:1.7;overflow-wrap:anywhere}.panel>h2+p,.panel>h3+p{margin:12px 0 22px}.panel>p{line-height:1.7;margin-bottom:16px}.panel .fields{margin:18px 0;gap:20px}.panel label{line-height:1.6}.panel h2{line-height:1.4}.code{line-height:1.55}.toolbar{gap:10px}button{min-height:40px}input,select,textarea{min-height:42px}#unifiedApply{min-height:46px}.banner{display:none}
 `;document.head.append(style);
 document.documentElement.dataset.hexCoreReady='true';
})();
