from flask import Flask, render_template, request, jsonify, send_from_directory

app = Flask(__name__)

@app.route('/search')
# Load the search page for flask
def search():
    pokemon_name = request.args.get('pokemonName', 'unknown')  # Get the query parameter 'pokemonName'
    return render_template('search.html', pokemonName=pokemon_name)


@app.route('/request', methods=['POST'])
def getData():
    # Fetch the pokemon data from pokeAPI with the entered pokemonName
    json_data = request.get_json()
    pokemonName = json_data.get("pokemonName")
    print(pokemonName)

    # Check/send error message
    if not pokemonName:
        return jsonify({"error": "Incorrect Pokemon name provided"}), 400

    apiURL = f"https://pokeapi.co/api/v2/pokemon/{pokemonName}" 
    response = request.get(apiURL)
    
    # 
    if response.status_code == 200:
        # Return the JSON data as a response
        return jsonify(response.json()), 200
    else:
        # Couldn't be found return an error
        return jsonify({"error": "Pokemon was not found"}), 404
    
@app.route('/')
def sendMain():
    return send_from_directory('.', "main.html")

if __name__ == "__main__":
    app.run(debug=True)
