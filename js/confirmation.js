//RÉCUPÉRATION ORDER ID ET PRIX TOTAL DE LA COMMANDE
const congratulationsDisplay = () => {
    const id = new URLSearchParams(window.location.search).get('order');
    const price = new URLSearchParams(window.location.search).get('price');
    let image = document.getElementById('congratulations-image');
    let title = document.getElementById('congratulations-title');
    if (id === null) {
        image.innerHTML = (
            `
            <img class=gif src="images/orderInProcess.png" alt="marteau qui construit appareil photo">
            `
        )
        title.innerHTML = (
            `
            <h2>Vous n'avez aucune commande en cours...<h2>
            `
        )
    }else {
        image.innerHTML = (
            `
            <img class="gif" src="images/GIFCamVintage.gif" alt="image animée d'appareil photo">
            `
        )
        title.innerHTML = (
           `
            <h2 id="congratulations-title">📷 FÉLICITATIONS 📷 </h2>
            <p>Votre commande n° <span id="id">${id}</span> est validée.</p>
            <p>Montant de votre commande : </br>
            </br>
            <strong>${price}€</strong>
            </p>
            `
        )
    }
    localStorage.removeItem('camerasInBasket');
}
congratulationsDisplay();
