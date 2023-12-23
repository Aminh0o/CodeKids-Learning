const questions = [
    {
        question: "Quelle est la sortie du code suivant?",
        options: ["a) 10", "b) 12", "c) 14", "d) 16"],
        correctAnswer: "b"
    },
    {
        question: "Quelles interfaces Java sont utilisées pour implémenter des classes qui peuvent être triées?",
        options: ["a) Comparator", "b) Comparable", "c) Sortable", "d) Comparatorable"],
        correctAnswer: "a"
    },
    {
        question: "Quelle est la sortie du code suivant?",
        options: ["a) Java Rules!", "b) Rules!", "c) Java", "d) Aucune sortie"],
        correctAnswer: "a"
    },
    {
        question: "Quelle est la différence entre une classe abstraite et une interface en Java?",
        options: [
            "a) Les interfaces peuvent contenir des méthodes implémentées.",
            "b) Une classe abstraite peut avoir des constructeurs.",
            "c) Une classe peut implémenter plusieurs interfaces, mais elle ne peut hériter que d'une seule classe abstraite.",
            "d) Les deux a et b."
        ],
        correctAnswer: "c"
    },
    {
        question: "Quelles déclarations de variables sont correctes en Java?",
        options: [
            "a) int x = 10;",
            "b) float y = 3.14;",
            "c) char z = 'A';",
            "d) String name = 'Yassine';"
        ],
        correctAnswer: "a", // Correction de la déclaration de la variable 'name'
    },
    {
        question: "Quelle est la sortie du code suivant?",
        options: ["a) 5", "b) 10", "c) 20", "d) 0"],
        correctAnswer: "a"
    },
    {
        question: "Quelle est la principale utilisation de la classe StringBuilder par rapport à String en Java?",
        options: [
            "a) StringBuilder est immuable.",
            "b) StringBuilder est synchronisé.",
            "c) StringBuilder est mutable et plus efficace pour les opérations de chaînes fréquentes.",
            "d) StringBuilder a plus de méthodes que la classe String."
        ],
        correctAnswer: "c"
    },
    {
        question: "Quelle est la syntaxe correcte pour déclarer une méthode statique en Java?",
        options: [
            "a) void static myMethod() { }",
            "b) static void myMethod() { }",
            "c) method static void myMethod() { }",
            "d) void myMethod() static { }"
        ],
        correctAnswer: "b"
    },
    {
        question: "Quelle est la différence entre equals() et == en Java?",
        options: [
            "a) equals() compare le contenu des objets, tandis que == compare les références d'objets.",
            "b) == compare le contenu des objets, tandis que equals() compare les références d'objets.",
            "c) Ils sont interchangeables et ont la même fonction.",
            "d) equals() est utilisé pour les types primitifs, tandis que == est utilisé pour les objets."
        ],
        correctAnswer: "a"
    },
    {
        question: "Quel est le résultat de l'expression suivante?",
        options: ["a) 10", "b) 5", "c) true", "d) false"],
        correctAnswer: "a"
    },
    {
        question: "Quelle est la déclaration correcte d'un tableau en Java?",
        options: [
            "a) int arr[];",
            "b) int[] arr = new int[];",
            "c) int arr[5];",
            "d) int[] arr = {1, 2, 3};"
        ],
        correctAnswer: "a"
    },
    {
        question: "Quel est le résultat de l'expression 10 / 3 en Java?",
        options: ["a) 3", "b) 3.33", "c) 3.0", "d) Une exception est générée."],
        correctAnswer: "a"
    },
    {
        question: "Quelle interface Java est utilisée pour représenter une collection d'objets ordonnée et sans doublons?",
        options: ["a) List", "b) Set", "c) Map", "d) ArrayList"],
        correctAnswer: "a"
    },
    {
        question: "Quelle est la sortie de code suivante?",
        options: [
            "a) Entre 0 et 10",
            "b) Hors de la plage",
            "c) Aucune sortie",
            "d) Erreur de compilation"
        ],
        correctAnswer: "a"
    },
    {
        question: "Quelle est la manière correcte de déclarer une méthode qui peut lancer une exception en Java?",
        options: [
            "a) void myMethod() throws Exception { }",
            "b) void myMethod() catch (Exception e) { }",
            "c) void myMethod() try { }",
            "d) void myMethod() { }"
        ],
        correctAnswer: "a"
    },
    {
        question: "Quelle est la différence entre une boucle 'for' et une boucle 'while' en Java?",
        options: [
            "a) La boucle 'for' est utilisée pour les itérations basées sur une condition, tandis que la boucle 'while' est utilisée pour les itérations basées sur un compteur.",
            "b) La boucle 'for' est utilisée pour les itérations basées sur un compteur, tandis que la boucle 'while' est utilisée pour les itérations basées sur une condition.",
            "c) Les deux sont interchangeables et peuvent être utilisées de la même manière.",
            "d) La boucle 'for' utilise 'do-while' en interne."
        ],
        correctAnswer: "b"
    },
    {
        question: "Quel mot-clé est utilisé pour empêcher l'héritage d'une classe en Java?",
        options: ["a) final", "b) abstract", "c) static", "d) private"],
        correctAnswer: "a"
    },
    {
        question: "Quelle est la sortie de code suivante?",
        options: [
            "a) Égal",
            "b) Différent",
            "c) Aucune sortie",
            "d) Erreur de compilation"
        ],
        correctAnswer: "b"
    },
    {
        question: "Quelle est la fonction du mot-clé 'super' en Java?",
        options: [
            "a) Il est utilisé pour appeler le constructeur de la classe parente.",
            "b) Il est utilisé pour accéder aux variables de la classe parente.",
            "c) Il est utilisé pour créer une instance de la classe parente.",
            "d) Il est utilisé pour déclarer une classe parente."
        ],
        correctAnswer: "a"
    },
    {
        question: "Quel est le rôle de l'opérateur ternaire (? :) en Java?",
        options: [
            "a) Il est utilisé pour déclarer une condition.",
            "b) Il est utilisé pour effectuer des opérations de comparaison.",
            "c) Il est utilisé pour effectuer une opération conditionnelle en une seule ligne.",
            "d) Il est utilisé pour inverser une condition."
        ],
        correctAnswer: "c"
    }
];

// Fonction pour mélanger les questions (shuffle)
function shuffleQuestions() {
    for (let i = questions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [questions[i], questions[j]] = [questions[j], questions[i]];
    }
}
