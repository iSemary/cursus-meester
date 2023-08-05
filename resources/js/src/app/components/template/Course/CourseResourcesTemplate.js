import React from "react";
import { GoVideo } from "react-icons/go";
import { AiOutlineFile } from "react-icons/ai";

export default function CourseResourcesTemplate({ resources }) {
    return (
        <div>
            {resources &&
                resources.length > 0 &&
                resources.map((resource, index) => (
                    <div className="col-12 resource">
                        <h5 className="font-weight-bold">{resource.title}</h5>
                        <div className="lectures">
                            {resource.lectures &&
                                resource.lectures.length > 0 &&
                                resource.lectures.map((lecture, i) => (
                                    <div className="row lecture">
                                        <div className="col-12 row">
                                            <div className="col-6 align-flex-center">
                                                {lecture.type === 1 ? (
                                                    <GoVideo className="mx-1" />
                                                ) : (
                                                    <AiOutlineFile className="mx-1" />
                                                )}
                                                {lecture.title}
                                            </div>
                                            <div className="col-6 lecture-length text-right text-muted">
                                                <h6 className="text-14">{lecture.length}</h6>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
        </div>
    );
}
