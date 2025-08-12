
'use client';
import { useEffect, useMemo, useState } from 'react';
import { format, startOfToday, endOfMonth, isBefore, isAfter } from 'date-fns';

const TIME_SLOTS = ['13:00','14:45','16:15','18:00','19:45'];
const STORAGE_KEY = 'reservations_v1';

export default function Page() {
  const today = startOfToday();
  const [date, setDate] = useState(() => format(today, 'yyyy-MM-dd'));
  const [time, setTime] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [reservations, setReservations] = useState([]);

  // bounds for <input type="date"> to lock to current month only
  const minDate = format(today, 'yyyy-MM-dd');
  const maxDate = format(endOfMonth(today), 'yyyy-MM-dd');

  useEffect(()=>{
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      setReservations(raw ? JSON.parse(raw) : []);
    } catch {}
  },[]);

  const bookedTimes = useMemo(()=>{
    return new Set(reservations.filter(r => r.date === date).map(r=>r.time));
  },[reservations, date]);

  function save(list){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    setReservations(list);
  }

  function submit(e){
    e.preventDefault();
    setError(''); setSuccess('');
    const d = new Date(date);
    if (isBefore(d, today)) return setError('Vyberte dátum odo dnes.');
    if (isAfter(d, endOfMonth(today))) return setError('Dátum musí byť v aktuálnom mesiaci.');
    if (!time) return setError('Vyberte čas.');
    if (!name.trim()) return setError('Zadajte meno.');
    if (!/^\+?[0-9\s-]{6,}$/.test(phone)) return setError('Zadajte platné telefónne číslo.');
    if (reservations.some(r=> r.date===date && r.time===time)) return setError('Tento termín je už obsadený.');
    const rec = {date, time, name:name.trim(), phone:phone.trim()};
    const next = [...reservations, rec];
    save(next);
    setSuccess('Vaša rezervácia prebehla úspešne.');
    setTime(''); setName(''); setPhone('');
  }

  return (
    <main style={{maxWidth: 880, margin:'0 auto', padding: '24px'}}>
      <header style={{position:'sticky', top:0, background:'#fff', padding:'12px 0', borderBottom:'1px solid #eee', marginBottom:16}}>
        <strong>Lezenie s Nikol</strong>
      </header>

      <section style={{border:'1px solid #e5e7eb', borderRadius:12, overflow:'hidden', boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
        <iframe title="PDF – Lezenie s Nikol" src="/LEZENIE-S-NIKOL-WEB-bez-konca.pdf" style={{width:'100%', height:'70vh', border:0}} />
      </section>

      <h2 id="rezervacia" style={{marginTop:32}}>Rezervácia stretnutia</h2>
      <p style={{color:'#6b7280', fontSize:14}}>Vyberte dátum (iba aktuálny mesiac) a čas, potom meno a telefón.</p>

      <form onSubmit={submit} style={{display:'grid', gap:16, marginTop:12}}>
        <div style={{display:'grid', gap:8}}>
          <label>Dátum</label>
          <input type="date" value={date} min={minDate} max={maxDate}
            onChange={(e)=>setDate(e.target.value)}
            style={{border:'1px solid #d1d5db', borderRadius:8, padding:'8px 10px'}} />
        </div>

        <div style={{display:'grid', gap:8}}>
          <label>Vyberte čas</label>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, minmax(0,1fr))', gap:8}}>
            {TIME_SLOTS.map(t=>{
              const taken = bookedTimes.has(t);
              const active = time===t;
              return (
                <button key={t} type="button" onClick={()=>setTime(t)} disabled={taken}
                  style={{
                    padding:'8px 10px', borderRadius:8, border:'1px solid #d1d5db', cursor:taken?'not-allowed':'pointer',
                    background: taken ? '#f3f4f6' : active ? '#111827' : '#fff',
                    color: active ? '#fff' : '#111827'
                  }}>
                  {t} {taken ? '(obsadené)' : ''}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
          <div style={{display:'grid', gap:8}}>
            <label>Meno</label>
            <input value={name} onChange={e=>setName(e.target.value)} placeholder="Vaše meno"
              style={{border:'1px solid #d1d5db', borderRadius:8, padding:'8px 10px'}} />
          </div>
          <div style={{display:'grid', gap:8}}>
            <label>Telefónne číslo</label>
            <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+421 900 123 456"
              style={{border:'1px solid #d1d5db', borderRadius:8, padding:'8px 10px'}} />
          </div>
        </div>

        {error && <div style={{color:'#b91c1c', fontSize:14}}>{error}</div>}
        {success && <div style={{color:'#059669', fontSize:14}}>{success}</div>}

        <div>
          <button type="submit" style={{padding:'10px 14px', borderRadius:8, background:'#111827', color:'#fff'}}>Rezervovať termín</button>
        </div>
      </form>

      <footer style={{textAlign:'center', fontSize:12, color:'#6b7280', padding:'32px 0'}}>© {new Date().getFullYear()} – Lezenie s Nikol</footer>
    </main>
  );
}
