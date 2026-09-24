import { useState, useEffect } from 'react'
import { invoke } from '@tauri-apps/api/tauri'

const i18n = {
  'pt-BR': { 
    title: 'IA SENTINEL PRO v2 - DESKTOP',
    needKey: 'Insira sua chave de ativação de 25 caracteres',
    placeholder: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
    activate: 'ATIVAR PRODUTO',
    scan: 'Executar Varredura Automática 100%',
    manual: 'VERIFICAÇÃO MANUAL OBRIGATÓRIA',
    psu: 'Fonte - Abrir gabinete e fotografar etiqueta',
    invalid: 'Chave inválida - checksum falhou'
  },
  'es': { 
    title: 'IA SENTINEL PRO v2 - DESKTOP',
    needKey: 'Ingrese su clave de activación de 25 caracteres',
    placeholder: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
    activate: 'ACTIVAR PRODUCTO',
    scan: 'Ejecutar Escaneo Automático 100%',
    manual: 'VERIFICACIÓN MANUAL OBLIGATORIA',
    psu: 'Fuente - Abrir gabinete y fotografiar etiqueta',
    invalid: 'Clave inválida - checksum falló'
  },
  'en': { 
    title: 'IA SENTINEL PRO v2 - DESKTOP',
    needKey: 'Enter your 25-character activation key',
    placeholder: 'XXXXX-XXXXX-XXXXX-XXXXX-XXXXX',
    activate: 'ACTIVATE PRODUCT',
    scan: 'Run Automatic Scan 100%',
    manual: 'MANDATORY MANUAL CHECK',
    psu: 'PSU - Open case and photo label',
    invalid: 'Invalid key - checksum failed'
  }
}

export default function App(){
  const [lang,setLang]=useState('pt-BR')
  const [key,setKey]=useState('')
  const [activated,setActivated]=useState(false)
  const [licenseInfo,setLicenseInfo]=useState(null)
  const [report,setReport]=useState(null)
  const [loading,setLoading]=useState(false)
  const t=i18n[lang]

  useEffect(()=>{
    const saved=localStorage.getItem('sentinel_license')
    if(saved){ setActivated(true); setLicenseInfo(JSON.parse(saved)) }
  },[])

  async function activate(){
    if(key.replace(/-/g,'').length!==25){ alert('A chave deve ter 25 caracteres'); return }
    try{
      const hwid = await invoke('get_hwid')
      const resStr = await invoke('activate_product', { key, hwid })
      const res = JSON.parse(resStr)
      if(res.valid){
        localStorage.setItem('sentinel_license', resStr)
        setActivated(true)
        setLicenseInfo(res)
      } else {
        alert(t.invalid + ': ' + res.reason)
      }
    }catch(e){ alert('Erro: '+e) }
  }

  async function runScan(){
    setLoading(true)
    try{
      const jsonStr = await invoke('scan_hardware', { lang })
      const data = JSON.parse(jsonStr)
      setReport(data)
    }catch(e){ alert(e) }
    setLoading(false)
  }

  if(!activated){
    return (
      <div style={{background:'#070a12',color:'#fff',minHeight:'100vh',padding:20,fontFamily:'system-ui'}}>
        <h1 style={{color:'#00f5ff'}}>{t.title}</h1>
        <div style={{background:'#111827',border:'1px solid #1f2937',borderRadius:16,padding:20,marginTop:20}}>
          <h3>{t.needKey}</h3>
          <p style={{fontSize:12,opacity:0.6}}>Formato: XXXXX-XXXXX-XXXXX-XXXXX-XXXXX - 25 letras/números</p>
          <input value={key} onChange={e=>setKey(e.target.value.toUpperCase())} placeholder={t.placeholder} style={{width:'100%',padding:14,marginTop:12,background:'#0b1220',color:'#00f5ff',border:'1px solid #00f5ff55',borderRadius:10,letterSpacing:2,fontWeight:800,textAlign:'center'}}/>
          <button onClick={activate} style={{width:'100%',padding:14,marginTop:12,background:'linear-gradient(90deg,#00f5ff,#7c3aed)',border:'none',borderRadius:12,fontWeight:900,cursor:'pointer'}}>{t.activate}</button>
          <div style={{marginTop:16,fontSize:11,opacity:0.5}}>
            Selecione idioma:
            <select value={lang} onChange={e=>setLang(e.target.value)} style={{background:'#111',color:'#fff',padding:6,marginLeft:8,borderRadius:8}}>
              <option value="pt-BR">PT-BR</option><option value="es">ES</option><option value="en">EN</option>
            </select>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{background:'#070a12',color:'#fff',minHeight:'100vh',padding:16,fontFamily:'system-ui'}}>
      <header style={{display:'flex',justifyContent:'space-between'}}>
        <div style={{color:'#00f5ff',fontWeight:900}}>IA SENTINEL PRO - ATIVADO<br/><small style={{color:'#00ff88'}}>{licenseInfo?.key} - {licenseInfo?.max_pcs} PCs</small></div>
        <select value={lang} onChange={e=>setLang(e.target.value)} style={{background:'#111',color:'#fff',padding:8,borderRadius:8}}>
          <option value="pt-BR">PT-BR</option><option value="es">ES</option><option value="en">EN</option>
        </select>
      </header>

      <button onClick={runScan} style={{width:'100%',padding:16,marginTop:16,background:'linear-gradient(90deg,#00f5ff,#7c3aed)',border:'none',borderRadius:12,fontWeight:900,cursor:'pointer'}}>
        {loading ? 'Escaneando hardware real...' : t.scan}
      </button>

      {report && (
        <div style={{marginTop:16,display:'grid',gap:12}}>
          <div style={{background:'#111827',border:'1px solid #00f5ff33',padding:16,borderRadius:12}}>
            <h3>Hardware 100% - {report.hardware.hostname}</h3>
            <p>Placa: {report.hardware.motherboard} {report.hardware.manufacturer}</p>
            <p>CPU: {report.hardware.cpu}</p>
            <p>RAM: {report.hardware.ram_gb} GB</p>
            <p style={{color:'#ff6b6b',fontWeight:800}}>{t.manual}: {t.psu}</p>
            <p>Discos: {JSON.stringify(report.hardware.disks)}</p>
            <p>Drivers faltando: {JSON.stringify(report.hardware.drivers_missing)}</p>
          </div>
          <div style={{background:'#111827',border:'1px solid #7c3aed33',padding:16,borderRadius:12}}>
            <h3>Software + Rede</h3>
            <p>OS: {report.software.os}</p>
            <p>IP: {report.network.ip}</p>
            <p style={{fontSize:11,opacity:0.6}}>Senha WiFi oculta com log LGPD</p>
          </div>
          <div style={{border:'1px dashed #ff6b6b',padding:16,borderRadius:12}}>
            <h4>Checklist Manual</h4>
            <ul>{report.manual_checklist.map((c,i)=><li key={i}><input type="checkbox"/> {c}</li>)}</ul>
          </div>
        </div>
      )}
    </div>
  )
  }
