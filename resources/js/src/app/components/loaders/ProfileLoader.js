import React from "react";
import ContentLoader from "react-content-loader";

export const ProfileLoader = ({className}) => {
    return (
        <div className={className}>
            <ContentLoader
                speed={2}
                width={"1000"}
                height={340}
                viewBox="0 0 1000 340"
                backgroundColor="#cfe8f7"
                foregroundColor="#ecebeb"
            >
                <rect x="48" y="5" rx="3" ry="3" width="110" height="8" />
                <rect x="48" y="28" rx="3" ry="3" width="410" height="6" />
                <rect x="48" y="48" rx="3" ry="3" width="380" height="6" />
                <rect x="48" y="68" rx="3" ry="3" width="178" height="6" />
                <circle cx="20" cy="20" r="20" />
                <rect x="48" y="98" rx="24" ry="24" width="423" height="230" />
            </ContentLoader>
            <br/>
            <ContentLoader
                width={"1000"}
                height={540}
                viewBox="0 0 1000 540"
                backgroundColor="#cfe8f7"
                foregroundColor="#ecebeb"
            >
                <rect x="12" y="58" rx="2" ry="2" width="211" height="211" />
                <rect x="240" y="57" rx="2" ry="2" width="211" height="211" />
                <rect x="467" y="56" rx="2" ry="2" width="211" height="211" />
                <rect x="12" y="283" rx="2" ry="2" width="211" height="211" />
                <rect x="240" y="281" rx="2" ry="2" width="211" height="211" />
                <rect x="468" y="279" rx="2" ry="2" width="211" height="211" />
            </ContentLoader>
        </div>
    );
};
