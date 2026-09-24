import React, { useState } from "react";
export default function App(){
  const [key, setKey] = useState("");
  return (
    <div style={{padding:30,fontFamily:'sans-serif',color:'#e6f0ff',background:'#070a12',minHeight:'100vh'}}>
      <h1 style={{color:'#00f5ff'}}>IA SENTINEL PRO 2.0</h1>
      <p>Motor anti-deteccion + Licencias HMAC 25 chars</p>
      <div style={{marginTop:20,padding:20,border:'1px solid #00f5ff33',borderRadius:12,background:'#0b1220'}}>
        <p>Licencia:</p>
        <input value={key} onChange={e=>setKey(e.target.value)} placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" style={{width:'100%',padding:12,background:'#070a12',color:'#fff',border:'1px solid #333',borderRadius:8}}/>
        <button style={{marginTop:12,padding:'10px 20px',background:'#00f5ff',border:'none',borderRadius:8,fontWeight:'bold'}}>Activar</button>
      </div>
      <p style={{marginTop:20,opacity:0.6,fontSize:12}}>Si ves esto, el frontend compila bien. Falta el backend Rust.</p>
    </div>
  )
}
