import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function HomeCategoryTemplate({ category, containerClass }) {
    return (
        <div className={"home-category-box " + containerClass}>
            <Link href={`/categories/${category.slug}`} className="no-link">
                <Image
                    src={category.image}
                    width={300}
                    height={300}
                    alt={category.name + " thumbnail"}
                />
                <h5 className="my-1">{category.name}</h5>
            </Link>
        </div>
    );
}
