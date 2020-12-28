const params = new URLSearchParams(window.location.search);
const id = params.get('id');
console.log(id);

const url = new URL (`/api/cameras/${id}`, 'http://localhost:3000/api/cameras');

console.log(url);
let product;

const fetchProduct = async() => {
    product =await fetch(url)
        .then(res => res.json());
        console.log(product);
};
 fetchProduct();


const showProduct = async() => {
    await fetchProduct();

    const product_map = document.getElementById("product_map");
    product_map.innerHTML= (

        `
        <h2>Découvrez le ${product.name}</h2>
        <div id="cam_map">
            <article class="cam-card">
                    <div class="cam-photo">
                        <img class="cam-photo-img" src="${product.imageUrl}" alt="Camera">
                    </div>
                    <div class="cam-info">
                        <p class="cam_info-name">${product.name}</p>
                        <p class="cam_info-description">${product.description}</p>
                        <div class="cam_lastline">
                            <select name="lenses" id="lense-select">
                                <option id="option" value="">Choisissez un objectif<option>
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
        addProduct();
    }) 
};  

showProduct();


const showLenses = (lenses) => {
    let options='';
    lenses.forEach(lense => {
        options += `<option value='${lense}'>${lense}<option>`;
    });
    return options;
};
  
function onLoadAddProduct() {
    let productNumbers = localStorage.getItem('product');
    let productCount= document.getElementById('product-count');
    if (productNumbers) {
        productCount.textContent = productNumbers;
    }
};

function addProduct() {
    let productNumbers = localStorage.getItem('product');

    productNumbers=parseInt(productNumbers);

    if (productNumbers) {
        localStorage.setItem('product', productNumbers + 1)
            let productBasket = document.getElementById('product_in-basket');
            let productCount= document.getElementById('product-count');
            productCount.textContent = productNumbers + 1;
        
    }   else {
        localStorage.setItem('product',1);
            let productBasket = document.getElementById('product_in-basket');
            let productCount= document.getElementById('product-count');
            productCount.textContent = 1 ;
    }
} 
onLoadAddProduct();
