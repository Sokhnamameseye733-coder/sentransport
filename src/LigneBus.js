import './LigneBus.css';

function LigneBus({ numero, depart, arrivee, arrets, couleur }) {
  const badgeColor = couleur || '#0a6e31';

  return (
    <div className="ligne-bus">
      <div className="ligne-numero" style={{ backgroundColor: badgeColor }}>
        {numero}
      </div>
      <div className="ligne-info">
        <span className="ligne-trajet">
          {depart} &rarr; {arrivee}
        </span>
        <span className="ligne-arrets">{arrets} arrêts</span>
      </div>
    </div>
  );
}

export default LigneBus;