document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-game');
    const playerNameInput = document.getElementById('player-name');
    const playerNameDisplay = document.getElementById('player-name-display');
    const gameInfo = document.getElementById('game-info');
    const firstLevel = document.getElementById('first-level');
    const secondLevel = document.getElementById('second-level');
    const thirdLevel = document.getElementById('third-level');
    const fourthLevel = document.getElementById('fourth-level');
    const dnaSequence = document.getElementById('dna-sequence');
    const gameModeDisplay = document.getElementById('game-mode');
    const timerDisplay = document.getElementById('timer');
    const firstLevelSubmit = document.getElementById('first-level-submit');
    const secondLevelSubmit = document.getElementById('second-level-submit');
    const thirdLevelSubmit = document.getElementById('third-level-submit');
    const fourthLevelSubmit = document.getElementById('fourth-level-submit');
    const restartButton = document.getElementById('restart');
    const successfulPlayersList = document.getElementById('successful-players');
    const aboutButton = document.getElementById('about-button');
    const aboutSection = document.getElementById('about-section');

    let timer;
    let countdown;
    let gameMode;
    let dnaStrand;
    let complementaryStrand;
    let playerName;

    startButton.addEventListener('click', startGame);
    firstLevelSubmit.addEventListener('click', checkFirstLevelAnswer);
    secondLevelSubmit.addEventListener('click', checkSecondLevelAnswer);
    thirdLevelSubmit.addEventListener('click', checkThirdLevelAnswer);
    fourthLevelSubmit.addEventListener('click', checkFourthLevelAnswer);
    restartButton.addEventListener('click', restartGame);
    aboutButton.addEventListener('click', () => {
        aboutSection.classList.toggle('hidden');
    });

    function startGame() {
        playerName = playerNameInput.value.trim();
        if (playerName === '') {
            alert('Please enter your name');
            return;
        }
        playerNameDisplay.innerHTML = `Player: ${playerName}`;
        playerNameDisplay.classList.remove('hidden');
        playerNameInput.disabled = true;
        startButton.disabled = true;

        gameMode = Math.random() > 0.5 ? 'replication' : 'transcription';
        gameModeDisplay.innerHTML = `Game Mode: ${gameMode}`;

        dnaStrand = generateRandomDnaSequence(12, 18);
        complementaryStrand = getComplementaryStrand(dnaStrand, gameMode);
        dnaSequence.innerHTML = `DNA Sequence: ${dnaStrand}`;

        gameInfo.classList.remove('hidden');
        firstLevel.classList.remove('hidden');
        startTimer(35);
    }

    function generateRandomDnaSequence(minLength, maxLength) {
        const length = Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
        const nucleotides = ['A', 'T', 'C', 'G'];
        let sequence = '';
        for (let i = 0; i < length; i++) {
            sequence += nucleotides[Math.floor(Math.random() * nucleotides.length)];
        }
        return sequence;
    }

    function getComplementaryStrand(dnaStrand, mode) {
        let complementaryStrand = '';
        for (const nucleotide of dnaStrand) {
            if (mode === 'replication') {
                switch (nucleotide) {
                    case 'A':
                        complementaryStrand += 'T';
                        break;
                    case 'T':
                        complementaryStrand += 'A';
                        break;
                    case 'C':
                        complementaryStrand += 'G';
                        break;
                    case 'G':
                        complementaryStrand += 'C';
                        break;
                }
            } else if (mode === 'transcription') {
                switch (nucleotide) {
                    case 'A':
                        complementaryStrand += 'U';
                        break;
                    case 'T':
                        complementaryStrand += 'A';
                        break;
                    case 'C':
                        complementaryStrand += 'G';
                        break;
                    case 'G':
                        complementaryStrand += 'C';
                        break;
                }
            }
        }
        return complementaryStrand;
    }

    function startTimer(seconds) {
        clearInterval(timer);
        countdown = seconds;
        timerDisplay.innerHTML = `Time Left: ${countdown}`;
        timer = setInterval(() => {
            countdown--;
            timerDisplay.innerHTML = `Time Left: ${countdown}`;
            if (countdown <= 0) {
                clearInterval(timer);
                displayTimeUpMessage();
            }
        }, 1000);
    }

    function displayTimeUpMessage() {
        const correctAnswer = getProteinSequence(dnaStrand);
        timerDisplay.innerHTML = 'TIME IS UP';
        document.getElementById('fourth-level-message').innerHTML = `Time's up! The correct amino acid sequence was ${correctAnswer}`;
        setTimeout(restartGame, 10000);
    }

    function checkFirstLevelAnswer() {
        const answer = document.getElementById('first-level-answer').value.trim();
        firstLevelSubmit.disabled = true;
        if (answer === complementaryStrand) {
            document.getElementById('first-level-message').innerHTML = 'Correct! Moving to the next level.';
            setTimeout(() => {
                firstLevel.classList.add('hidden');
                secondLevel.classList.remove('hidden');
                gameModeDisplay.innerHTML = ''; // Hide game mode for subsequent levels
                startTimer(30);
            }, 2000);
        } else {
            document.getElementById('first-level-message').innerHTML = `Incorrect. The correct answer was ${complementaryStrand}`;
            setTimeout(restartGame, 10000);
        }
    }

    function checkSecondLevelAnswer() {
        const purinesCount = parseInt(document.getElementById('purines-count').value.trim());
        const pyrimidinesCount = parseInt(document.getElementById('pyrimidines-count').value.trim());
        secondLevelSubmit.disabled = true;
        const correctPurinesCount = (dnaStrand.match(/[AG]/g) || []).length;
        const correctPyrimidinesCount = (dnaStrand.match(/[TC]/g) || []).length;

        if (purinesCount === correctPurinesCount && pyrimidinesCount === correctPyrimidinesCount) {
            document.getElementById('second-level-message').innerHTML = 'Correct! Moving to the next level.';
            setTimeout(() => {
                secondLevel.classList.add('hidden');
                thirdLevel.classList.remove('hidden');
                startTimer(40);
            }, 2000);
        } else {
            document.getElementById('second-level-message').innerHTML = `Incorrect. The correct counts are Purines: ${correctPurinesCount}, Pyrimidines: ${correctPyrimidinesCount}`;
            setTimeout(restartGame, 10000);
        }
    }

    function checkThirdLevelAnswer() {
        const answer = parseInt(document.getElementById('third-level-answer').value.trim());
        thirdLevelSubmit.disabled = true;
        const correctAnswer = calculateHydrogenBonds(dnaStrand, complementaryStrand);
        if (answer === correctAnswer) {
            document.getElementById('third-level-message').innerHTML = 'Correct! Moving to the next level.';
            setTimeout(() => {
                thirdLevel.classList.add('hidden');
                fourthLevel.classList.remove('hidden');
                startTimer(40);
            }, 2000);
        } else {
            document.getElementById('third-level-message').innerHTML = `Incorrect. The correct answer was ${correctAnswer}`;
            setTimeout(restartGame, 10000);
        }
    }

    function checkFourthLevelAnswer() {
        const answer = document.getElementById('fourth-level-answer').value.trim();
        fourthLevelSubmit.disabled = true;
        const correctAnswer = getProteinSequence(dnaStrand);
        if (answer === correctAnswer) {
            document.getElementById('fourth-level-message').innerHTML = 'Correct! You have completed the game.';
            successfulPlayersList.innerHTML += `<li>${playerName}</li>`;
            setTimeout(restartGame, 10000);
        } else {
            document.getElementById('fourth-level-message').innerHTML = `Incorrect. The correct amino acid sequence was ${correctAnswer}`;
            setTimeout(restartGame, 10000);
        }
    }

    function getProteinSequence(dna) {
        // Convert DNA to RNA
        let rna = dna.replace(/T/g, 'U');
        return translateRNAtoProtein(rna);
    }

    function translateRNAtoProtein(sequence) {
        const CODON_TABLE = {
            UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu',
            CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu',
            AUU: 'Ile', AUC: 'Ile', AUA: 'Ile', AUG: 'Met',
            GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val',
            UCU: 'Ser', UCC: 'Ser', UCA: 'Ser', UCG: 'Ser',
            CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro',
            ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr',
            GCU: 'Ala', GCC: 'Ala', GCA: 'Ala', GCG: 'Ala',
            UAU: 'Tyr', UAC: 'Tyr', UAA: 'STOP', UAG: 'STOP',
            CAU: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln',
            AAU: 'Asn', AAC: 'Asn', AAA: 'Lys', AAG: 'Lys',
            GAU: 'Asp', GAC: 'Asp', GAA: 'Glu', GAG: 'Glu',
            UGU: 'Cys', UGC: 'Cys', UGA: 'STOP', UGG: 'Trp',
            CGU: 'Arg', CGC: 'Arg', CGA: 'Arg', CGG: 'Arg',
            AGU: 'Ser', AGC: 'Ser', AGA: 'Arg', AGG: 'Arg',
            GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly',
        };
        let protein = '';
        for (let i = 0; i < sequence.length; i += 3) {
            const codon = sequence.substring(i, i + 3);
            protein += CODON_TABLE[codon] || '?';
        }
        return protein;
    }

    function calculateHydrogenBonds(dna, complementary) {
        let bonds = 0;
        for (let i = 0; i < dna.length; i++) {
            if ((dna[i] === 'A' && complementary[i] === 'T') || (dna[i] === 'T' && complementary[i] === 'A')) {
                bonds += 2;
            } else if ((dna[i] === 'C' && complementary[i] === 'G') || (dna[i] === 'G' && complementary[i] === 'C')) {
                bonds += 3;
            }
        }
        return bonds;
    }

    function restartGame() {
        playerNameInput.disabled = false;
        startButton.disabled = false;
        firstLevel.classList.add('hidden');
        secondLevel.classList.add('hidden');
        thirdLevel.classList.add('hidden');
        fourthLevel.classList.add('hidden');
        gameInfo.classList.add('hidden');
        timerDisplay.innerHTML = '';
        firstLevelSubmit.disabled = false;
        secondLevelSubmit.disabled = false;
        thirdLevelSubmit.disabled = false;
        fourthLevelSubmit.disabled = false;

        // Clear all inputs and messages
        document.getElementById('first-level-answer').value = '';
        document.getElementById('first-level-message').innerHTML = '';
        document.getElementById('purines-count').value = '';
        document.getElementById('pyrimidines-count').value = '';
        document.getElementById('second-level-message').innerHTML = '';
        document.getElementById('third-level-answer').value = '';
        document.getElementById('third-level-message').innerHTML = '';
        document.getElementById('fourth-level-answer').value = '';
        document.getElementById('fourth-level-message').innerHTML = '';
        playerNameInput.value = '';
    }
});
