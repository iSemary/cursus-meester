import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { TbCertificate } from "react-icons/tb";
import { ImSpinner10 } from "react-icons/im";
import { IoMdLock } from "react-icons/io";
import { FaCloudDownloadAlt } from "react-icons/fa";
import { GrCertificate } from "react-icons/gr";
import axiosConfig from "../../axiosConfig/axiosConfig";
import toastAlert from "../../utilities/Alert";
import FileDownloader from "../../utilities/FileDownloader";

export default function CertificateClaim({ courseId, canClaim, canDownload }) {
    const [loading, setLoading] = useState(false);
    /** Generate and claim new certificate */
    const handleClaimCertificate = (e) => {
        setLoading(true);
        axiosConfig
            .post(`certificates/${courseId}/claim`)
            .then((response) => {
                downloadFile(
                    response.data.data.certificate_path,
                    response.data.data.certificate_name
                );
                setLoading(false);
            })
            .catch(({ response }) => {
                setLoading(false);
                toastAlert(response.data.message, "error");
            });
    };

    /** Download a claimed certificate */
    const handleDownloadCertificate = (e) => {
        setLoading(true);
        axiosConfig
            .get(`certificates/${courseId}/get`)
            .then((response) => {
                downloadFile(
                    response.data.data.certificate_path,
                    response.data.data.certificate_name
                );
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.error(error);
            });
    };

    /** Get file content as blob and download it */
    const downloadFile = (filePath, fileName) => {
        FileDownloader(filePath, fileName);
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
