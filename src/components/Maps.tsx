import {useState} from "react";
import {GoogleMap, MarkerF, useJsApiLoader, MarkerClusterer} from "@react-google-maps/api";

const containerStyle = {
    width: "90%",
    height: "500px",
};

const center = {
    lat: 37.7749,
    lng: -122.4194,
};

interface Location {
    id: string;
    lat: number;
    lng: number;
}

function Map({locations}: any) {
    const [map, setMap] = useState(null);
    const {isLoaded}: any = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY as string,
    });

    const onLoad = (mapInstance: any) => {
        setMap(mapInstance);
    };

    const onUnmount = () => {
        setMap(null);
    };
    const options = {
        imagePath: `/marker`,
        gridSize: 50
    };
    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={5}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <MarkerClusterer options={options}>
                {(clusterer) =>
                    locations.map((location: Location) => (
                        <MarkerF
                            key={location.id}
                            position={{lat: location.lat, lng: location.lng}}
                            clusterer={clusterer}
                        />
                    ))
                }
            </MarkerClusterer>
        </GoogleMap>
    ) : (
        <>Loading...</>
    );
}

export default Map;
