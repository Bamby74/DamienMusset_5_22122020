//RÉCUPÉRATION DES PRODUITS DANS LOCALSTORAGE
let basketItems = localStorage.getItem('camerasInBasket');
basketItems = JSON.parse(basketItems);
console.log(basketItems)
//AFFICHAGE PRODUIT DANS LOCALSTORAGE SI PRÉSENTS
let basketTitle = document.getElementById('basket_map');

let basket;

const fetchCameras = async() => {
    try {
        let response = await fetch('http://localhost:3000/api/cameras')
        if (response.ok) {
            basket = await response.json();
            console.log(basket);    
        } else {
            alert('Serveur indisponible');
        }
    } catch (e){
        console.log(e);
    }
}  
fetchCameras();

const showBasket = async() => {
    await fetchCameras();
    
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

            let cams = cameras.flatMap(appareil => appareil.lenses.map(lense => {
                return {
                    id: appareil.id,
                    lense: lense.name,
                    quantity: lense.quantity
                }
            }))
            console.log(cams);
            let addPrice = [];

            let basketList = document.getElementById('basket_list');
            
            cams.forEach((cam) => {
                const findCam = basket.find(camInBasket => camInBasket._id === cam.id);
                console.log(findCam)

                //CALCUL PRIX TOTAL / ARTICLE
                let camQuantity = cam.quantity;
        
                let cameraTotalPrice = findCam.price/100 * camQuantity;
                    addPrice.push(cameraTotalPrice);

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
                                <select name="quantity" id="purchaseCam_quantity-cam"  value="">

                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>    
                                    <option value="4">4</option>    
                                    <option value="5">5</option>
                                    <option value="6">6</option>
                                    <option value="7">7</option> 
                                </select>
                                <span id="purchaseCam_total">${cameraTotalPrice}€</span>
                            </div>
                            <p id="trash-can" class="trash-can"><i class="fas fa-trash-alt"></i></p>
                        </div>
                    </article>
                    ` 
                )

                /*const changeQuantity = (e) => {
                    document.getElementById('purchaseCam_quantity-cam').addEventListener('change', (e) => {
                        
                        
                        let uploadCamQuantity = e.target.value;
                        uploadCamQuantity = parseInt(uploadCamQuantity)
                        console.log(basketItems);
                        cam.quantity = uploadCamQuantity;
                        console.log(cam)
                        localStorage.setItem('camerasInBasket', JSON.stringify(basketItems));
                        location.reload();
                    })
                }
                changeQuantity();*/
            });
                // BOUTTON SUPPRIMER ARTICLE DU PANIER
                let removeCamButton = document.getElementsByClassName('fas')
                for (let i = 0 ; i < removeCamButton.length ; i++) {
                    let button = removeCamButton[i]
                    button.addEventListener('click',(e) => {
                        let buttonClicked = e.target
                        let deleteCamId = buttonClicked.parentElement.parentElement.parentElement.getElementsByClassName('cam-id')[0].innerText;
                        let deleteCamLense = buttonClicked.parentElement.parentElement.parentElement.getElementsByClassName('cam-lense')[0].innerText;
                        const findCamId = basketItems.find(item => item.id === deleteCamId);
                        const findCamLense = findCamId.lenses.find(lense => lense.name === deleteCamLense);
                        let indexFindCamLense = findCamId.lenses.indexOf(findCamLense);
                        findCamId.lenses.splice(indexFindCamLense,1);
                        localStorage.setItem('camerasInBasket', JSON.stringify(basketItems))
                        buttonClicked.parentElement.parentElement.parentElement.remove();
                        location.reload();                       
                    })
                }

                /*// UPDATE LOCALSTORAGE
                const deleteCamStorage = () => {
                   let deleteCamId = buttonClicked.parentElement.parentElement.parentElement.getElementsByClassName('cam-id').value;
                   let deleteCamLense = buttonClicked.parentElement.parentElement.parentElement.getElementsByClassName('cam-lense').value;
                   const findCamId = basketItems.find(item => item.id === deleteCamId);
                   const findCamLense = findCamId.lenses.find(lense => lense.name === deleteCamLense);
                   findCamLense.remove();
                   localStorage.setItem('camerasInBasket', JSON.stringify(basketItems))
                }*/

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

/*// CHANGEMENT PRIX EN FONCTION QUANTITE ARTICLE               
const quantitySelected = async() => {
    await fetchCameras();
    let selectQuantity = document.querySelector('select');
    selectQuantity.addEventListener('change', () => {
        let cameraTotalPrice = findCam.price/100 * selectQuantity.value;
        addPrice.push(cameraTotalPrice);
        document.getElementById('purchaseCam_total').innerHTML = (
            `
            <span class="purchaseCam_total">${cameraTotalPrice}€</span>
            `
        )
        console.log(cam)
        console.log(cameras)
        
    })
}*/



// ACTION BOUTON "VALIDER MON PANIER"
const validButton = async() => {
    await fetchCameras();

    let validBasket = document.getElementById('valid_basket');

    validBasket.addEventListener('click', () => {
        let form = document.getElementById('form');
        form.style.display = 'block'; 
    })
}
validButton();

// ACTION BOUTON VIDER LE PANIER
const deleteButton = async() => {
    await fetchCameras();

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
            basketItems.forEach((item) => {
            products.push(item.id)
            })
            
            let order = { 
            contact,
            products,
            };
            console.log(order)
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
