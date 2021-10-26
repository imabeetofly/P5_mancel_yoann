// VARIABLE

//recuperation de l'id de la camera contenue dans l'url de la page pour l'utiliser dans la requete fetch
let params = new URL(document.location).searchParams;
let id = params.get("id");

const cartCount = document.querySelector("#cart-count");

//DOM

//lors du chargement de la page, appel de la fonction permettant l'affichage du nombre d'objets dans le panier
window.onload = () => {
  checkIfNumberInCartIs0();
};

//FUNCTION

//recuperation des informations contenues dans l'api du produit cliqué sur la page d'accueil et injection de ces informations dans le html
fetch("http://localhost:3000/api/cameras/" + id)
  .then((res) => res.json())
  .then((data) => {
    // creation d'un li a partir de la camera reçue dans la reponse de l'api (res)
    const productCard = document.createElement("li");
    productCard.setAttribute(
      "class",
      "single-product-card product-card-animation"
    );
    const cameraId = data._id;
    //image de la camera
    const cameraImg = document.createElement("img");
    cameraImg.setAttribute("src", data.imageUrl);
    productCard.append(cameraImg);
    //information de la camera
    const cameraBanner = document.createElement("div");
    cameraBanner.setAttribute("class", "camera-banner");
    productCard.append(cameraBanner);
    //nom de la camera
    const cameraName = document.createElement("h1");
    cameraName.innerText = data.name;
    cameraBanner.append(cameraName);
    //description de la camera
    const cameraDescription = document.createElement("p");
    cameraDescription.innerText = data.description;
    cameraBanner.append(cameraDescription);
    //l'abel des options de la camera
    const cameraSelectOptionLabel = document.createElement("label");
    cameraSelectOptionLabel.setAttribute("for", "select-option");
    cameraSelectOptionLabel.innerText = "Option de votre objectif :";
    cameraBanner.append(cameraSelectOptionLabel);
    //selection des options de la camera
    const cameraSelectOption = document.createElement("select");
    cameraSelectOption.setAttribute("id", "select-option");
    cameraBanner.append(cameraSelectOption);
    //attribution des options a la selection de celle-ci
    for (element of data.lenses) {
      const cameraOption = document.createElement("option");
      cameraOption.innerText = element;
      cameraSelectOption.append(cameraOption);
    }
    //prix de la camera
    const cameraPrice = document.createElement("p");
    cameraPrice.innerText = data.price / 100 + " €";
    cameraBanner.append(cameraPrice);
    //container des boutons de retour a la page d'accueil et de l'ajout au panier
    const buttonContainer = document.createElement("div");
    buttonContainer.setAttribute("id", "button-container");
    cameraBanner.append(buttonContainer);
    //bouton retour a la page d'accueil
    const buttonToLandingPage = document.createElement("div");
    buttonToLandingPage.setAttribute("id", "to-landing-page");
    buttonToLandingPage.innerHTML = `<a href="index.html"><p>Accueil</p></a>`;
    buttonContainer.append(buttonToLandingPage);
    //bouton ajouter au panier
    const buttonAddToCart = document.createElement("div");
    buttonAddToCart.setAttribute("id", "add-to-cart");
    buttonAddToCart.innerHTML = `<p>Acheter</p>`;
    buttonContainer.append(buttonAddToCart);
    product_container.append(productCard);

    /* ecoute de l'evenement clique pour le declenchement des fonctions permettant:
    . l'ajout au local storage de la "camera" ,
    .la mise a jour du nombre d'elements dans le "cartCount" et son injection dans la balise html,
    .le pop-up visuel signalant un nouvel ajout dans le cart */
    const addToCartBtn = document.querySelector("#add-to-cart");
    addToCartBtn.addEventListener("click", () => {
      addToCart();
      updateCartCountNumber();
      cartPopUp();
      setTimeout(cartPopUp, 1000);
    });

    // fonction permettant l'ajout d'element dans le panier s'il n'y ait pas present ou augmentation de sa quantite dans le cas contraire
    function addToCart() {
      let cameraOnPage = {
        name: cameraName.innerText,
        option: cameraSelectOption.value,
        price: cameraPrice.innerText,
        id: cameraId,
        count: 1,
      };

      //recuperation du local storage ou creation d'un array vide contenant les cameras
      const cameras = JSON.parse(localStorage.getItem("cameras")) || [];

      //verification et recuperation d'une camera en particulier si elle existe deja (option + nom ) dans l'array cameras
      let cameraOnPagePresentInLocalStorage = cameras.find((camera) => {
        if (
          camera.name === cameraOnPage.name &&
          camera.option === cameraOnPage.option
        )
          return true;
      });
      // incrementation du "count" de la camera recuperee au-dessus
      if (cameraOnPagePresentInLocalStorage !== undefined) {
        cameraOnPagePresentInLocalStorage.count += 1;
      } else {
        cameras.push(cameraOnPage);
      }
      localStorage.setItem("cameras", JSON.stringify(cameras));
      console.log(cameras);
    }
  });

// affichage du nombre d'objets dans le pannier
function checkIfNumberInCartIs0() {
  if (JSON.parse(localStorage.getItem("numOfItemInCart")) !== 0) {
    cartCount.innerText = localStorage.getItem("numOfItemInCart");
  }
}

/* creation et envoie du nombre d'objets present dans le panier dans le local-storage 
    ainsi que mise à jour dynamique de la quantite sur l'icone du panier */
function updateCartCountNumber() {
  let numberOfItemInCart = JSON.parse(localStorage.getItem("numOfItemInCart"));
  if (numberOfItemInCart == null) {
    numberOfItemInCart = 1;
  } else {
    numberOfItemInCart += 1;
  }
  localStorage.setItem("numOfItemInCart", JSON.stringify(numberOfItemInCart));
  const cartCount = document.querySelector("#cart-count");
  cartCount.innerText = numberOfItemInCart;
}

//toggle de la classe permettant l'affichage du pop-up en-dessous du panier lors d'un nouvel ajout
function cartPopUp() {
  const newItemInCartAlert = document.querySelector("#alert-container");
  newItemInCartAlert.classList.toggle("animation-pop-up-visible");
  newItemInCartAlert.classList.toggle("animation-pop-up-invisible");
}
