getCameras().then((cameras) => {
    const camMap = document.getElementById('cam_map');
    camMap.innerHTML = (
        cameras
            .map(camera => (
                `
                <article class="cam_card">
                    <div class="cam_photo">
                        <img class="cam_photo-img" src="${camera.imageUrl}" alt="Camera">
                    </div>
                    <div class="cam_info">
                        <p class="cam_info-name">${camera.name}</p>
                        <p class="cam_info-description">${camera.description}</p>
                        <div class="cam_lastline-price">${camera.price/100}€</div>                        
                        <a href='produit.html?id=${camera._id}' class="btn"><i class="fas fa-info-circle"></i> Détails</a> 
                    </div>  
                </article>
                `
        )).join('')
    );
}).catch((error) => console.log(error)); 





