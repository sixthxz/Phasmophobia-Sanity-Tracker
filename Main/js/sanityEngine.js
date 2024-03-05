const initialSanityInput = document.getElementById('initialSanity');
        const selectedSanity = document.getElementById('selectedSanity');
        const setupPhaseDrainRate = document.getElementById('setupPhaseDrainRate');
        const normalDrainRate = document.getElementById('normalDrainRate');
        const mapSizeSelect = document.getElementById('mapSize');
        const playerCountSelect = document.getElementById('playerCount');
        const sanityDrainSelect = document.getElementById('sanityDrain');
        const setupPhaseCheckbox = document.getElementById('setupPhase');
        const applyChangesButton = document.getElementById('applyChanges');
        const playersLobby = document.getElementById('playersLobby');
        const averageSanityElement = document.getElementById('averageSanity');
        let averageSanity = 0;

        initialSanityInput.addEventListener('input', function () {
            selectedSanity.textContent = initialSanityInput.value;
        });

        applyChangesButton.addEventListener('click', function () {
            playersLobby.innerHTML = ""; // Limpiar el lobby antes de agregar nuevos jugadores

            const playerCount = parseInt(playerCountSelect.value, 10);
            
            setInterval(updateAverageSanity, 1000);
            // Crear jugadores y agregarlos al lobby
            for (let i = 1; i <= playerCount; i++) {
                const player = createPlayer(i);
            }
        });

        // Función para actualizar las tasas de drenado según el tamaño del mapa
        function updateDrainRates() {
            const mapSize = mapSizeSelect.value;
            const sanityDrainMultiplier = parseFloat(sanityDrainSelect.value);

            let setupPhaseDrainRateValue, normalDrainRateValue;

            switch (mapSize) {
                case "chico":
                    setupPhaseDrainRateValue = 0.09 * sanityDrainMultiplier;
                    normalDrainRateValue = 0.12 * sanityDrainMultiplier;
                    break;
                case "mediano":
                    setupPhaseDrainRateValue = 0.05 * sanityDrainMultiplier;
                    normalDrainRateValue = 0.08 * sanityDrainMultiplier;
                    break;
                case "grande":
                    setupPhaseDrainRateValue = 0.03 * sanityDrainMultiplier;
                    normalDrainRateValue = 0.05 * sanityDrainMultiplier;
                    break;
                default:
                    // Default values if map size is not recognized
                    setupPhaseDrainRateValue = 0.09 * sanityDrainMultiplier;
                    normalDrainRateValue = 0.12 * sanityDrainMultiplier;
                    break;
            }

            setupPhaseDrainRate.value = setupPhaseDrainRateValue;
            normalDrainRate.value = normalDrainRateValue;
        }

        // Event listener para actualizar las tasas de drenado cuando cambie el tamaño del mapa
        mapSizeSelect.addEventListener('change', updateDrainRates);
        // Event listener para actualizar las tasas de drenado cuando cambie el multiplicador de sanityDrain
        sanityDrainSelect.addEventListener('change', updateDrainRates);

        const playerSanityValues = [];


        function updateAverageSanity() {
            console.log("Sanity array elementos: " + playerSanityValues.join(' '));

            const totalPlayers = playerCount.value;
            
            playerSanityValues.length = totalPlayers;
            

            switch (totalPlayers) {
                case "1":
                    averageSanity = playerSanityValues[0];
                    averageSanityElement.textContent = `${(averageSanity+0).toFixed(2)}%`;
                    console.log("Sanidad 1 players: " + averageSanity);
                    break;
                case "2":
                    averageSanity = (playerSanityValues[0] + playerSanityValues[1]) / totalPlayers;
                    averageSanityElement.textContent = `${averageSanity.toFixed(2)}%`;
                    console.log("Sanidad 2 players: " + averageSanity);
                    break;
                case "3":
                    averageSanity = (playerSanityValues[0] + playerSanityValues[1] + playerSanityValues[2]) / totalPlayers;
                    averageSanityElement.textContent = `${averageSanity.toFixed(2)}%`;
                    console.log("Sanidad 3 players: " + averageSanity);
                    break;
                case "4":
                    averageSanity = (playerSanityValues[0] + playerSanityValues[1] + playerSanityValues[2] + playerSanityValues[3]) / totalPlayers;
                    averageSanityElement.textContent = `${averageSanity.toFixed(2)}%`;
                    console.log("Sanidad 4 players: " + averageSanity);
                    break;

            }

            
            
            console.log("Sanidad Global: " + averageSanity);
        }




        function createPlayer(playerId) {
            let player = {
                initialSanity: initialSanityInput.value,
                sanityDrain: sanityDrainSelect.value,
                mapSize: mapSizeSelect.value,
                setupPhase: setupPhaseCheckbox.checked,
                setupPhaseDrainRate: setupPhaseDrainRate.value,
                normalDrainRate: normalDrainRate.value,
                timerInterval: null,
                startButton: null,
                resetButton: null,
                pauseButton: null,
                resumeButton: null,
                sanitySpan: null,
                sanity: parseFloat(initialSanityInput.value)

            };
            playerSanityValues[playerId - 1] = player.sanity;    
            // Función para actualizar la sanidad en la página
            player.updateSanity = function () {
                player.sanitySpan.textContent = player.sanity.toFixed(2) + "%";
            };

            // Función para disminuir la sanidad con el tiempo
            player.decreaseSanity = function () {
                if (player.sanity > 0) {
                    player.sanity -= player.setupPhase ? player.setupPhaseDrainRate : player.normalDrainRate;
                    playerSanityValues[playerId - 1] = player.sanity;
                    player.updateSanity();
                    console.log("Sanidad del jugador: "+player.sanity.toFixed(2))
                    
                }
                if (player.sanity <= 0) {
                    player.sanity = 0;
                    player.updateSanity();
                    clearInterval(player.timerInterval);
                    player.startButton.disabled = true;
                    player.resetButton.disabled = false;
                    player.pauseButton.disabled = true;
                    player.resumeButton.disabled = true;
                }
            };

            // Iniciar el temporizador manualmente
            player.startButton = document.createElement("button");
            player.startButton.textContent = "Iniciar";
            player.startButton.addEventListener("click", function () {
                if (!player.timerInterval) {
                    player.startTimer();
                }
            });

            // Reiniciar la sanidad
            player.resetButton = document.createElement("button");
            player.resetButton.textContent = "Reiniciar";
            player.resetButton.disabled = true;
            player.resetButton.addEventListener("click", function () {
                clearInterval(player.timerInterval);
                player.timerInterval = null;
                player.sanity = parseFloat(player.initialSanity);
                player.updateSanity();
                player.startButton.disabled = false;
                player.resetButton.disabled = true;
                player.pauseButton.disabled = true;
                player.resumeButton.disabled = true;

            });

            // Iniciar el temporizador
            player.startTimer = function () {
                player.timerInterval = setInterval(player.decreaseSanity, 1000);
                player.startButton.disabled = true;
                player.resetButton.disabled = true;
                player.pauseButton.disabled = false;
                player.resumeButton.disabled = true;
            };

            // Pausar el temporizador
            player.pauseButton = document.createElement("button");
            player.pauseButton.textContent = "Pausar";
            player.pauseButton.disabled = true;
            player.pauseButton.addEventListener("click", function () {
                clearInterval(player.timerInterval);
                player.pauseButton.disabled = true;
                player.resetButton.disabled = false;
                player.resumeButton.disabled = false;
            });

            // Reanudar el temporizador
            player.resumeButton = document.createElement("button");
            player.resumeButton.textContent = "Reanudar";
            player.resumeButton.disabled = true;
            player.resumeButton.addEventListener("click", function () {
                player.startTimer();
            });

            // Crear un div para el jugador
            let playerDiv = document.createElement("div");
            playerDiv.classList.add("player-container");

            // Agregar el contenido del jugador al div
            playerDiv.innerHTML = `
                <h2>Player ${playerId}</h2>
                <p>Sanity: <span class="sanity" id="sanity${playerId}">${player.initialSanity}%</span></p>
            `;

            // Agregar los botones al div del jugador
            playerDiv.appendChild(player.startButton);
            playerDiv.appendChild(player.resetButton);
            playerDiv.appendChild(player.pauseButton);
            playerDiv.appendChild(player.resumeButton);

            player.sanitySpan = playerDiv.querySelector(`#sanity${playerId}`);

            // Agregar el div del jugador al lobby
            playersLobby.appendChild(playerDiv);

            return player;
        }
         updateDrainRates();
