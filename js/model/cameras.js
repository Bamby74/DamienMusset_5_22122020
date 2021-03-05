//Requête pour obtenir la liste des caméras
const getCameras = () => fetch('http://localhost:3000/api/cameras')
    .then(res => res.json());   


// Récupération paramètre dans l'URL
const generateUrl = (param) => {
    const newParam = new URLSearchParams(window.location.search).get(`${param}`);
    return new URL (`/api/cameras/${newParam}`, 'http://localhost:3000/api/cameras');
}

//Requête pour obtenir la liste d'une caméra
/*let product;*/
const getOneCamera = (data) => fetch(data)
    .then(res => res.json());
 /*   try{
        let response = await fetch(url)
        if (response.ok) {
            product = await response.json();
        } else {
            alert('Serveur indisponible');
        }
    }catch(e) {
        console.log(e);
    }
}*/
     
   
//REQUÊTE SERVEUR POUR L'ENVOI DES DONNÉES DE COMMANDE
/*const sendPost = async(data) => {    
    try{
        let response = await fetch('http://localhost:3000/api/cameras/order', {
            method: 'POST',
            headers:  {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify(data)
        })
        if (response.ok) {
            let responseData = await response.json();
                let orderId = responseData.orderId;
                location.assign(`confirmation.html?order=${orderId}`);
        }else {
            console.log(response.status);
                alert('Problème lors de l\'envoie de votre commande, veuillez revalider votre commande.');
        }
    }catch (e) {
        console.log(error)
    }
}*/ 

const sendOrder = (data) => fetch('http://localhost:3000/api/cameras/order', {
    method: 'POST',
    headers:  {
        'Content-Type' : 'application/json'
    },
    body: JSON.stringify(data)
})
.then(res => res.json());






