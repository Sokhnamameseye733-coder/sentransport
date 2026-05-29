import { useState, useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Carte.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

// Corriger les icônes Leaflet (bug webpack)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const iconeOrange = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function calculerDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function BoutonCentrer({ position }) {
  const map = useMap();

  if (!position) return null;

  return (
    <div className="leaflet-top leaflet-right" style={{marginTop: '10px', marginRight: '10px'}}>
      <button
        className="btn-centrer"
        onClick={() => map.setView(position, 13)}
      >
        📍 Ma position
      </button>
    </div>
  );
}

function Carte() {
  const [arrets, setArrets] = useState([]);
  const [positionUtilisateur, setPositionUtilisateur] = useState(null);
  const [arretProche, setArretProche] = useState(null);
  const DAKAR = [14.6928, -17.4467];
  const [arretsProches, setArretsProches] = useState([]);
  useEffect(() => {
    fetch('http://localhost:5000/arrets')
      .then(r => r.json())
      .then(data => setArrets(data))
      .catch(err => console.error('Erreur arrets :', err));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setPositionUtilisateur([pos.coords.latitude, pos.coords.longitude]);
        },
        () => console.log('Geolocation refusee')
      );
    }
  }, []);

  useEffect(() => {
  if (positionUtilisateur && arrets.length > 0) {
    const arretsAvecDistance = arrets.map(a => ({
      ...a,
      distance: calculerDistance(
        positionUtilisateur[0], positionUtilisateur[1], a.lat, a.lon
      )
    }));
    const tries = arretsAvecDistance.sort((a, b) => a.distance - b.distance);
    setArretsProches(tries.slice(0, 3));
    setArretProche(tries[0]);
  }
}, [positionUtilisateur, arrets]);

  return (
    <div className="carte-container">
      <h2 className="carte-titre">Carte des arrêts</h2>
      {arretProche && (
        <p className="arret-proche">
          Arrêt le plus proche : <strong>{arretProche.nom}</strong>{' '}
          ({arretProche.distance.toFixed(1)} km)
        </p>
      )}
      {arretsProches.length > 0 && (
  <div className="arretsProches-liste">
    <h3>Les 3 arrêts les plus proches :</h3>
    {arretsProches.map((a, i) => (
      <p key={a.id}>
        {i + 1}. <strong>{a.nom}</strong> — {a.distance.toFixed(1)} km
      </p>
    ))}
  </div>
)}
      <MapContainer center={DAKAR} zoom={13} className="carte">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap"
        />
        {arrets.map(a => (
            <Marker
                key={a.id}
                position={[a.lat, a.lon]}
                icon={arretProche && arretProche.id === a.id ? iconeOrange : new L.Icon.Default()}
            >
            <Popup>
                <strong>{a.nom}</strong><br />
                Lignes : {a.lignes.join(', ')}
            </Popup>
            </Marker>
        ))}
        {positionUtilisateur && (
          <Marker position={positionUtilisateur}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}
        <BoutonCentrer position={positionUtilisateur} />
      </MapContainer>
    </div>
  );
}

export default Carte;