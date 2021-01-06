//RÉCUPÉRATION DES PRODUITS DANS LOCALSTORAGE
let basketItems = localStorage.getItem('camerasInBasket');
basketItems = JSON.parse(basketItems);

//AFFICHAGE PRODUIT DANS LOCALSTORAGE SI PRÉSENTS
let basketTitle = document.getElementById('basket_map');


const showBasket = () => {
    if (basketItems == null || basketItems == undefined) {

        basketTitle.innerHTML = (
            `
            <h1>
                <i id="basket_icon" class="fas fa-shopping-cart"></i>
                </br>
                </br>
                Votre panier est vide !
            </h1>
            `
        );
    }   else  {
            let cameras = Object.values(basketItems);
            console.log(cameras);
            let addPrice = [];

            let basketList = document.getElementById('basket_list');
            
            cameras.forEach((camera) => {
                
                basketList.innerHTML += (
                    `
                    <div class="purchaseCam"> 
                        <img class="purchaseCam-image" src='${camera.imageUrl}' alt='Photo de la caméra ${camera.name}'>
                        <div class="purchaseCam_infos">
                            <p class="purchaseCam_infos-name">${camera.name}</p>
                            <p class="purchaseCam_price">Prix unitaire : ${camera.price/100}€</p>
                            <div class="calculPrice">
                                <select name="quantity" id="purchaseCam_quantity-cam"  value="">
                                    <option value="${camera.quantity}">${camera.quantity}</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>    
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option> 
                                </select>
                                <span class="purchaseCam_total">${camera.price/100*camera.quantity}€</span>
                            </div>
                            <p class="trash-can"><i class="fas fa-trash-alt"></i></p>
                        </div>
                    </div>
                    ` 
                )
                    //CALCUL PRIX TOTAL / ARTICLE
                    let camQuantity = document.getElementById('purchaseCam_quantity-cam');
                    camQuantity = camQuantity.value;
                    camQuantity = parseInt(camQuantity);
                    
                    let cameraTotalPrice = camera.price/100 * camQuantity;
                        addPrice.push(cameraTotalPrice);

                    
                /*let cameras = Object.values(basketItems);*/
                /*cameras.forEach((camera) => {
                    let camQuantity = document.getElementById('purchaseCam_quantity-cam');*/
                    /*camQuantity.addEventListener('change', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        let uploadCamQuantity = e.target.value;
                        uploadCamQuantity = parseInt(uploadCamQuantity)
                        console.log(basketItems);
                        camera.quantity = uploadCamQuantity;
                        localStorage.setItem('camerasInBasket', JSON.stringify(basketItems));
                        location.reload();*/
                    /*});
                })*/ 

            });

                /*const trashCan = document.getElementsByClassName('trash-can');
                trashCan.addEventListener('click', () => {
                    deleteCamInBasket(basketItems[product._id])
                })*/

                // CALCUL PRIX TOTAL
                const cumul = (accumulator,currentValue) => accumulator + currentValue;
                let totalPrice = addPrice.reduce(cumul);

                localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
                
                // CREATION BOUTON VALIDER LA COMMANDE & VIDER LE PANIER
                let div = document.createElement('div');
                basketTitle.appendChild(div);
                div.classList.add('totalPrice')
            
                div.innerHTML = (
                    `
                    <h2>Total = <span id="final-price">${totalPrice}</span>€</h2>
                    <button id="valid_basket"><i class="fas fa-check"></i>Valider mon panier</button></br>
                    <button id="delete_basket"><i class="fas fa-trash-alt"></i>Vider le panier</button>
                    
                    `  
                )  
    };
}

showBasket();


// ACTION BOUTON "VALIDER MON PANIER"
const validButton = () => {
    let validBasket = document.getElementById('valid_basket');

    validBasket.addEventListener('click', () => {
        let form = document.getElementById('form');
        form.style.display = 'block'; 
    })
}
validButton();


// ACTION BOUTON VIDER LE PANIER
const deleteButton = () => {
    let deleteBasket = document.getElementById('delete_basket');

    deleteBasket.addEventListener('click', () => {
        localStorage.clear();
        location.reload();
    })
}
deleteButton();


// VERIFIER LE FORMULAIRE POUR VALIDATION
//  VALIDER LE FORMULAIRE

const validForm = () => {
    const formContact = document.querySelector('form');
    formContact.addEventListener('submit', (e) => {
        e.preventDefault();

        let formIsInvalid = '';
        let firstName = document.getElementById('firstName').value;
        let lastName = document.getElementById('lastName').value;
        let address = document.getElementById('address').value;
        let city = document.getElementById('city').value;
        let email = document.getElementById('email').value;

        if (/[0-9]/.test(lastName) || /!,.;:()?~%&^/.test(lastName) || !lastName) { 
            formIsInvalid += "Veuillez renseigner un Nom valable \n";
        }
        if (/[0-9]/.test(firstName) || /[!,.;:()?~%&^]/.test(firstName) || !firstName) {
            formIsInvalid += "Veuillez renseigner un Prénom valable \n";
        }
        if (!address) {
            formIsInvalid += "Veuillez renseigner votre adresse \n";
        }
        if (/[0-9]/.test(city) || !city) {
            formIsInvalid += "Veuillez renseigner votre ville \n";
        }
        /*if (/.+@.+\..+/.test(email)) {
            formIsInvalid += "Veuillez renseigner un email valable";
        }*/
        if (formIsInvalid) {
            alert('Nous ne pouvons finaliser votre commande : \n' + formIsInvalid);
        }
        else {
            let contact = {
                firstName : firstName,
                lastName : lastName,
                address : address,
                city : city,
                email : email,
            };

            let products = [];
            products = Object.keys(basketItems);
            
            
            let order = { 
            contact,
            products,
            };

            sendPost(order);
        }
    })  
}
validForm();


//REQUÊTE SERVEUR POUR L'ENVOI DES DONNÉES DE COMMANDE
const sendPost = async(data) => {    
    let response = await fetch('http://localhost:3000/api/cameras/order', {
        method: 'POST',
        headers:  {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(data)
    })
    if (response.ok) {
        let responseData = await response.json();
            console.log(responseData);
            let orderId = responseData.orderId;
            console.log(orderId);
            location.assign(`confirmation.html?order=${orderId}`);

    } else {
        console.log(response.status);
            alert('Problème lors de l\'envoie de votre commande, veuillez revalider votre commande.');
    }
       
} 
