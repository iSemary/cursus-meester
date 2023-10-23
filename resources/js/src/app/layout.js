import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const User = {
    type: 1,
};

export const metadata = {
    title: "Cursus Meester",
    description: "E-Learning platform",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
