//RÉCUPÉRATION DES PRODUITS DANS LOCALSTORAGE
const getLocalStorage = (key) => {
    let valeur = localStorage.getItem(key);
    return JSON.parse(valeur);
}   

//INSÉRER ÉLÉMENT DANS LOCALSTORAGE
const setLocalStorage = (key,valeur) => {
    localStorage.setItem(key, JSON.stringify(valeur));
}

//ANIMATION ICONE PANIER
const basketLogoColor = (color) => {
    let itemsInLocalStorage = getLocalStorage('camerasInBasket');
    let basketLogo = document.getElementById('basket_logo');
    if(itemsInLocalStorage) {
        basketLogo.style.color = color;
    }else{
        basketLogo.style.color = 'black';
    }   
}
basketLogoColor('purple');

// BOUTON AJOUTER AU PANIER
const addProductToBasket = (data) => {
    const button = document.querySelector('button');
    button.addEventListener('click', () => {
        let selectLense = document.querySelector('select').value;
        if (selectLense) {
            updateItems(data);
            basketLogoColor('purple');
        }else {
            alert('Veuillez choisir un objectif pour ajouter votre produit au panier !');
        }
    });
}

//ENVOIE DONNÉES PRODUITS DANS LOCALSTORAGE 
const updateItems = (data)  => {
    let basketItems = getLocalStorage('camerasInBasket');
    let selectLense = document.querySelector('select').value;
    if (basketItems) {
        const findProductId = basketItems.find(item => item.id === data._id);
            if (findProductId) {
                const findProductLense = findProductId.lenses.find(lense => lense.name === selectLense);
                if (findProductLense){
                    findProductLense.quantity += 1;
                    alert('Vous avez ajouté une quantité de cet article dans votre panier !');
                }else {
                    findProductId.lenses.push({
                        name : selectLense , 
                        quantity: 1
                    });
                    alert('Vous avez ajouté votre produit dans votre panier !');
                }
            }else {
                basketItems.push({
                    id : data._id , 
                    lenses: [{name: selectLense ,quantity : 1}] 
                });
                alert('Vous avez ajouté votre produit dans votre panier !');
            }
    }else {    
        data.quantity = 1 ; 
        basketItems = [{
            id : data._id,
            lenses : [{name: selectLense , quantity: data.quantity}],
        }]
        alert('Vous avez ajouté votre produit au panier !');
    }
    setLocalStorage('camerasInBasket',basketItems)
}

// MISE À JOUR DES PRIX EN FONCTION DES QUANTITÉS PRODUITS
const updatePriceWithQuantity = () => {
    let quantityCamButtons = document.getElementsByClassName('purchaseCam_quantity-cam');
    for (i = 0 ; i < quantityCamButtons.length ; i++) {
        let quantityButton = quantityCamButtons[i];
        quantityButton.addEventListener('change',(e) => {
            camSelected = e.target;
            let findCamLense = findGoodCam(camSelected);
            findCamLense.quantity = parseInt(camSelected.value);
            setLocalStorage('camerasInBasket',basketItems);
            let newCamPriceTotal = camSelected.parentElement.getElementsByClassName('purchaseCam_total')[0];
            let camPriceUnit = parseInt(camSelected.parentElement.parentElement.parentElement.getElementsByClassName('purchaseCam_price')[0].innerText);
            newCamPriceTotal.textContent = (
                `
                ${camSelected.value * camPriceUnit}
                `
            )
            document.getElementById('final-price').textContent = cumulPrice();
        });
    }
}

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
            }if (basketItems.length === 0) {
                localStorage.removeItem('camerasInBasket');
            }else {
                setLocalStorage('camerasInBasket',basketItems);
                buttonClicked.parentElement.parentElement.parentElement.remove();
            }   
            let checkBasketItems = getLocalStorage('camerasInBasket');
            if (checkBasketItems === null) {
                emptyBasket();
                basketLogoColor('purple');
            }else {
                document.getElementById('final-price').textContent = cumulPrice();
            } 
        });
    }
}

//TROUVER CAMERA DANS LOCAL STORAGE LORS D"INTERACTION AJOUT QUANTITE OU SUPPRESSION ARTICLE
const findGoodCam = (camSelected) => {
    let camSelectedId = camSelected.parentElement.parentElement.parentElement.getElementsByClassName('cam-id')[0].innerText;
    let camSelectedLense = camSelected.parentElement.parentElement.parentElement.getElementsByClassName('cam-lense')[0].innerText;
    const findCamSelectedId = basketItems.find(item => item.id === camSelectedId);
    const findCamSelectedLense = findCamSelectedId.lenses.find(lense => lense.name === camSelectedLense);
    return findCamSelectedLense
}

//PRIX TOTAL POUR UN PRODUIT
const calculCamPrice = (data,findData) => {
    debugger
    let camQuantity = data.quantity;
    return findData.price/100 * camQuantity;
}

// CALCUL PRIX TOTAL DE TOUS LES PRODUITS
const cumulPrice = () => {
    let cumulPrice = [];
    let addPrice =[];
    let addPrices = document.getElementsByClassName('purchaseCam_total');
    for (i = 0; i < addPrices.length; i++) {
        addPrice = parseInt(addPrices[i].innerText);
        cumulPrice.push(addPrice);                    
    };
    const cumul = (accumulator,currentValue) => accumulator + currentValue;
    return cumulPrice.reduce(cumul)
}

// ACTION BOUTON "VALIDER MON PANIER"
const validBasket = () => {  
    let validBasket = document.getElementById('valid_basket');
    validBasket.addEventListener('click', () => {
        let form = document.getElementById('form');
        form.style.display = 'block';
    })
}  

// ACTION BOUTON VIDER LE PANIER
const deleteBasket = () => {
    let deleteBasket = document.getElementById('delete_basket');
    deleteBasket.addEventListener('click', () => {
        localStorage.clear();
        basketLogoColor('purple');
        emptyBasket();
    })   
}

//PANIER VIDE
const emptyBasket = () => {
    let basketTitle = document.getElementById('basket_map');
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
}

//FORMULAIRE
const validInput = (param) => {
    let input = document.getElementById(param);
    input.addEventListener('input', () => {
        input.setCustomValidity('');
        input.checkValidity();
    });
    input.addEventListener('invalid', () => {
        if(input.value === '') {
            input.setCustomValidity(`Entrez votre ${param} !`);
        }else {
            input.setCustomValidity(`Veuillez renseigner un(e) ${param} valable !`);
        }
    });    
}

const submitForm = () => {
    let form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();
        let contact = {
            firstName : document.getElementById('prenom').value,
            lastName : document.getElementById('nom').value,
            address : document.getElementById('adresse').value,
            city : document.getElementById('ville').value,
            email : document.getElementById('email').value,
        };
        let products = [];
        basketItems.forEach(item => {
            products.push(item.id)
        });
        let order = {
            contact,
            products,
        };
        let totalPrice = document.getElementById('final-price').innerText;
        //UTILISATION REQUÊTE POST
        sendOrder(order).then(resData => { location.assign(`confirmation.html?order=${resData.orderId}&price=${totalPrice}`)});
    })
}
