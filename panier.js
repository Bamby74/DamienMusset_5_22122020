//RÉCUPÉRATION DES PRODUITS DANS LOCALSTORAGE
let basketItems = localStorage.getItem('camerasInBasket');
basketItems = JSON.parse(basketItems);

//AFFICHAGE PRODUIT DANS LOCALSTORAGE SI PRÉSENTS
let basketTitle = document.getElementById('basket_map');

let basket;

const fetchCameras = async() => {
    try {
        let response = await fetch('http://localhost:3000/api/cameras');
        if (response.ok) {
            basket = await response.json();    
        }else {
            alert('Serveur indisponible');
        }
    }catch (e){
        console.log(e);
    }
}  
fetchCameras();

const showBasket = async() => {
    await fetchCameras();
    let totalPrice;
    let addPrice = [];
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
    }else  {
        let cameras = Object.values(basketItems);
        let cams = cameras.flatMap(appareil => appareil.lenses.map(lense => {
            return {
                id: appareil.id,
                lense: lense.name,
                quantity: lense.quantity
            }
        }));

        let basketList = document.getElementById('basket_list');
        
        cams.forEach((cam) => {
            const findCam = basket.find(camInBasket => camInBasket._id === cam.id);

            //CALCUL PRIX TOTAL / CAM
            let cameraTotalPrice;
            const calculCamPrice = () => {
                let camQuantity = cam.quantity;
    
                 cameraTotalPrice = findCam.price/100 * camQuantity;
            }
            calculCamPrice();
            //
            basketList.innerHTML += (
                `
                <article class="purchaseCam" data-id="${cam.id}"> 
                    <img class="purchaseCam-image" src='${findCam.imageUrl}' alt='Photo de la caméra ${basket.name}'>
                    <div class="purchaseCam_infos">
                        <h3 class="purchaseCam_infos-name">${findCam.name}</h3>
                        <p class="cam-id">${cam.id}</p>
                        <p class="cam-lense">${cam.lense}</p>
                        <p>Prix unitaire :<span class="purchaseCam_price"> ${findCam.price/100}</span>€</p>
                        <div class="calculPrice">
                            <input name="quantity" id="purchaseCam_quantity-cam" type="number" value="${cam.quantity}" min="1" max="10">
                            <p><span class="purchaseCam_total">${cameraTotalPrice}</span> €</p>
                        </div>
                        <p id="trash-can" class="trash-can"><i class="fas fa-trash-alt"></i></p>    
                    </div>
                </article>
                ` 
            )
        });
        // BOUTTON AJOUT QUANTITÉ
        const addQuantity = () => {
            let quantityCamButtons = document.getElementsByTagName('input');
            for (i = 0 ; i < quantityCamButtons.length ; i++) {
                let quantityButton = quantityCamButtons[i];
                quantityButton.addEventListener('change',(e) => {
                    quantityButtonSelected = e.target;
                    let quantitySelectedCamId = quantityButtonSelected.parentElement.parentElement.parentElement.getElementsByClassName('cam-id')[0].innerText;
                    let quantitySelectedCamLense = quantityButtonSelected.parentElement.parentElement.parentElement.getElementsByClassName('cam-lense')[0].innerText;
                    const findCamId = basketItems.find(item => item.id === quantitySelectedCamId);
                    const findCamLense = findCamId.lenses.find(lense => lense.name === quantitySelectedCamLense);
                    findCamLense.quantity = parseInt(quantityButtonSelected.value);
                    localStorage.setItem('camerasInBasket', JSON.stringify(basketItems));
                    let newCamPriceTotal = quantityButtonSelected.parentElement.getElementsByClassName('purchaseCam_total')[0];
                    let CamPriceUnit = parseInt(quantityButtonSelected.parentElement.parentElement.parentElement.getElementsByClassName('purchaseCam_price')[0].innerText);
                    newCamPriceTotal.textContent = (
                        `
                        ${quantityButtonSelected.value*CamPriceUnit}
                        `
                    )
                    cumulPrice();
                    document.getElementById('final-price').textContent = totalPrice;
                });
            }
        }
        addQuantity();

        // BOUTTON SUPPRIMER ARTICLE DU PANIER
        const deleteProduct = () => {
            let removeCamButton = document.getElementsByClassName('fas');
            for (let i = 0 ; i < removeCamButton.length ; i++) {
                let button = removeCamButton[i];
                button.addEventListener('click',(e) => {
                    let buttonClicked = e.target;
                    let deleteCamId = buttonClicked.parentElement.parentElement.parentElement.getElementsByClassName('cam-id')[0].innerText;
                    let deleteCamLense = buttonClicked.parentElement.parentElement.parentElement.getElementsByClassName('cam-lense')[0].innerText;
                    const findCamId = basketItems.find(item => item.id === deleteCamId);
                    const findCamLense = findCamId.lenses.find(lense => lense.name === deleteCamLense);
                    let indexFindCamLense = findCamId.lenses.indexOf(findCamLense);
                    findCamId.lenses.splice(indexFindCamLense,1);
                    
                    if (findCamId.lenses.length === 0) {
                        let indexFindCamId = basketItems.indexOf(findCamId);
                        basketItems.splice(indexFindCamId,1);    
                    }
                    if (basketItems.length === 0) {
                        localStorage.removeItem('camerasInBasket');
                        localStorage.clear();
                    }else {
                        localStorage.setItem('camerasInBasket', JSON.stringify(basketItems));
                    }   
                    buttonClicked.parentElement.parentElement.parentElement.remove();
                    
                    let checkBasketItems = localStorage.getItem('camerasInBasket');
                    checkBasketItems = JSON.parse(checkBasketItems);
                    if (checkBasketItems === null) {
                        location.reload();
                    }
                });
            }
        }
        deleteProduct();
    
        // CALCUL PRIX TOTAL
        const cumulPrice = () => {
            let cumulPrice = [];
            addPrices = document.getElementsByClassName('purchaseCam_total');
            for (i = 0; i < addPrices.length; i++) {
                addPrice = parseInt(addPrices[i].innerText);
                cumulPrice.push(addPrice);                    
            };
            const cumul = (accumulator,currentValue) => accumulator + currentValue;
            totalPrice = cumulPrice.reduce(cumul);
            localStorage.setItem('totalPrice', JSON.stringify(totalPrice));
        }
        cumulPrice();

        // CREATION BOUTON VALIDER LA COMMANDE & VIDER LE PANIER
        let div = document.createElement('div');
        basketTitle.appendChild(div);
        div.classList.add('totalPrice');
    
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
const validButton = async() => {
    await fetchCameras();
    try {
        let validBasket = document.getElementById('valid_basket');

        validBasket.addEventListener('click', () => {
            let form = document.getElementById('form');
            form.style.display = 'block'; 
        })
    } catch (e){
        console.log(e)
    }
}
validButton();

// ACTION BOUTON VIDER LE PANIER
const deleteButton = async() => {
    await fetchCameras();
    try {
        let deleteBasket = document.getElementById('delete_basket');

        deleteBasket.addEventListener('click', () => {
            localStorage.clear();
            location.reload();
        })
    } catch (e){
        console.log(e)
    }
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

        if (/[0-9]/.test(lastName) || /[!,.;:()?~%&^]/.test(lastName) || !lastName) { 
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
        if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            formIsInvalid += "Veuillez renseigner un email valable";
        }
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
            basketItems.forEach(item => {
                products.push(item.id)
            })
            
            let order = { 
                contact,
                products,
            };
            sendPost(order);
        }
    });  
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
            let orderId = responseData.orderId;
            location.assign(`confirmation.html?order=${orderId}`);
    }else {
        console.log(response.status);
            alert('Problème lors de l\'envoie de votre commande, veuillez revalider votre commande.');
    }   
} 
