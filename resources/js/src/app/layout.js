import { Inter } from "next/font/google";
import Header from "./layouts/Header";
import Footer from "./layouts/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../public/assets/css/style.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Geest Gids",
    description: "E-Learning platform",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Header />
                {children}
                <Footer />
            </body>
        </html>
    );
}
