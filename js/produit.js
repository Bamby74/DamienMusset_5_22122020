let url = generateUrl('id');

getCameras(url)
    .then((product) => {
        const product_map = document.getElementById("product_map");
        product_map.innerHTML = (
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
            `
        );
        addProductToBasket(product);
    })
    .catch(error => console.log(error));

//LISTE DEROULANTE CHOIX OBJECTIF
const showLenses = (lenses) => {
    let options='';
    lenses.forEach((lense) => {
        options += `<option value='${lense}'>${lense}</option>`;
    });
    return options;
}











