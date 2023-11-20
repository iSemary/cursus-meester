import { NextResponse } from "next/server";

export async function middleware(request, response) {
    if (request.cookies.get("AUTH_TOKEN")) {
        await fetch(process.env.NEXT_PUBLIC_API_URL + "auth/check", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + request.cookies.get("AUTH_TOKEN"),
            },
        })
            .then((response) => {
                if (!response.ok) {
                    return NextResponse.redirect(
                        new URL("/login", request.url)
                    );
                } else {
                    return NextResponse.redirect(
                        new URL("/login", request.url)
                    );
                }
                // const data = response.json();
                // console.log(data, "NEW-DATA");
            })
            .catch((error) => {
                return NextResponse.redirect(new URL("/login", request.url));
            });
    } else {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}
export const config = {
    matcher: ["/cart"],
};
