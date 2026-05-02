import './StatReseau.css';

function StatReseau({ lignes }) {
  const totalLignes = lignes.length;

  const totalArrets = lignes.reduce((sum, ligne) => sum + ligne.arrets, 0);

  const ligneMax = lignes.reduce((max, ligne) =>
    ligne.arrets > max.arrets ? ligne : max
  );

  return (
    <div className="stat-reseau">
      <h2 className="stat-titre">Statistiques du réseau</h2>
      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-nombre">{totalLignes}</span>
          <span className="stat-label">Lignes</span>
        </div>
        <div className="stat-card">
          <span className="stat-nombre">{totalArrets}</span>
          <span className="stat-label">Arrêts au total</span>
        </div>
        <div className="stat-card">
          <span className="stat-nombre">Ligne {ligneMax.numero}</span>
          <span className="stat-label">Plus d'arrêts ({ligneMax.arrets})</span>
        </div>
      </div>
    </div>
  );
}

export default StatReseau;