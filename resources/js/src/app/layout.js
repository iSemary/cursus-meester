import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });
import { AuthProvider } from "./components/hooks/AuthProvider";

// Create a context for the user state
export const metadata = {
    title: "Cursus Meester",
    description: "E-Learning platform",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <AuthProvider>
                <body className={inter.className}>{children}</body>
            </AuthProvider>
        </html>
    );
}
