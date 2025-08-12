"use client";
import { useState } from "react";

export default function Home() {
  const [reservations, setReservations] = useState([]);
  const [name, setName] = useState("");
  const [date, setDate] = useState("");

  const handleReserve = () => {
    if (!name || !date) return alert("Vyplň meno aj dátum!");
    const newReservation = { name, date };
    setReservations([...reservations, newReservation]);
    setName("");
    setDate("");
    localStorage.setItem(
      "reservations",
      JSON.stringify([...reservations, newReservation])
    );
  };

  return (
    <main style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Lezenie s Nikol</h1>

      <section>
        <h2>PDF s informáciami</h2>
        <a href="/LEZENIE-S-NIKOL-WEB-bez-konca.pdf" target="_blank">
          Otvoriť PDF
        </a>
      </section>

      <section style={{ marginTop: 30 }}>
        <h2>Rezervácia</h2>
        <input
          type="text"
          placeholder="Meno"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ marginRight: 10 }}
        />
        <button onClick={handleReserve}>Rezervovať</button>

        <ul style={{ marginTop: 20 }}>
          {reservations.map((res, idx) => (
            <li key={idx}>
              {res.name} – {res.date}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
