import './Recherche.css';

function Recherche({ valeur, onChange }) {
  return (
    <div className="recherche">
      <input
        type="text"
        className="recherche-input"
        placeholder="Rechercher une ligne (depart, arrivee)..."
        value={valeur}
        onChange={e => onChange(e.target.value)}
      />
      {valeur && (
        <button className="recherche-clear" onClick={() => onChange("")}>
          ✕
        </button>
      )}
    </div>
  );
}

export default Recherche;