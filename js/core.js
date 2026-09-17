(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.FPBFCore=api;})(typeof self!=='undefined'?self:this,function(){
function nextEvent(state){if(state==='FORA')return 'ENTRADA';if(state==='DENTRO')return 'SAIDA';throw new Error('Estado inválido');}
function isDuplicateWindow(a,b,windowMs){return Math.abs(b-a)<windowMs;}
function validateScanShape(s){return !!(s&&s.scan_id&&s.evento_id&&s.qr_token&&s.activity_id&&s.monitor_id&&s.device_id&&s.captured_at);}
function normalizeHeader(v){return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().toLowerCase().replace(/\s+/g,' ');}
function extractRegistrationNumber(raw){const s=String(raw||'').trim();if(/^\d{6,12}$/.test(s))return s;try{const u=new URL(s);if(u.hostname.toLowerCase()!=='e3.gl'&&!u.hostname.toLowerCase().endsWith('.e3.gl'))return '';const path=decodeURIComponent(u.pathname).replace(/\/+$/,'').split('/').pop()||'';const m=path.match(/(\d{8})$/);return m?m[1]:'';}catch(_){return '';}}
return {nextEvent,isDuplicateWindow,validateScanShape,normalizeHeader,extractRegistrationNumber};});
