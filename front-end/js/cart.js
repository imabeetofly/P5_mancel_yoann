//VARIABLE

let cameras = JSON.parse(localStorage.getItem("cameras"));
const totalPrice = document.querySelector("#total-price");
const productContainer = document.querySelector("#product_container");
const deleteAllBtn = document.querySelector("#delete-all-btn");
const orderBtn = document.querySelector("#order-btn");
const orderBtnLink = document.querySelector("#order-btn-link");
const cartItemContainer = document.querySelector("#cart-item-container");

//form
let form = document.querySelector("form");
let formLastName = document.querySelector("#form-last-name");
let formFirstName = document.querySelector("#form-first-name");
let formAddress = document.querySelector("#form-address");
let formcity = document.querySelector("#form-city");
let formEmail = document.querySelector("#form-email");
let orderId = "";

//DOM

//affichage des cameras presentes dans le panier ainsi que calcul du prix total
window.onload = () => {
  showCamerasInCart();
  calculateTotalPrice();
};

// verification des inputs du formulaire et recuperation de l'order id grace à la requete POST
orderBtn.addEventListener("click", () => {
  postRequest();
  verifyInput();
});

//suppression de toutes les cameras dans le panier
deleteAllBtn.addEventListener("click", () => {
  deleteAllItem();
});

// suppression d'une camera via l'event bubbling et mise à jour du prix total
cartItemContainer.addEventListener("click", (event) => {
  deleteOneCamera(event);
  calculateTotalPrice();
});

//verification des differents input du formulaire
form.email.addEventListener("change", function () {
  validEmail(this);
});

form.address.addEventListener("change", function () {
  validAddress(this);
});

form.lastName.addEventListener("change", function () {
  validInput(this);
});

form.firstName.addEventListener("change", function () {
  validInput(this);
});

form.city.addEventListener("change", function () {
  validInput(this);
});

//FUNCTION

/* creation des elements permettant l'affichage des cameras recuperees dans le local-storage
ainsi qu'un message signalant que le panier est vide si c'est le cas */
function showCamerasInCart() {
  if (cameras.length !== 0) {
    for (camera of cameras) {
      // creation d'un li a partir de chaque element (camera) dans l'array cameras
      const cartItem = document.createElement("li");
      cartItem.setAttribute("class", "cart-item");
      cartItemContainer.append(cartItem);
      //nom dans chaque iteration
      const itemName = document.createElement("p");
      itemName.setAttribute("class", "item-name");
      itemName.innerText = camera.name;
      cartItem.append(itemName);
      //option de chaque iteration
      const itemOption = document.createElement("p");
      itemOption.setAttribute("class", "item-option");
      itemOption.innerText = camera.option;
      cartItem.append(itemOption);
      //prix de chaque iteration
      const itemPrice = document.createElement("p");
      itemPrice.setAttribute("class", "item-price");
      itemPrice.innerText = camera.price;
      cartItem.append(itemPrice);
      //quantite de chaque iteration
      const itemCount = document.createElement("p");
      itemCount.setAttribute("class", "item-count");
      itemCount.innerText = camera.count;
      cartItem.append(itemCount);
      //bouton de suppression pour chaque iteration
      const deleteItem = document.createElement("button");
      deleteItem.setAttribute("class", "delete-item-btn");
      deleteItem.innerText = "X";
      cartItem.append(deleteItem);
    }
  }
  //message signalant que le panier est vide si c'est le cas
  else {
    const nothingInCartMessage = document.createElement("p");
    nothingInCartMessage.setAttribute("id", "nothing-in-cart-mesage");
    nothingInCartMessage.innerHTML = "Votre panier est actuellement vide";
    cartItemContainer.append(nothingInCartMessage);
  }
}

/* suppression d'un element  via event bubbling*/
function deleteOneCamera(e) {
  cameraClicked = e.target;
  if (cameraClicked.classList[0] === "delete-item-btn") {
    cameraClicked.closest(".cart-item").remove();

    const clickedCameraName =
      cameraClicked.closest(".cart-item").children[0].innerHTML;
    const clickedCameraOption =
      cameraClicked.closest(".cart-item").children[1].innerHTML;
    const clickedCameraPrice =
      cameraClicked.closest(".cart-item").children[2].innerHTML;
    const clickedCameraCount =
      cameraClicked.closest(".cart-item").children[3].innerHTML;
    console.log(clickedCameraCount);

    //mise a jour de la quantite des cameras
    let camerasQuantity = localStorage.getItem("numOfItemInCart");
    camerasQuantity -= clickedCameraCount;
    localStorage.setItem("numOfItemInCart", camerasQuantity);

    const cameras = JSON.parse(localStorage.getItem("cameras")) || [];

    //recuperation de l'index de la camera cliquee pour l'utiliser ensuite dans le splice
    const foundIndex = cameras.findIndex(
      (c) => c.name === clickedCameraName && c.option === clickedCameraOption
    );

    //suppression de la camera selectionnee dans l'array et renvoi de la nouvelle valeur dans le local storage
    if (foundIndex !== -1) {
      cameras.splice(foundIndex, 1);
      localStorage.setItem("cameras", JSON.stringify(cameras));
    }
  }
}

// calcul du prix total pour l'afficher au-dessus dans le formulaire ainsi que l'envoi de cette valeur dans le local storage
function calculateTotalPrice() {
  let cameras = JSON.parse(localStorage.getItem("cameras")) || [];
  let calculatedTotalPrice = 0;
  cameras.forEach((camera) => {
    itemTotalPrice = parseInt(camera.price) * parseInt(camera.count);
    calculatedTotalPrice += itemTotalPrice;
  });
  localStorage.setItem("total-price", calculatedTotalPrice);
  //injection dans le html du montant total de toutes les cameras
  totalPrice.innerHTML = `montant: <p id="total-price-number">${calculatedTotalPrice} €</p>`;
}

/* supression de toutes les cameras et modification de la quantite dans le local storage */
function deleteAllItem() {
  cameras = [];
  localStorage.setItem("cameras", JSON.stringify(cameras));
  numOfItemInCart = 0;
  localStorage.setItem("numOfItemInCart", JSON.stringify(numOfItemInCart));
}

//window.location...
function postRequest() {
  // recuperation des informations contenues dans le formulaire pour l'objet contact
  const contact = {
    firstName: formFirstName.value,
    lastName: formLastName.value,
    address: formAddress.value,
    city: formcity.value,
    email: formEmail.value,
  };

  // array product pour le stockage des cameras a envoyer a "l'api"
  let products = [];
  //assignation des cameras (ici leur id) dans l'array product
  cameras.forEach((camera) => {
    products.push(camera.id);
  });

  //objet a envoyer a l'api au moment de la commande
  let order = { contact, products };

  //envoi de la commande (objet: order) a l'api
  fetch("http://localhost:3000/api/cameras/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(order),
  })
    //reponse du back end si l'envoi de la commande est bien passee pour recuperer orderID et le stocker dans le local storage pour la page de confirmation
    .then((response) => response.json())
    .then((data) => {
      for (key in data) {
        orderId = data.orderId;
      }
      localStorage.setItem("order-id", orderId);
    });
}

/*verification de l'email du formulaire via regex
.attribution de la class .valid-input s'ils sont bons
.attribution de la class .wrong-input s'ils ne sont pas bons */
const validEmail = function (inputEmail) {
  let emailRegExp = new RegExp(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  let testEmail = emailRegExp.test(inputEmail.value);
  if (testEmail) {
    formEmail.classList.add("valid-input");
  } else {
    formEmail.classList.remove("valid-input");
  }
};

/*verification de l'adresse du formulaire via regex
.attribution de la class .valid-input s'ils sont bons
.attribution de la class .wrong-input s'ils ne sont pas bons */
const validAddress = function (inputAddress) {
  let addressRegExp = /^\s*\S+(?:\s+\S+){2}/;

  let testAddress = addressRegExp.test(inputAddress.value);
  if (testAddress) {
    formAddress.classList.add("valid-input");
  } else {
    formAddress.classList.remove("valid-input");
  }
};

/* verification des inputs (nom,prenom,ville) du formulaire via regex (pas de numero)
.attribution de la class .valid-input s'ils sont bons
.attribution de la class .wrong-input s'ils ne sont pas bons
*/
const validInput = function (input) {
  let inputRegExp = /^([^0-9]*)$/;

  let testInput = inputRegExp.test(input.value);
  if (testInput) {
    if (!input.classList.contains("valid-input"))
      input.classList.toggle("valid-input");
    input.classList.remove("wrong-input");
  } else {
    if (!input.classList.contains("wrong-input"))
      input.classList.toggle("wrong-input");
    input.classList.remove("valid-input");
  }
};

/* fonction pour verifier si tout les inputs ont bien la classe ".valid-input" suite a leur verification grace au regex et qu'il y ait bien des elements dans le pannier
.si c'est le cas renvoi sur la page de confirmation de commande
.dans le cas contraire message d'alerte pour identifier d'ou vient le probleme (input incorrect ou panier vide)
*/
function verifyInput() {
  let allInput = [
    formLastName,
    formFirstName,
    formAddress,
    formcity,
    formEmail,
  ];

  let numOfValidInput = 0;

  allInput.forEach((input) => {
    if (input.classList.contains("valid-input")) {
      numOfValidInput++;
    }
  });
  //verification des inputs et du panier et renvoi a la page de confirmation
  if (
    numOfValidInput === 5 &&
    parseInt(localStorage.getItem("numOfItemInCart")) !== 0
  ) {
    window.location = `confirmation.html?firstname=${formFirstName.value}&lastname=${formLastName.value}`;
  } else {
    /*
  message d'alerte en cas d'information du formulaire incorrect ou que le panier est vide 
  (alert est utilisé ici dans le cadre MVP , une balise html sera créee et envoyée sur la page dans le projet final) 
  */
    if (numOfValidInput !== 5) {
      alert("merci de rentrer des informations de contact correct");
    } else if (parseInt(localStorage.getItem("numOfItemInCart")) === 0) {
      alert("votre panier est actuellement vide");
    }
  }
}
