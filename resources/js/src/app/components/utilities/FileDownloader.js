import React from "react";
import axiosConfig from "../axiosConfig/axiosConfig";

export default async function FileDownloader(path, name) {
    return await axiosConfig({
        method: "get",
        url: "resources/blob?file_path=" + path + "&file_name=" + name,
        responseType: "blob",
    })
        .then((response) => {
            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", name);
            // Append to html link element page
            document.body.appendChild(link);
            // Start download
            link.click();
            // Clean up and remove the link
            link.parentNode.removeChild(link);
        })
        .catch((error) => {
            // Handle errors
            console.error("Error downloading file:", error);
        });
}
