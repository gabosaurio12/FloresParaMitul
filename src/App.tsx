import { useEffect, useState } from "react";
import "./App.css";

import { flowers } from "./data/flowers";
import FlowerCard from "./components/FlowerCard";
import Date from "./pages/Date";
import FlowerExperience from "./pages/FlowerExperience";

function App() {
  const [selectedFlower, setSelectedFlower] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (selectedFlower) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [selectedFlower]);

  if (currentPage === 2) {
    return (
      <Date
        selectedFlower={selectedFlower}
        onComplete={async (proposalData) => {
          try {
            const response = await fetch(
              "https://floresparamitul-backend.onrender.com/api/proposals",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(proposalData),
              }
            );

            const result = await response.json();

            console.log("RESPUESTA DEL BACKEND:", result);

            setCurrentPage(3);
          } catch (error) {
            console.error(
              "Error al enviar la propuesta:",
              error
            );
          }
        }}
      />
    );
  }

  if (currentPage === 3) {
    return <FlowerExperience flowerId={selectedFlower} />
  }

  return (
    <main className="app">
      <section className="flower-selection">
        <header className="intro">
          <p className="intro-small">
            Esta es una pregunta importante...
            </p>
          <h1>¿Cuál es tu flor favorita?</h1>
        </header>

        <div className="flowers-grid">
          {flowers.map((flower) => (
            <FlowerCard
              key={flower.id}
              flower={flower}
              selected={selectedFlower === flower.id}
              onSelect={() => setSelectedFlower(flower.id)}
            />
          ))}
        </div>

        {selectedFlower && (
          <button 
            className="next-button"
            onClick={() => setCurrentPage(2)}
          >
            Siguiente
          </button>
        )}
      </section>
    </main>
  );
}

export default App;