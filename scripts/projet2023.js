/******************************************
           === variables globales === 
********************************************/
const EFFECTIF_MAX = 11; //effectif max pour une équipe
const POSTES = ["gardien","defenseur","milieu","attaquant"]; // noms des différents postes
const FORMATION_INITIALE="433"; // formation choisie par défaut au lancement

let joueurChoisi; // joueur choisi lors d'un click dans la zone joueurs
let capitaine; //capitaine de l'équipe

/**
 * initialisation
 */
const init = function(){
    raz();
    remplirPostes(FORMATION_INITIALE);
    const ok = document.getElementById("ok");
    ok.addEventListener("click", changeFormation);
    const recherches = document.querySelectorAll("fieldset input");
    recherches.forEach(recherche => recherche.addEventListener("change", add_hidden))
}


/*****************************************************
           === Réinitialisation de la page=== 
******************************************************/

/**
 * Mise à l'état initial (feuille de match, effectifs et joueurs)
 * lors d'un changement de formation
 */
const raz = function(){
    razZoneJoueurs();
    abonneClickJoueurs();
    viderFeuilleDeMatch()
    effectifsA0();
}

/**
 * vide la feuille de match
 */
const viderFeuilleDeMatch = function(){
    const liste = document.querySelector("#feuilleDeMatch ul");
    liste.innerHTML = "";
    changeImageComplete(false);
}

/**
 * Réinitialise tous les effectifs du tableau HTML à 0
 */
const effectifsA0=function(){
    const cases = document.querySelectorAll("tbody tr td");
    cases.forEach(element => element.textContent = "0");
}

/** 
 * Vide la <div> d'id "joueurs" puis la remplit à partir des données
 * présentes dans le script utilisé : "men.js" ou "women.js"
 */
const razZoneJoueurs = function(){
    const joueurs = document.getElementById("joueurs");
    joueurs.innerHTML = "";
	for(let i = 0; i < playersData.length; i++) {
		joueurs.appendChild(creerJoueur(playersData[i]));
	}
}

/*****************************************************
           ===Changement de formation=== 
******************************************************/

/**
 *  change la formation présente sur le terrain
 *  puis remet la page dans on état initial.
 */
const changeFormation = function(){
    const input = document.getElementById('formation');
    if(verifFormation(input.value)){
        remplirPostes(input.value)
        raz();
    }
}

/**
 * Détermine si la formation de l'équipe est valide
 * 3 caractères correspondants à des nombres entiers 
 * de défenseurs, milieu et attaquants sont attendus :
 * - Les défenseurs sont 3 au moins, 5 au plus
 * - Les milieux : 3 au moins, 5 au plus
 * - Les attaquants : 1 au moins, 3 au plus
 * (Le gardien est toujours unique il n'est pas représenté dans la chaine de caractères).
 * @param {String} formation - la formation à tester provenant de l'input correspondant
 * @return {Boolean} - true si la formation est valide, false sinon
 */
const verifFormation = function(formation){
    const [def, mid, atk] = formation.split("").map(element => parseInt(element)); //on convertit tous les éléments de formation en un Array de nombres
    return (def >= 3 && def <= 5 && mid >= 3 && mid <= 5 && atk >= 1 && atk <= 3 && def+mid+atk == EFFECTIF_MAX - 1); //vérification de la somme et des bornes
}


/**
 * Remplit les lignes de joueur en fonction de la formation choisie
 * @param {String} formation - formation d'équipe
 */
const remplirPostes = function(formation){
    const effectifs = [1]; // ajout du gardien
    for (c of formation)
        effectifs.push(parseInt(c))
    const lignes = document.getElementById("terrain").children
    for (let i=0; i<lignes.length ; i ++){
        lignes[i].innerHTML = ""
        for (let j = 0; j<effectifs[i]; j++){
            lignes[i].innerHTML +="<div class='positions "+POSTES[i]+"'></div>";
        }
    }
}

/*****************************************************
           === création des joueurs=== 
******************************************************/

/** Crée une <div> représentant un joueur avec un id de la forme "j-xxxxxx"
 * @param {Object} data - données d'un joueur
 * @return {HTMLElement} - div représentant un joueur
 */
const creerJoueur = function(data){
    // crée une div joueur
	const {id, nom, poste, src} = data;
    const div = document.createElement("div");
    div.classList.add("joueur", poste);
    div.id = `j-${id}`;

    // crée l'image et l'ajoute à la div joueur
    const img = document.createElement("img");
    img.src = src;
    img.alt = nom;
    div.appendChild(img);

    // crée les <div> correspondants au nom et au poste et les ajoute à la div joueur
    const divNom = document.createElement("div");
    divNom.classList.add("nom");
    divNom.appendChild(document.createTextNode(nom));

    const divPoste = document.createElement("div");
    divPoste.classList.add("poste");
    divPoste.appendChild(document.createTextNode(poste));

    div.appendChild(divNom);
    div.appendChild(divPoste);

    return div;
}


/*****************************************************
           ===Sélection des joueurs=== 
******************************************************/

/** 
 * Abonne les <div> de class "joueur" à la fonction selectionneJoueur pour un click
 */
const abonneClickJoueurs = function(){
    const joueurs = document.querySelectorAll("#zoneSelection div.joueur");
    joueurs.forEach(element => {
        element.addEventListener("click", selectionneJoueur);
    })
}

/** 
 * Selectionne un joueur, change son opacité puis le place sur le terrain
 */
const selectionneJoueur = function(){
    joueurChoisi = this;
    this.style.opacity="0.3";
    placeJoueur();
}


/*************************************************************
           ===Modifications des joueurs sur le terrain=== 
************************************************************/

/**
 * Renvoie le noeud DOM correspondant à la position disponible pour placer un
 *  joueur sur le terrain ou null si aucune n'est disponible
 * @param {HTMLElement} ligne - une div ligne de joueurs sur le terrain
 * @returns {HTMLElement || null} - une div de class "positions" disponible dans cette ligne
 */
const trouveEmplacement = function(ligne){
    const emplacements = ligne.children;
    for (let emplacement of emplacements) {
        if (!emplacement.hasAttribute("id") || emplacement.id == "") {
            return emplacement;
        }
    }

    return null;
}

/**
 * Renvoie le noeud DOM correspondant à la 
 * ligne où placer un joueur qur le terrain en fonction de son poste
 * @param {String} poste - poste du joueur
 * @returns {HTMLElement} - une div parmi les id #ligne...
 */
const trouveLigne = function(poste){
    return document.getElementById("ligne" + poste.substring(0,1).toUpperCase() +poste.substring(1));
}


/** 
 * Place un joueur sélectionné par un click sur la bonne ligne
 * dans une <div> de class "positions" avec un id de la forme "p-xxxxx"
 */
const placeJoueur = function(){
    const poste = joueurChoisi.classList[1] // le poste correspond à la 2ème classe;
    const ligne = trouveLigne(poste);
    const emplacementLibre = trouveEmplacement(ligne)
    if (emplacementLibre){
        // ajoute le nom du joueur et appelle la fonction permettant de mettre à jour la 
        // feuille de match
        const nom = joueurChoisi.querySelector(".nom").textContent;
        emplacementLibre.title = nom;
        
        // modifie l'image de l'emplacement Libre
        const src = joueurChoisi.querySelector("img").getAttribute("src");
        emplacementLibre.style.backgroundImage = `url(${src})`;

        // modifie l'id 
        const id = "p-" + joueurChoisi.id.substring(2)
        emplacementLibre.id = id;
        ajouteJoueurListe(nom, id);

        // empeche le click dans la zone joueur, et autorise celui dans la zone terrain
        // pour le joueur choisi
        joueurChoisi.removeEventListener("click", selectionneJoueur);

        const boutonCapitaine = document.createElement("button");
        boutonCapitaine.id = "b-" + joueurChoisi.id.substring(2);
        boutonCapitaine.addEventListener("click", e => {
            selectionneCapitaine(e.target);
            e.stopPropagation();
        });
        emplacementLibre.appendChild(boutonCapitaine);
        
        emplacementLibre.addEventListener("click", deselectionneCompo);
        // mise à jour des effectifs de la table
        miseAJourNeffectifs(poste, true);
    }
    else     
        joueurChoisi.style.opacity="";
}


/** 
 * Enléve du terrain le joueur sélectionné par un click
*/
const deselectionneCompo = function(){
    const poste = this.classList[1];
    const idJoueur = "j-" + this.id.substring(2);
    const joueur = document.getElementById(idJoueur);
    joueur.style.opacity="";
    joueur.addEventListener('click', selectionneJoueur);
    enleveJoueurFeuilleMatch(this.title);
    this.removeEventListener("click", deselectionneCompo);
    this.title="";
    this.style="";
    this.id="";
    this.innerHTML="";
    enleveJoueurFeuilleMatch()
    miseAJourNeffectifs(poste, false);
}

/*************************************************************
           ===Mise à jour des effectifs=== 
************************************************************/

/**
 * Met à jour les effectifs dans le tableau lorsqu'un joueur est ajouté 
 * ou retiré du terrain.
 * Après chaque modification, une vérification de la composition compléte
 * doit être effectuée et le changement d'image de la feuille de match
 * doit être éventuellement réalisé.
 * @param {String} poste - poste du joueur
 * @param {Boolean} plus - true si le joueur est ajouté, false s'il est retiré
 */
const miseAJourNeffectifs = function(poste, plus){
    const compteur = document.querySelector(`td.${poste}`);
    let compte = parseInt(compteur.textContent);
    compteur.textContent = plus ? compte+1 : compte-1;

    changeImageComplete(verifCompoComplete());
}


/**
 * Verifie si l'effectif est complet.
 * L'image de la feuille de match est changée en conséquence.
 * @returns {Boolean} - true si l'effectif est au complet, false sinon
 */
const verifCompoComplete = function(){
    return document.querySelector("#feuilleDeMatch ul").children.length == EFFECTIF_MAX; 
}

/*************************************************************
           ===Mise à jour de la feuille de match=== 
************************************************************/

/**
 * Modifie l'image de la feuille de match
 * en fonction de la taille de l'effectif
 * @param {Boolean} complet - true si l'effectif est complet, false sinon
 */
const changeImageComplete = function(complet){
    const image = document.getElementById("check");
    complet ? image.src = "./images/check.png" : image.src = "./images/notok.png";
}


/**
 * Enleve un joueur de la feuille de match
 * @param {String} nom - nom du joueur à retirer
 */
const enleveJoueurFeuilleMatch = function(nom){
    const listeFeuilleMatch = document.getElementById("feuilleDeMatch").querySelector("ul");
    const joueursFeuilleMatch = listeFeuilleMatch.children;
    for (const joueur of joueursFeuilleMatch) {
        if (joueur.textContent == nom) {
            listeFeuilleMatch.removeChild(joueur);
        }
    }
}


/**
 * ajoute un joueur à la feuille de match dans un élément
 * <li> avec un id de la forme "f-xxxxx"
 * @param {String} nom - nom du joueur
 * @param {String} id - id du joueur ajouté au terrain de la forme "p-xxxxx"
 */
const ajouteJoueurListe = function(nom, id){
    const liste = document.getElementById('feuilleDeMatch').querySelector('ul');
    const li = document.createElement('li');
    li.textContent = nom;
    li.id =  "f-"+id.substring(2)
    liste.appendChild(li)
}

/*************************************************************
                         ===Ajouts=== 
************************************************************/


/**
 * ajoute la classe capitaine à l'élément sélectionné
 * @param {Element} target 
 */
function selectionneCapitaine(target) {
    const nvCapitaine = target.id.substring(2);
    if (capitaine) {
        //on enlève la classe capitaine à l'ancien capitaine (s'il existe)
        document.getElementById("f-" + capitaine).classList.remove("capitaine");
        document.getElementById("p-" + capitaine).classList.remove("capitaine");
    }
    if (capitaine != nvCapitaine) {
        capitaine = nvCapitaine; //on remplace l'id de l'ancien capitaine par le nouveau
        //on ajoute la classe capitaine au nouveau
        document.getElementById("f-" + capitaine).classList.add("capitaine");
        document.getElementById("p-" + capitaine).classList.add("capitaine");
    }
}


//TODO
//Ecoute des boutons "affichage joueurs", qui ajoutent la classe "hidden" aux cartes des joueurs dont le poste
//ne correspond pas à ceux sélectionnés
/**
 * ajoute la class "hidden" qui efface de la liste les postes non selectionné
 */
function add_hidden(){
    if (this.id != "affT") {
        document.getElementById("affT").checked = false
    } else {
        document.querySelectorAll("#affA, #affM, #affD, #affG").forEach(ele => ele.checked = false)
    }
    if (Array.from(document.querySelectorAll("fieldset input")).every(ele => !ele.checked)) {
        document.getElementById("affT").click();
    }
    tab = checked_poste();
    const joueurs = document.querySelectorAll("#zoneSelection div.joueur");
    joueurs.forEach(element => {
        if (element.classList.contains("hidden")){
            element.classList.remove("hidden");
        }
        if (tab.includes(element.className.substring(7))) {
            element.classList.add("hidden");
        }})}

/**
 * creer un tableau des postes selectionnés et donc a ne pas afficher
 * @returns {Array}
 */
function checked_poste(){
    let liste = []
    if ((document.getElementById("affT").checked)){
        liste = []
    }
    else{
        if(!(document.getElementById("affG").checked)){
            liste.push("gardien");
        }
        if(!(document.getElementById("affD").checked)){
            liste.push("defenseur");
        }
        if(!(document.getElementById("affM").checked)){
            liste.push("milieu");
        }
        if(!(document.getElementById("affA").checked)){
            liste.push("attaquant");
        }
    }
    return liste
}


/*************************************************************
           ===Initialisation de la page=== 
************************************************************/

init();
