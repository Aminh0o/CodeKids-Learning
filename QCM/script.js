const quizContainer = document.getElementById("quiz-container");
const quizForm = document.getElementById("quiz-form");
const submitButton = document.getElementById("submit-button");
const countdownElement = document.getElementById("countdown");

// Déclaration de countdownTime en dehors de la fonction
let countdownTime = 1800; // 30 minutes en secondes

// Fonction pour mélanger les questions
function shuffleQuestions() {
    questions.sort(() => Math.random() - 0.5);
}

// Fonction pour vérifier si toutes les questions sont répondues
function allQuestionsAnswered() {
    const allAnswered = questions.every((question, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        return selectedOption !== null;
    });
    return allAnswered;
}

// Fonction pour commencer le chronomètre
function startCountdown() {
    updateCountdown();

    const countdownInterval = setInterval(() => {
        countdownTime -= 1;
        updateCountdown();

        if (countdownTime <= 0 || allQuestionsAnswered()) {
            clearInterval(countdownInterval);

            if (allQuestionsAnswered()) {
                alert("Toutes les questions ont été répondues !");
            } else {
                alert("Le temps est écoulé !");
            }

            // Vous pouvez ajouter une fonction pour gérer le temps écoulé ici
        }
    }, 1000);
}

// Fonction pour mettre à jour le chronomètre
function updateCountdown() {
    const minutes = Math.floor(countdownTime / 60);
    const seconds = countdownTime % 60;
    countdownElement.textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Fonction pour construire le QCM
function buildQuiz() {
    shuffleQuestions();

    questions.forEach((question, index) => {
        const questionElement = document.createElement("div");
        questionElement.classList.add("question");
        questionElement.innerHTML = `
            <p>${index + 1}. ${question.question}</p>
            ${buildOptions(question.options, index)}
        `;
        quizForm.appendChild(questionElement);
    });
}

// Fonction pour construire les options
function buildOptions(options, questionIndex) {
    let optionsHTML = "";
    options.forEach((option, index) => {
        optionsHTML += `
            <label>
                <input type="radio" name="question${questionIndex}" value="${option}">
                ${option}
            </label>
        `;
    });
    return optionsHTML;
}

// Fonction pour calculer le score
function calculateScore() {
    let score = 0;
    questions.forEach((question, index) => {
        const selectedOption = document.querySelector(`input[name="question${index}"]:checked`);
        if (selectedOption && selectedOption.value === question.correctAnswer) {
            score++;
        }
    });
    return score;
}

// Fonction pour afficher les résultats
function showResults() {
    const score = calculateScore();
    alert(`Votre score est de ${score} sur ${questions.length}.`);
}

// Événement de clic sur le bouton "Soumettre"
submitButton.addEventListener("click", () => {
    if (allQuestionsAnswered()) {
        showResults();
    } else {
        alert("Veuillez répondre à toutes les questions avant de soumettre.");
    }
});

// Construire le QCM et commencer le chronomètre
buildQuiz();
startCountdown();
