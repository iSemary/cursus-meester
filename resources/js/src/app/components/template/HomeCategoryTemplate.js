import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HomeCategoryTemplate({ category, containerClass }) {
    return (
        <div className={"home-category-box " + containerClass}>
            <Link href={`/categories/${category.slug}`} className="no-link">
                <img
                    src={category.icon}
                    width={300}
                    height={300}
                    alt={category.title + " thumbnail"}
                />
                <h5 className="my-1">{category.title}</h5>
            </Link>
        </div>
    );
}
