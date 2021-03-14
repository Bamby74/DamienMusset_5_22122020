let basketItems = getLocalStorage('camerasInBasket');
const showBasket = () => {
    if(!basketItems) {
        emptyBasket()
    }else {
        let cameras = Object.values(basketItems);
        let cams = cameras.flatMap(appareil => appareil.lenses.map(lense => {
            return {
                id: appareil.id,
                lense: lense.name,
                quantity: lense.quantity
            }
        }));
        getCameras().then(basket => {
            
            let basketList = document.getElementById('basket_list');
            cams.forEach((cam) => {
                const findCam = basket.find(camInBasket => camInBasket._id === cam.id);
                let cameraTotalPrice = calculCamPrice(cam,findCam);
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
                                <input name="quantity" class="purchaseCam_quantity-cam" type="number" value="${cam.quantity}" min="1" max="10">
                                <p><span class="purchaseCam_total">${cameraTotalPrice}</span> €</p>
                            </div>
                            <p id="trash-can" class="trash-can"><i class="fas fa-trash-alt"></i></p>    
                        </div>
                    </article>
                    ` 
                )
            });
            // CREATION BOUTON VALIDER LA COMMANDE & VIDER LE PANIER
            let totalPrice = cumulPrice();
            let basketTitle = document.getElementById('basket_map');
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
            //FONCTIONS D'ÉVÈNEMENTS
            updatePriceWithQuantity();
            deleteProduct();
            deleteBasket();
            validBasket();
            //VALIDATION ENTRÉE DU FORMULAIRE
            validInput('nom');
            validInput('prenom');
            validInput('adresse');
            validInput('ville');
            validInput('email');
            //SOUMISSION DU FORMULAIRE AVEC REQUÊTE POST 
            submitForm()  
        }).catch(error => console.log(error));
    }
}
showBasket();


