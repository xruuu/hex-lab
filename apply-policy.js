// Runs inside the original writer closure and reuses its encoders, journal and ACK handling.
let policyNoChooser=false,policyTarget=null;
async function applySelected({includeMacros=false,automatic=false}={}){
 cancelAuto();
 if(window.HexTelemetry?.snapshot().capturing)return {status:'blocked',reason:'Captura pasiva en curso; los cambios quedan guardados localmente'};
 if(busy||journal||localStorage.getItem('hex16-hw-pending-v1')||localStorage.getItem('hex16-dpi-pending-v1'))return {status:'blocked',reason:busy?'Hay una transmisión en curso':'Existe una escritura incierta pendiente de resolver'};
 const slot=current,p=plan(slot),base=getBase(slot);
 let entries=p.entries.flatMap(e=>{
  if(e.type!=='macro16')return [e];
  if(includeMacros)return [e];
  // Ordinary button edits can preserve an already transmitted macro definition.
  if(same(macroFingerprint(project.profiles[slot]),base.macros||[]))return [{type:'buttons',value:e.value.slice(),changes:e.changes,summary:e.summary,preservedMacroSnapshot:JSON.parse(JSON.stringify(base.macros||[]))}];
  return [];
 });
 entries=JSON.parse(JSON.stringify(entries));
 if(!entries.length)return {status:'nothing',macrosPending:p.entries.some(e=>e.type==='macro16'),unsupported:p.unsupported};
 // Automatic edits never open a permission picker, replay old edits on connection, or guess a device.
 const authorized=(await navigator.hid.getDevices()).filter(d=>d.vendorId===0x04f3&&[0x026e,0x026f].includes(d.productId)&&d.collections?.some(c=>c.featureReports?.some(r=>r.reportId===6)));
 if(busy||journal)return {status:'blocked',reason:'Hay una transmisión en curso'};
 if(current!==slot)return {status:'cancelled'};
 const target=authorized.find(d=>d.productId===0x026f)||authorized[0]||null;
 if(!target)return {status:'disconnected',reason:'Conecta el ratón antes de transmitir'};
 busy=true;device=target;policyTarget=target;policyNoChooser=true;refresh();let began=false;
 try{
  if(!device.opened)await device.open();
  if(current!==slot)throw Error('Cambio de perfil antes de la transmisión');
  journal={slot,remaining:entries.map(e=>e.type),startedAt:new Date().toISOString(),error:'Transmisión en curso',automatic};write(JOURNAL,journal);
  for(const entry of entries){
   if(current!==slot)throw Error('Cambio de perfil durante la transmisión');
   if(entry.type==='dpi')window.HexTelemetry?.invalidateDpi();
   for(const packet of frames(entry,sequence)){began=true;await send(packet);sequence=(sequence+1)&255;}
   markSuccess(slot,entry);if(entry.preservedMacroSnapshot){getBase(slot).macros=entry.preservedMacroSnapshot;write(STORE,state);}journal.remaining=journal.remaining.filter(t=>t!==entry.type);write(JOURNAL,journal);
   log(entry.type.toUpperCase()+' transmitido (acuse HID; sin verificación física).');
  }
  localStorage.removeItem(JOURNAL);journal=null;
  return {status:'transmitted',types:entries.map(e=>e.type),slot};
 }catch(e){
  const reason=String(e.message||e);if(journal){journal.error=reason+(began?' (posible escritura parcial)':'');write(JOURNAL,journal)}
  log('TRANSMISIÓN INCIERTA: '+reason+'. No se reintentará automáticamente.');return {status:'uncertain',reason};
 }finally{policyNoChooser=false;policyTarget=null;busy=false;refresh()}
}
