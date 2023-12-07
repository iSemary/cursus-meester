import React, { useEffect, useRef, useState } from "react";
import { BigPlayButton, Player } from "video-react";
import "node_modules/video-react/dist/video-react.css";
import { Token } from "../utilities/Authentication/Token";
import axiosConfig from "../axiosConfig/axiosConfig";

export default function MediaPlayer({ lectureId, media, setCourseFinished }) {
    const [videoUrl, setVideoUrl] = useState(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [key, setKey] = useState(0);

    const playerRef = useRef(null);

    useEffect(() => {
        if (media) {
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

    /** Call lecture watched api on playing */
    const handlePlayEvent = () => {
        axiosConfig
            .get(`lectures/view/${lectureId}`)
            .then((response) => {})
            .catch((error) => {
                console.error(error);
            });
    };

    /** On playing the video keep update the currentTime and update current student lecture state  */
    useEffect(() => {
        if (videoUrl) {
            setInterval(() => {
                setCurrentTime(
                    playerRef?.current?.manager?.video?.props?.player
                        ?.currentTime
                );
            }, 3000);
        }
    }, [videoUrl]);

    useEffect(() => {
        if (videoUrl && lectureId && currentTime) {
            axiosConfig
                .get(`lectures/view/${lectureId}?playtime=${currentTime}`)
                .then((response) => {
                    if (response.data.data.course_finished) {
                        setCourseFinished(true);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [currentTime]);

    return (
        <div key={key}>
            {videoUrl && (
                <Player key={key} ref={playerRef} onPlay={handlePlayEvent}>
                    <BigPlayButton position="center" />
                    <source key={key} src={videoUrl} />
                </Player>
            )}
        </div>
    );
}
