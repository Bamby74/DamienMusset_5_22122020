let basketItems = localStorage.getItem('camerasInBasket');
basketItems = JSON.parse(basketItems);


let basketTitle = document.getElementById('basket_map');

const showBasket = () => {
    if (basketItems == null || basketItems == undefined) {

        basketTitle.innerHTML = (
            `
            <h1>
                <i id="basket_icon" class="fas fa-shopping-cart"></i><br>
                Votre panier est vide !
            </h1>
            `
        );
    }   else  {
            let cameras = Object.values(basketItems);
            console.log(cameras);
            let addPrice = [];
            
            cameras.forEach((camera) => {
                
                basketTitle.innerHTML += (
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
                    //CALCUL RIX TOTAL / ARTICLE
                    let camQuantity = document.getElementById('purchaseCam_quantity-cam');
                    let camQuantitySelected = camQuantity.value;
                    camQuantitySelected = parseInt(camQuantitySelected);
                    
                    let cameraTotalPrice = camera.price/100*camQuantitySelected;
                        addPrice.push(cameraTotalPrice)
                    
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
    
                /*let cameraTotalPrice = camera.price/100*uploadCamQuantity;
                addPrice.push(cameraTotalPrice) ; */ 

                /*const trashCan = document.getElementsByClassName('trash-can');
                trashCan.addEventListener('click', () => {
                    deleteCamInBasket(basketItems[product._id])
                })*/

            
                const cumul = (accumulator,currentValue) => accumulator + currentValue;
                let totalPrice = addPrice.reduce(cumul);
                
                let div = document.createElement('div');
                basketTitle.appendChild(div);
                div.classList.add('totalPrice')
            
                div.innerHTML = (
                    `
                    <h2>Total = ${totalPrice}€</h2>
                    <button id="ValidBasket"><i class="fas fa-check"></i>Valider mon panier</button>
                    
                    `  
                )  
    };
}

showBasket();


/*deleteCamInBasket = (basketItems[product._id]) => {
    localeStorage.clear(basketItems[product._id])
    location.reload();
};*/

// BOUTON "VALIDER MON PANIER"

let validBasket = document.querySelector('button');

validBasket.addEventListener('click', () => {
   let form = document.getElementById('form');
   form.style.display = 'block'; 
})

// VERIFIER LE FORMULAIRE POUR VALIDATION
//  VALIDER LE FORMULAIRE

const validForm = () => {
    const formContact = document.querySelector('form');
    formContact.addEventListener('submit', (e) => {
        e.preventDefault();

        let formIsInvalid = '';
        let firstName = document.getElementById('firstName').value;
        let lastName = document.getElementById('lastName').value;
        let adress = document.getElementById('adress').value;
        let city = document.getElementById('city').value;
        let email = document.getElementById('email').value;

        if (/[0-9]/.test(lastName) || /!,.;:()?~%&^/.test(lastName) || !lastName) { 
            formIsInvalid += "Veuillez renseigner un Nom valable \n";
        }
        if (/[0-9]/.test(firstName) || /[!,.;:()?~%&^]/.test(firstName) || !firstName) {
            formIsInvalid += "Veuillez renseigner un Prénom valable \n";
        }
        if (!adress) {
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
                address : adress,
                city : city,
                email : email,
            };

            let products = [];
            products = Object.keys(basketItems);
            
            
            let order = { 
            contact,
            products
            };
            
            sendPost(order);
            /*fetch('http://localhost:3000/api/cameras/order',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
                })
            .then(response => response.json())
            .then(response => console.log(response));*/
        }
    })  
}
validForm();



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
            alert('👏🏼 👏🏼 👏🏼 👏🏼 👏🏼 Félicitations 👏🏼 👏🏼 👏🏼 👏🏼 👏🏼 \n Votre commande est bien enregistrée !');
    } else {
        console.log(response.status);
            alert('Problème lors de l\'envoie de votre commande, veuillez renvoyer votre commande.');
    }
       
} 
