import React from 'react';
export default function Footer(){
  return (
    <footer className="footer">
      <div>© {new Date().getFullYear()} Candle Store — Handmade candles with love.</div>
      <div style={{marginTop:8,color:'rgba(59,47,47,0.6)'}}>Follow us for new scents and offers</div>
    </footer>
  );
}
