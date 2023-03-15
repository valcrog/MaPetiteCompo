/******************************************
           === variables globales === 
********************************************/
const EFFECTIF_MAX = 11; //effectif max pour une équipe
const POSTES = ["gardien","defenseur","milieu","attaquant"]; // noms des différents postes
const FORMATION_INITIALE="433"; // formation choisie par défaut au lancement

let joueurChoisi; // joueur choisi lors d'un click dans la zone joueurs


/**
 * initialisation
 */
const init = function(){
    raz();
    remplirPostes(FORMATION_INITIALE);
    const ok = document.getElementById("ok");
    ok.addEventListener("click", changeFormation);
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
    return (def >= 3 && def <= 5 && mid >= 3 && mid <= 5 && atk >= 1 && atk <= 3 && def+mid+atk == 10); //vérification de la somme et des bornes
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
    //créer une div joueur
	const {id, nom, poste, src} = data;
    const div = document.createElement("div");
    div.classList.add("joueur", poste);

    //crée l'image et l'ajoute à la div joueur
    const img = document.createElement("img");
    img.src = src;
    img.alt = nom;
    div.appendChild(img);

    //crée les <div> correspondants au nom et au poste et les ajoute à la div joueur
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
    //TODO
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
    //TODO
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
        ajouteJoueurListe(nom, id);

        // TODO modifier l'image de l'emplacement Libre

        // TODO modifier l'id 

        // TODO Empecher le click dans la zone joueur, et autorise celui dans la zone terrain
        // pour le joueur choisi 

        // mise à jour des effectifs de la table )
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
    //TODO
}


/**
 * Verifie si l'effectif est complet.
 * L'image de la feuille de match est changée en conséquence.
 * @returns {Boolean} - true si l'effectif est au complet, false sinon
 */
const verifCompoComplete = function(){
    //TODO
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
    i//TODO
}


/**
 * Enleve un joueur de la feuille de match
 * @param {String} nom - nom du joueur à retirer
 */
const enleveJoueurFeuilleMatch = function(nom){
    //TODO
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
           ===Initialisation de la page=== 
************************************************************/

init();