
function Execute() {
    // Get the value of pokemonName entered by the user
    const pokemonName = document.querySelector('[name="pokemonName"]').value;

    // Send a POST request to the Flask route
    fetch('/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({pokemonName})
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert("Error: " + data.error);
        } else {
            // Send the Pokemon data to search.html with URL params
            const pokemonData = encodeURIComponent(JSON.stringify(data));
            window.location.href = `search.html?pokemonData=${encodeURIComponent(JSON.stringify(data))}`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error occurred while fetching Pokemon data.");
    });
}


function loadPokemonData() {
    // Lots of comments here because this is the bulk of the API usage
    // Load the data into search.html
    // Search and take the data from URL and pass it to pokemonData
    const params = new URLSearchParams(window.location.search);
    const pokemonData = params.get("pokemonData");

    if (pokemonData) {
        // If data is not None parse the JSON data
        const data = JSON.parse(decodeURIComponent(pokemonData));

        //Load specific data into search.html
        //Load sprite (front_default) into green border box
        document.querySelector(".greenBorder img").src = data.sprites.front_default;
        console.log(data.sprites.front_default);
        //Load abilitie names into red box (There might be more than 1 so we join them with a ,)
        document.querySelector(".redBorder h3").innerText = `Abilities: ${data.abilities.map(ability => ability.ability.name).join(', ')}`;
        console.log(`Abilities: ${data.abilities.map(ability => ability.ability.name).join(', ')}`);

        //Load data into stats
        //data needed from the stats is name of stat like hp or defense, then the stat number up to 255
        const stats = data.stats.map(stat => ({
            name: stat.stat.name,
            baseStat: stat.base_stat
        }));

        stats.forEach(stat => {
            const statBar = document.querySelector(`[data-stat="${stat.name}"]`);
            if (statBar){
                //calculate percentages for the stat bars, stat values are from 1 - 255, but to show the stats visually we need % of 100
                const percentage = Math.min((stat.baseStat / 255) * 100, 100);
                statBar.style.width = `${percentage}%`;
                statBar.innerText = stat.baseStat;
                console.log(percentage);
            }
        });
    }
    else {
        // If no data is found, show an error message
        document.body.innerHTML = '<h1>Error: No data provided.</h1>';
    }

}
