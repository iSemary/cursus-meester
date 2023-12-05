import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { TbCertificate } from "react-icons/tb";
import { ImSpinner10 } from "react-icons/im";
import { IoMdLock } from "react-icons/io";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { GrCertificate } from "react-icons/gr";
import axiosConfig from "../../axiosConfig/axiosConfig";
import toastAlert from "../../utilities/Alert";
import axios from "axios";

export default function CertificateClaim({ courseId, canClaim, canDownload }) {
    const [loading, setLoading] = useState(false);

    const handleClaimCertificate = (e) => {
        setLoading(true);
        axiosConfig
            .post(`certificates/${courseId}/claim`)
            .then((response) => {
                downloadFile(
                    response.data.data.certificate_url,
                    response.data.data.reference_code
                );
                setLoading(false);
            })
            .catch(({ response }) => {
                setLoading(false);
                toastAlert(response.data.message, "error");
            });
    };

    const handleDownloadCertificate = (e) => {
        setLoading(true);
        axiosConfig
            .get(`certificates/${courseId}/get`)
            .then((response) => {
                downloadFile(
                    response.data.data.certificate.certificate_link,
                    response.data.data.certificate.reference_code
                );
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    };

    const downloadFile = (filePath, fileName) => {
        axios({
            method: "get",
            url: filePath,
            responseType: "blob",
            headers: {
                "Content-Type": "application/pdf",
            },
        })
            .then((response) => {
                // Create blob link to download
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const link = document.createElement("a");
                link.href = url;
                link.setAttribute("download", fileName + ".pdf");
                // Append to html link element page
                document.body.appendChild(link);
                // Start download
                link.click();
                // Clean up and remove the link
                link.parentNode.removeChild(link);
            })
            .catch((error) => {
                // Handle errors
                console.error("Error downloading PDF:", error);
            });
        // fetch(filePath, {
        //     method: "GET",
        //     headers: {
        //         "Content-Type": "application/pdf",
        //     },
        // })
        //     .then((response) => response.blob())
        //     .then((blob) => {
        //         // Create blob link to download
        //         const url = window.URL.createObjectURL(new Blob([blob]));
        //         const link = document.createElement("a");
        //         link.href = url;
        //         link.setAttribute("download", fileName + `.pdf`);
        //         // Append to html link element page
        //         document.body.appendChild(link);
        //         // Start download
        //         link.click();
        //         // Clean up and remove the link
        //         link.parentNode.removeChild(link);
        //     });
    };

    return (
        <div className="w-100">
            <hr />
            <h6 className="font-weight-bold">
                <GrCertificate size={20} /> Course Certificate
            </h6>
            <p className="text-left text-muted">
                {canClaim &&
                    "Congratulations on unlocking the gates to brilliance!"}
                {!canClaim &&
                    canDownload &&
                    "Your certificate is available for downloading at any time!"}
                {!canClaim &&
                    !canDownload &&
                    "You have to complete the course before claiming the certificate"}
            </p>
            <Button
                variant={canClaim || canDownload ? "success" : "secondary"}
                disabled={
                    canClaim || canDownload
                        ? loading
                            ? "disabled"
                            : ""
                        : "disabled"
                }
                className="d-flex align-items-center m-auto"
                type="button"
                onClick={
                    canClaim
                        ? (e) => handleClaimCertificate()
                        : !canClaim && canDownload
                        ? (e) => handleDownloadCertificate()
                        : ""
                }
            >
                {loading ? (
                    <ImSpinner10 className="loader-icon" size={17} />
                ) : (
                    <>
                        {canClaim && <TbCertificate size={20} />}
                        {!canClaim && canDownload && (
                            <FaCloudDownloadAlt size={20} />
                        )}
                        {!canClaim && !canDownload && <IoMdLock size={20} />}
                    </>
                )}

                <span>&nbsp;Claim your certificate</span>
            </Button>
        </div>
    );
}
