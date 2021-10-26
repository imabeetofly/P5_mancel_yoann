//VARIABLE
let params = new URL(document.location).searchParams;
let clientLastName = params.get("lastname");
let clientFirstName = params.get("firstname");
let orderId = localStorage.getItem("order-id");
const productContainer = document.querySelector("#product_container");

//DOM

const confirmationMsgContainer = document.createElement("div");
confirmationMsgContainer.setAttribute("id", "confirmation-msg-container");
confirmationMsgContainer.innerHTML = `<p class="thanks-msg">Merci de votre achat <em id="client-name">${
  clientFirstName + " " + clientLastName
} </em></p> 
<p class="thanks-msg">Pour un montant total de :<br/>
<em>${localStorage.getItem("total-price")}€</em>
</p>
<p class="thanks-msg">Voici votre numéro de commande :<br/> <em id="order-id">${orderId}</em></p>`;
productContainer.append(confirmationMsgContainer);

//FUNCTION