import React from "react";
import Header from "../layouts/Header";
import Footer from "../layouts/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../public/assets/css/style.css";
import "gridjs/dist/theme/mermaid.css";
export default function StudentTemplate({ children }) {
    return (
        <div>
            <Header />
            <div className="container">{children}</div>
            <Footer />
        </div>
    );
}
