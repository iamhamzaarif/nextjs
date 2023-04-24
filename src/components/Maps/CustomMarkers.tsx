import React from "react";
import {MarkerF} from "@react-google-maps/api";

export default function CustomMarker(props: any) {
    const {position, clusterer} = props;

    return (
        <MarkerF position={position} clusterer={clusterer}>
            <h1>Aaron</h1>
        </MarkerF>
    );
}
