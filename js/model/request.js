
//Requête pour obtenir la liste d'une caméra
const getCameras = (data) => fetch(data)
    .then(res => res.json());
 
//Requête pour envoyer les données de commande
const sendOrder = (data) => fetch('http://localhost:3000/api/cameras/order', {
    method: 'POST',
    headers:  {
        'Content-Type' : 'application/json'
    },
    body: JSON.stringify(data)
})
.then(res => res.json());

//Générer nouveau URL selon paramètre voulu.
const generateUrl = (param) => {
    const newParam = new URLSearchParams(window.location.search).get(`${param}`);
    return new URL (`/api/cameras/${newParam}`, 'http://localhost:3000/api/cameras');
}




