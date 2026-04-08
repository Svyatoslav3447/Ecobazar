    function initMap() {
        const center = { lat: 48.9223, lng: 24.7111 };

        const map = new google.maps.Map(document.getElementById("map"), {
            zoom: 10,
            center: center,
        });

        new google.maps.Marker({
            position: center,
            map: map,
        });
    }