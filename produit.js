const params = new URLSearchParams(window.location.search);
const id = params.get('id');
console.log(id);

const url = new URL (`/api/cameras/${id}`, 'http://localhost:3000/api/cameras');

console.log(url);
let product;
const fetchProduct = async() => {
    try{
        let response = await fetch(url)
        if (response.ok) {
            product = await response.json();
        } else {
            alert('Serveur indisponible');
        }
    } catch(e) {
        console.log(e);
    }
 }
    

fetchProduct();


const showProduct = async() => {
    await fetchProduct();

    const product_map = document.getElementById("product_map");
    product_map.innerHTML= (

        `
        <h2>Découvrez le ${product.name}</h2>
        <div id="cam_map">
            <article class="cam_card">
                    <div class="cam_photo">
                        <img class="cam_photo-img" src="${product.imageUrl}" alt="Camera">
                    </div>
                    <div class="cam_info">
                        <p class="cam_info-name">${product.name}</p>
                        <p class="cam_info-description">${product.description}</p>
                        <div class="cam_lastline">
                            <select name="lenses" id="lense-select">
                                <option id="option" value="">Choisissez un objectif</option>
                                ${showLenses(product.lenses)}
                            </select>
                            <div class="cam_lastline-price">${product.price/100}€</div>
                        </div> 
                        <button type="button" class="btn btn_add-to-basket"><i class="fas fa-shopping-cart"></i> Ajouter à votre panier</button>                           
                    </div>  
            </article>
        </div>   
        `);
    const button = document.querySelector('button')
    button.addEventListener('click', () => {
        addProduct(product);
    }) 
};  

showProduct();

//ANIMATION ICON PANIER
const basketLogoColor = () => {
  let productNumbers = localStorage.getItem('product');
    productNumbers=parseInt(productNumbers);

    if (productNumbers) {
           let basketLogo = document.getElementById('basket_logo');
            basketLogo.style.color = 'red';
    }   
}
basketLogoColor();

//LISTE DEROULANTE CHOIX OBJECTIF
const showLenses = (lenses) => {
    let options='';
    lenses.forEach((lense) => {
        options += `<option value='${lense}'>${lense}</option>`;
    });
    return options;
};

//FONCTION QUANTITÉ TOTAL PRODUITS  
const addProduct = (product) => {
    
    let productNumbers = localStorage.getItem('product');
    productNumbers=parseInt(productNumbers);

    if (productNumbers) {
        localStorage.setItem('product', productNumbers + 1)
           let basketLogo = document.getElementById('basket_logo');
            basketLogo.style.color = 'red';
    }   else {
        localStorage.setItem('product',1);
           let basketLogo = document.getElementById('basket_logo');
            basketLogo.style.color = 'red';
    }
    setItems(product);
} 


//ENVOIE DONNÉES PRODUITS DANS LOCALSTORAGE
const setItems = (product)  => {
    let basketItems = localStorage.getItem('camerasInBasket');
    basketItems = JSON.parse(basketItems);
    
    if(basketItems != null) {
        
        if(basketItems[product._id] == undefined) {
            product.quantity = 0;
            basketItems = {
                ...basketItems,
                [product._id]: product
            }
        }
        basketItems[product._id].quantity += 1 ;
        alert('Vous avez ajouté votre produit au panier !');
    } else {    
        product.quantity = 1 ; 
        basketItems = {
            [product._id]: product
        }
        alert('Vous avez ajouté votre produit au panier !');
    }

    localStorage.setItem('camerasInBasket', JSON.stringify(basketItems));
}
