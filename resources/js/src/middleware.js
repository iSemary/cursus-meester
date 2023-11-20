import { NextResponse } from "next/server";

export async function middleware(request, response) {
    const authToken = request.cookies.get("AUTH_TOKEN");
    if (authToken) {
        try {
            const apiResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/auth/check`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${authToken.value}`,
                    },
                }
            );
            if (!apiResponse.ok) {
                return redirectToLogin(request);
            }
        } catch (error) {
            console.log("Error occurred while checking authentication:", error);
            return redirectToLogin(request);
        }
    } else {
        return redirectToLogin(request);
    }
}
function redirectToLogin(request) {
    const loginURL = new URL("/login", request.url);
    return NextResponse.redirect(loginURL);
}
/** Authenticated routes */
export const config = {
    matcher: [
        "/cart",
        "/wishlist",
        "/settings",
        "/notifications",
        "/my-courses",
        "/dashboard/:path*", // all dashboard routes
    ],
};
