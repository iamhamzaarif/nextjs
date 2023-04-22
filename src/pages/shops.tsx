import { Layout } from "..//layout";
import MapContainer from "../components/Maps";

const locations = [
    { id: 1, lat: 37.7749, lng: -122.4194 },
    { id: 2, lat: 37.7749, lng: -122.4294 },
    { id: 3, lat: 37.7849, lng: -122.4194 },
    { id: 4, lat: 37.7849, lng: -122.4294 },
];

const Shops = () => {
    return (
        <Layout>
            <div className="flex flex-col justify-center items-center my-28">
            <MapContainer locations={locations}/>
            </div>
        </Layout>
    );
};

export default Shops;
