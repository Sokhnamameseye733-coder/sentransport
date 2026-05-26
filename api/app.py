import json
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Charger les donnees depuis le fichier JSON
with open("lignes_ddd.json", "r") as f:
    lignes = json.load(f)

@app.route("/")
def accueil():
    return jsonify({
        "message": "Bienvenue sur l'API SenTransport !",
        "endpoints": ["/lignes", "/lignes/<id>"]
    })

@app.route("/lignes")
def get_lignes():
    return jsonify(lignes)

@app.route("/lignes/<int:ligne_id>")
def get_ligne(ligne_id):
    ligne = next(
        (l for l in lignes if l["id"] == ligne_id),
        None
    )
    if ligne is None:
        return jsonify({"erreur": "Ligne non trouvee"}), 404
    return jsonify(ligne)

@app.route("/arrets")              
def get_arrets():
    tous_les_arrets = []
    for ligne in lignes:
        tous_les_arrets.extend(ligne["listeArrets"])
    arrets_uniques = list(set(tous_les_arrets))
    return jsonify(arrets_uniques)

@app.route("/stats")
def get_stats():
    total_lignes = len(lignes)
    total_arrets = sum(l["arrets"] for l in lignes)
    ligne_max = max(lignes, key=lambda l: l["arrets"])
    return jsonify({
        "total_lignes": total_lignes,
        "total_arrets": total_arrets,
        "ligne_plus_darrets": ligne_max["numero"]
    })

@app.route("/lignes/recherche")
def recherche_lignes():
    from flask import request
    q = request.args.get("q", "")
    resultats = [
        l for l in lignes
        if q.lower() in l["depart"].lower() or q.lower() in l["arrivee"].lower()
    ]
    return jsonify(resultats)

if __name__ == "__main__":
    app.run(debug=True, port=5000)