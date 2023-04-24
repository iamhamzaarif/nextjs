import {useState} from "react";
import {GoogleMap, useJsApiLoader, MarkerClusterer} from "@react-google-maps/api";
import CustomMarker from "../Maps/CustomMarkers";

interface Location {
    id: string;
    lat: number;
    lng: number;
}

const containerStyle = {
    width: "90%",
    height: "500px",
};

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
        disableDefaultUI: true,
        scaleControl: true,
        mapTypeId: "roadmap",
        labels: true
    };

    const defaultCenter = {lat: -33.851702, lng: 151.216968};

    return isLoaded ? (
        <GoogleMap
            id="circle-example"
            mapContainerStyle={containerStyle}
            center={defaultCenter}
            zoom={5}
            options={options}
            onLoad={onLoad}
            onUnmount={onUnmount}
        >
            <MarkerClusterer>
                {clusterer =>
                    locations.map((loc: Location) => (
                        <CustomMarker
                            key={loc.id}
                            position={loc}
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
