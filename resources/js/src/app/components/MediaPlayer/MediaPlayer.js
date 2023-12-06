import React, { useEffect, useState } from "react";
import { Player } from "video-react";
import "node_modules/video-react/dist/video-react.css";
import { Token } from "../utilities/Authentication/Token";

export default function MediaPlayer({ media }) {
    const [videoUrl, setVideoUrl] = useState(null);
    const [key, setKey] = useState(0);

    useEffect(() => {
        if (media) {
            console.log("FIRED media");
            const url =
                process.env.NEXT_PUBLIC_API_URL +
                "/resources/media/" +
                media +
                "/" +
                Token.get();
            setVideoUrl(url);
            setKey((prevKey) => prevKey + 1);
        }
    }, [media]);

    return (
        <div key={key}>
            {videoUrl && (
                <Player key={key}>
                    <source key={key} src={videoUrl} />
                </Player>
            )}
        </div>
    );
}
