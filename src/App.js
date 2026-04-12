import './App.css';
import Header from './Header';
import Footer from './Footer';
import Statistique1 from './Statistique1';
import Statistique2 from './Statistique2';
import Statistique3 from './Statistique3';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <p>Bienvenue ! Cette application vous aide a trouver
        votre ligne de bus a Dakar.</p>
        <div className="statistiques">
          <Statistique1 />
          <Statistique2 />
          <Statistique3 />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;