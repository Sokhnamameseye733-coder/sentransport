import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import StatReseau from './StatReseau';
import Footer from './Footer';
import Carte from './Carte';

function App() {
  const [recherche, setRecherche] = useState("");
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [nbRecherches, setNbRecherches] = useState(0);

  function chargerLignes() {
    setChargement(true);
    setErreur(null);
    fetch("http://localhost:5000/lignes")
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setLignes(data);
        setChargement(false);
      })
      .catch(error => {
        setErreur(error.message);
        setChargement(false);
      });
  }

  useEffect(() => {
    chargerLignes();
  }, []);

  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  function handleClickLigne(ligne) {
  // Si on reclique sur la même ligne, on la désélectionne
  if (ligneSelectionnee && ligneSelectionnee.id === ligne.id) {
    setLigneSelectionnee(null);
    return;
  }

  // Sinon on charge le détail depuis Flask
  fetch(`http://localhost:5000/lignes/${ligne.id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error("Détail introuvable : " + response.status);
      }
      return response.json();
    })
    .then(detail => {
      setLigneSelectionnee(detail);
    })
    .catch(error => {
      console.error("Erreur chargement détail :", error.message);
      setLigneSelectionnee(null);
    });
}

  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">Chargement des lignes...</p>
        </main>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <button className="btn-recharger" onClick={chargerLignes}>
          🔄 Recharger
        </button>
        <StatReseau lignes={lignes} />
        {nbRecherches > 0 && (
          <p className="compteur-recherche">
            Vous avez effectué {nbRecherches} recherche{nbRecherches > 1 ? 's' : ''}
          </p>
        )}
        <Recherche
          valeur={recherche}
          onChange={(val) => {
            setRecherche(val);
            setNbRecherches(n => n + 1);
          }}
        />
        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''} trouvee{lignesFiltrees.length > 1 ? 's' : ''}
        </p>
        {lignesFiltrees.length === 0 && (
          <p className="aucun-resultat">
            Aucune ligne trouvée pour "{recherche}"
          </p>
        )}
        {lignesFiltrees.map(ligne => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            estSelectionnee={ligneSelectionnee && ligneSelectionnee.id === ligne.id}
            onClick={() => handleClickLigne(ligne)}
          />
        ))}
        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}
        <Carte />
      </main>
      <Footer />
    </div>
  );
}

export default App;