import Link from "next/link";
import React from "react";

export default function SubCategoriesTemplate({
    categories,
    childClass,
    containerClass,
}) {
    return (
        <div className={"row " + containerClass}>
            {categories &&
                categories.length > 0 &&
                categories.map((category, index) => (
                    <div className={childClass} key={index}>
                        <Link
                            href={`/categories/${category.slug}`}
                            className="no-link"
                        >
                            <img
                                src={category.icon}
                                width={50}
                                height={50}
                                alt={category.title + " thumbnail"}
                            />
                            <h5 className="my-1">{category.title}</h5>
                        </Link>
                    </div>
                ))}
        </div>
    );
}
