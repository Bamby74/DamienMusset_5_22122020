let basketItems = localStorage.getItem('camerasInBasket');
basketItems = JSON.parse(basketItems);


let basketTitle = document.getElementById('basket_map');

const showBasket = () => {
    if (basketItems == null) {

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
                                <select name="quantity" id="purchaseCam_quantity-cam" value="">
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
                let camQuantity = document.getElementById('purchaseCam_quantity-cam');
                let camQuantitySelected = camQuantity.options[camQuantity.selectedIndex].value;
                camQuantitySelected = parseInt(camQuantitySelected);
                console.log(camQuantitySelected);

                let cameraTotalPrice = camera.price/100*camQuantitySelected;
                addPrice.push(cameraTotalPrice) ;  

                /*const trashCan = document.getElementsByClassName('trash-can');
                trashCan.addEventListener('click', () => {
                    deleteCamInBasket(basketItems[product._id])
                })*/

                

            });
            
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

const validBasket = document.querySelector('button');
/*let form = document.createElement('div');
basketTitle.appendChild(form);*/



validBasket.addEventListener('click', () => {
   let form = document.getElementById('form');
   form.style.display = 'block'; 
/*form.innerHTML = (
        `<form action="" method="get" class="form-contact">
            <h3>Remplissez ce formulaire afin de valider votre commande</h3>
            <div class="form-container">
                <div class="form-contact">
                    <label for="name"> Nom : </label>
                    <input type="text" name="name" id="lastName" required>
                    <span id="lastNameValid"><span>
                </div>
                <div class="form-contact">
                    <label for="givenName"> Prénom : </label>
                    <input type="text" name="givenName" id="firstName" required>
                </div>
                <div class="form-contact">
                    <label for="adress"> Adresse : </label>
                    <input type="text" name="adress" id="adress" required>
                </div>
                <div class="form-contact">
                    <label for="adress"> Ville : </label>
                    <input type="text" name="city" id="city" required>
                </div>
                <div class="form-contact">
                    <label for="email"> Email : </label>
                    <input type="email" name="email" id="email" required>
                </div>
                <div class="form-contact form-button">
                    <input id="validButton" type="submit" value="Valider ma commande !">
                </div>
            </div>
        </form>
        `
    )*/
})



const validForm = () => {
    const formContact = document.querySelector('form');
    formContact.addEventListener('submit', (e) => {
        event.preventDefault();
        event.stopPropagation();

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
        /*if (/.+@.+\..+/.test(email)
            formIsInvalid += "Veuillez renseigner un email valable";*/

        if (formIsInvalid) {
            alert('Nous ne pouvons finaliser votre commande : \n' + formIsInvalid);
        }
        else {
            const contact = {
                fisrtName : firstName,
                lastName : lastName,
                adress : adress,
                city : city,
                email : email,
            };
            let camerasId = Object.keys(basketItems);
            console.log(contact);
            console.log(camerasId);
        }


    })  
}
validForm();