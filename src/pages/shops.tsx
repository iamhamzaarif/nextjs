import {Layout} from "..//layout";
import MapContainer from "../components/Maps/Maps";

const locations = [
    {lat: -31.56391, lng: 147.154312},
    {lat: -33.718234, lng: 150.363181},
    {lat: -33.727111, lng: 150.371124},
    {lat: -33.848588, lng: 151.209834},
    {lat: -33.851702, lng: 151.216968},
    {lat: -34.671264, lng: 150.863657},
    {lat: -35.304724, lng: 148.662905},
    {lat: -36.817685, lng: 175.699196},
    {lat: -36.828611, lng: 175.790222},
    {lat: -37.75, lng: 145.116667},
    {lat: -37.759859, lng: 145.128708},
    {lat: -37.765015, lng: 145.133858},
    {lat: -37.770104, lng: 145.143299},
    {lat: -37.7737, lng: 145.145187}
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
