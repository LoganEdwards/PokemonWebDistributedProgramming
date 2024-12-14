from flask import Flask, render_template, request, jsonify, send_from_directory
import requests

app = Flask(__name__)

@app.route('/search')
# Render the search page for flask
def search():
    return render_template('search.html')

@app.route('/request', methods=['POST'])
def get_json():
    # Fetch the pokemon data from pokeAPI with the entered pokemonName
    json_data = request.get_json()
    pokemonName = json_data.get("pokemonName")
    # print(pokemonName)

    # Check/send error message
    if not pokemonName:
        return jsonify({"error": "Incorrect Pokemon name provided"}), 400

    apiURL = f"https://pokeapi.co/api/v2/pokemon/{pokemonName}" 
    response = requests.get(apiURL)
    
    # Wasn't sure how to do verify the connection with the status codes so I looked it up and referenced other sources
    if response.status_code == 200:
        # Return the JSON data as a response
        data = response.json()

        # Using only the necessary data: name, sprite/img, abilities, stats
        filtered_data = {
            "name": data["name"],
            "sprites": {"front_default": data["sprites"]["front_default"]},
            "abilities": [{"name": ability["ability"]["name"]} for ability in data["abilities"]],
            "stats": [
                {"name": stat["stat"]["name"], "base_stat": stat["base_stat"]}
                for stat in data["stats"]
            ],
        }
        return jsonify(filtered_data), 200
    else:
        # Couldn't be found return an error
        return jsonify({"error": "Pokemon was not found"}), 404
    
@app.route('/')
def sendMain():
    return send_from_directory('.', "main.html")

if __name__ == "__main__":
    app.run(debug=True)
