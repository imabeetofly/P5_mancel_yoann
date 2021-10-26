//VARIABLE

const test = document.querySelector("#product_container");
const popUpBtn = document.querySelector("#pop-up-btn");
const popUp = document.querySelector("#presentation-pop-up");
const cartCount = document.querySelector("#cart-count");

// DOM

/*au chargement, verification du nombre d'objets dans le cart pour l'affichage ou non de leur quantite
 ainsi que la verification que le pop-up a deja ete visite ou non */
window.onload = () => {
  checkSessionPopUp();
  checkIfNumberInCartIs0();
};

//appel de la fonction permettant de rendre le pop-up invisible lors du clique sur le bouton de celui-ci
popUpBtn.addEventListener("click", togglePopUpVisibility);

//FUNCTION

/* 
requete fetch pour la recuperation des donnees du back end (ici ../back-end/models/camera.js)
.en cas de reussite : creation et affichage des elements 
.en cas d'echec : creation et affichage d'un message d'erreur 
*/
fetch("http://localhost:3000/api/cameras")
  .then((res) => res.json())
  .then((data) => {
    for (element of data) {
      //carte de chaque iteration de l'array data venant de l'api
      const productCard = document.createElement("li");
      productCard.setAttribute("class", "product-card");
      //lien vers la page produit de la camera
      const cardLink = document.createElement("a");
      //recuperation de l'id pour l'injecter dans l'url de la page produit
      const id = element._id;
      cardLink.setAttribute("href", "produit.html?id=" + id);
      productCard.append(cardLink);
      //image de la camera
      const cameraImg = document.createElement("img");
      cameraImg.setAttribute("src", element.imageUrl);
      cardLink.append(cameraImg);
      //banniere de la camera
      const cameraBanner = document.createElement("div");
      cameraBanner.setAttribute("class", "camera-banner");
      cardLink.append(cameraBanner);
      //nom de la camera
      const cameraName = document.createElement("p");
      cameraName.innerText = element.name;
      cameraBanner.append(cameraName);
      //prix de la camera
      const cameraPrice = document.createElement("p");
      cameraPrice.innerText = element.price / 100 + " €";
      cameraBanner.append(cameraPrice);
      product_container.append(productCard);
    }
  })
  //message d'erreur en cas de soucis avec le serveur
  .catch(() => {
    const errorMessage = document.createElement("li");
    errorMessage.setAttribute("id", "error-message");
    errorMessage.innerText =
      "excusez nous, nous n'avons pas réussi à accéder à votre requête , vérifier le port localhost 3000 , si le problème persiste , veuillez nous contacter";
    test.append(errorMessage);
  });

// affichage du nombre d'objets dans le pannier
function checkIfNumberInCartIs0() {
  if (JSON.parse(localStorage.getItem("numOfItemInCart")) !== 0) {
    cartCount.innerText = localStorage.getItem("numOfItemInCart");
  }
}

/*envoie de l'id no-visibility sur le pop-up pour le rendre invisible (display: none)
puis envoie au session storage de l'information que le pop-up a deja ete visite*/
function togglePopUpVisibility() {
  popUp.setAttribute("id", "no-visibility");
  sessionStorage.setItem("landing-pop-up-visited", "true");
}

//verification dans le session storage si le pop up de la page d'accueil a deja ete visite
function checkSessionPopUp() {
  if (JSON.parse(sessionStorage.getItem("landing-pop-up-visited"))) {
    popUp.setAttribute("id", "no-visibility");
  }
}
