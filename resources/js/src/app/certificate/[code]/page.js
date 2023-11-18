"use client";
import React, { useEffect, useState } from "react";
import StudentTemplate from "../../Templates/StudentTemplate";
import TaskLoader from "../../components/loaders/TaskLoader";
import axiosConfig from "../../components/axiosConfig/axiosConfig";

export default function certificateChecker({ params }) {
    const code = params.code;
    const [certificate, setCertificate] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosConfig
            .get(`certificates/${code}/provide`)
            .then((response) => {
                setLoading(false);
                setCertificate(response.data.data.certificate);
            })
            .catch(({ response }) => {
                setLoading(false);
            });
    }, [code]);

    return (
        <StudentTemplate>
            {loading ? (
                <TaskLoader />
            ) : certificate ? (
                <div className="text-center">
                    <div>
                        <img
                            src={"/assets/images/icons/valid-certificate.png"}
                            width={150}
                            height={150}
                        />
                        <p className="mt-3 text-center font-weight-bold">
                            This reference code is associated with a valid
                            certificate.
                        </p>
                    </div>
                    <iframe
                        src={certificate.certificate_link}
                        width="800"
                        height="600"
                    ></iframe>
                </div>
            ) : (
                <div className="text-center">
                    <img
                        src={"/assets/images/icons/invalid-certificate.png"}
                        width={150}
                        height={150}
                    />
                    <p className="mt-3 text-center font-weight-bold">
                        There's no certificate found for this reference code.
                    </p>
                </div>
            )}
        </StudentTemplate>
    );
}
