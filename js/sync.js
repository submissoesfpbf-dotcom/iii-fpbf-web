const SYNC={
 async run(){
   if(!navigator.onLine)throw new Error('Sem internet. Os dados continuam salvos no dispositivo.');
   if(!window.token)throw new Error('Sessão do monitor não encontrada.');
   const q=await DB.allQueue();
   if(!q.length){await updateCounts();return {sent:0,pending:0}}
   let sent=0;
   for(let offset=0;offset<q.length;offset+=100){
     const batch=q.slice(offset,offset+100);
     const scans=batch.filter(x=>x.kind==='scan');
     const registrations=batch.filter(x=>x.kind==='registration');
     const presentations=batch.filter(x=>x.kind==='presentation');
     const monitor_scans=batch.filter(x=>x.kind==='monitor_scan');
     const r=await API.post({
       action:'sync_batch',token,device_id:deviceId,evento_id:'FPBF26',app_version:'2.4.0',
       pending_count:q.length,
       scans:scans.map(x=>x.payload),
       registrations:registrations.map(x=>x.payload),
       presentations:presentations.map(x=>x.payload),
       monitor_scans:monitor_scans.map(x=>x.payload)
     });
     if(!r.success)throw new Error(r.error||r.message||'Servidor recusou o lote.');
     const byId=new Map(batch.map(x=>[x.id,x]));
     for(const x of (r.results||[])){
       const id=x.id||x.scan_id||x.registration_id||x.presentation_id;
       if(!id||!byId.has(id))continue;
       if(['ACCEPTED','ALREADY_PROCESSED','DUPLICATE'].includes(x.status)){await DB.del(id);sent++}
       // REJECTED/CONFLICT/NEEDS_ACTIVITY_SWITCH remain in cache for review/retry.
     }
   }
   await updateCounts();
   return {sent,pending:(await DB.allQueue()).length}
 }
};
