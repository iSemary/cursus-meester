import React, { useEffect, useRef } from "react";
import { Player } from "video-react";
import "node_modules/video-react/dist/video-react.css";

export default function MediaPlayer() {
    const playerProps = {
        source: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
        options: undefined,
    };
    return (
        <Player>
            <source src={playerProps.source} />
        </Player>
    );
}
