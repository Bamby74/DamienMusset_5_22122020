let cameras;
const camMap = document.getElementById('cam_map');

// API REQUEST
const fetchCameras = async() => {
cameras = await fetch(
    'http://localhost:3000/api/cameras')
    .then(res => res.json());
    console.log(cameras);    
};

 

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






