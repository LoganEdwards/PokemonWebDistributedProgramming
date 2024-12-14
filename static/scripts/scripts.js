console.log("JavaScript loaded successfully!");
//data is being stored in local storage so we loaded it on search right away
document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/search") {
        loadPokemonData();
    }
});
function Execute() {
    console.log('Execute triggered');

    // Get the value of pokemonName entered by the user
    const pokemonName = document.querySelector('[name="pokemonName"]').value.trim();

    // Confirm that the user entered a name
    if (!pokemonName) {
        alert('Please enter a Pokémon name.');
        return;
    }

    // Send a POST request to the Flask route
    fetch('/request', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({pokemonName})
    })
    .then(response => {
        //check for response error
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Data received:', data);
        if (data.error) {
            //check for error
            alert("Error: " + data.error);
        } else {
            // save data into local storage then move to search.html
            localStorage.setItem("pokemonData", JSON.stringify(data));
            window.location.href = "/search";
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error occurred while fetching Pokemon data.");
    });
}


function loadPokemonData() {
    console.log("Running loadPokemonData");
    // Lots of comments here because this is the bulk of the API usage
    // Load the data into search.html
    // Search and take the data from local storage and stroe it in pokemonData
    const pokemonData = localStorage.getItem("pokemonData");

    if (pokemonData) {
        // If data exists fetch data from API with pokemonName
        // Parse the JSON data
        const data = JSON.parse(pokemonData);
        
        //update the pokemon name placeholder on search page
        document.querySelector("h4").innerText = `You searched for: ${data.name}`;
        
        // const pokemonNameHeader = document.querySelector(".topBar h4");
        // if (pokemonNameHeader) {
        //     pokemonNameHeader.innerText = `You searched for: ${data.name}`;
        // }

        //Use the specific data in search.html
        //Load sprite (front_default) into green border box
        document.querySelector(".greenBorder img").src = data.sprites.front_default;
        console.log(data.sprites.front_default);

        // Load ability names into the red box (Handle multiple abilities if there are more than one and seperate with commas)
        document.querySelector(".redBorder h3").innerText = `Abilities: ${data.abilities.map(ability => ability.name).join(', ')}`;
        console.log(`Abilities: ${data.abilities.map(ability => ability.name).join(', ')}`);

        // Load Pokemon stats into the page
        // Extract the stats and display them with percentages for the bars
        const stats = data.stats;

        stats.forEach(stat => {
            const statBar = document.querySelector(`[data-stat="${stat.name}"]`);
            if (statBar) {
                //calculate percentages for the stat bars, stat values are from 1 - 255, but to show the stats visually we need % of 100
                const percentage = Math.min((stat.base_stat / 255) * 100, 100);
                statBar.style.width = `${percentage}%`;
                statBar.innerText = stat.base_stat;
                console.log(percentage);
            }
        });
        }
        else {
        // If no Pokémon name is found in the local storage, show an error message
        document.body.innerHTML = '<h1>Error: No Pokémon name provided.</h1>';
    }
}
