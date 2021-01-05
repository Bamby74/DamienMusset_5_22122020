
const camMap = document.getElementById('cam_map');
let cameras;
// API REQUEST
const fetchCameras = async() => {
    try {
        let response = await fetch('http://localhost:3000/api/cameras')
        if (response.ok) {
            cameras = await response.json();
            console.log(cameras);    
        } else {
            alert('Serveur indisponible');
        }
    } catch (e){
        console.log(e);
    }
}  

fetchCameras();

const showCameras = async() => {
    await fetchCameras();

        camMap.innerHTML = (
        
            cameras
                .map(camera => (

                    `
                    <article class="cam-card">
                        <div class="cam-photo">
                            <img class="cam-photo-img" src="${camera.imageUrl}" alt="Camera">
                        </div>
                        <div class="cam-info">
                            <p class="cam_info-name">${camera.name}</p>
                            <p class="cam_info-description">${camera.description}</p>
                            <div class="cam_lastline-price">${camera.price/100}€</div>                        
                            <a href='produit.html?id=${camera._id}' class="btn"><i class="fas fa-info-circle"></i> Détails</a> 
                        </div>  
                    </article>

                    `
            )).join('')
        );
}

showCameras();






