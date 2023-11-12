import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useState } from "react";
import { AiOutlineLink, AiOutlineVideoCamera } from "react-icons/ai";
import { BsSortNumericDown } from "react-icons/bs";
import { ImFileText2 } from "react-icons/im";
import { MdOutlineTitle } from "react-icons/md";
import { Dropzone, FileMosaic } from "@files-ui/react";
import { LuFileStack } from "react-icons/lu";

export default function FormEditor({
    course,
    lecture,
    setLecture,
    lectureVideo,
    setLectureVideo,
    lectureFiles,
    setLectureFiles,
    formLoading,
    setFormLoading,
    handleSubmitLecture,
    btnLabel,
}) {
    const handleChangeLecture = (e) => {
        const { name, value } = e.target;
        setLecture({
            ...lecture,
            [name]: value,
        });
    };

    const handleChangeLectureVideo = (files) => {
        const file = files[0];
        setLectureVideo(file);
    };
    const handleChangeLectureFiles = (files) => {
        setLectureFiles(files);
    };

    const removeLectureVideo = () => {
        setLectureVideo(null);
    };

    const removeLectureFiles = (id) => {
        setLectureFiles(lectureFiles.filter((x) => x.id !== id));
    };

    return (
        <form
            method="POST"
            encType="multipart/form-data"
            onSubmit={handleSubmitLecture}
        >
            <div className="my-2 row">
                <div className="col-md-6 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <MdOutlineTitle />
                    </span>
                    <InputText
                        placeholder="Title"
                        name="title"
                        onChange={handleChangeLecture}
                        value={lecture.title}
                        required
                    />
                </div>
                <div className="col-md-6 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <AiOutlineLink />
                    </span>
                    <InputText
                        placeholder="Slug"
                        name="slug"
                        onChange={handleChangeLecture}
                        value={lecture.slug}
                        required
                    />
                </div>
            </div>
            <div className="my-2 row">
                <div className="col-md-12 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <ImFileText2 />
                    </span>
                    <InputTextarea
                        placeholder="Description"
                        name="description"
                        onChange={handleChangeLecture}
                        value={lecture.description}
                        required
                    />
                </div>
            </div>
            <div className="my-2 row">
                <div className="col-md-6 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <BsSortNumericDown />
                    </span>
                    <InputText
                        placeholder="Order Number"
                        name="order_number"
                        type="number"
                        onChange={handleChangeLecture}
                        value={
                            lecture.order_number
                        }
                        required
                    />
                </div>
            </div>
            <hr />
            <div className="my-2">
                <div className="row">
                    <div className="col-6">
                        <h3>
                            <AiOutlineVideoCamera /> Lecture Video
                            <span className="text-danger">*</span>
                        </h3>
                        <Dropzone
                            onChange={handleChangeLectureVideo}
                            maxFiles={1}
                            accept="video/*"
                            label="Drag'n drop lecture video here"
                        >
                            {lectureVideo ? (
                                <FileMosaic
                                    key={lectureVideo.id}
                                    {...lectureVideo}
                                    onDelete={removeLectureVideo}
                                    info
                                />
                            ) : (
                                ""
                            )}
                        </Dropzone>
                    </div>
                    <div className="col-6">
                        <h3>
                            <LuFileStack /> Lecture Additional Files
                        </h3>
                        <Dropzone
                            onChange={handleChangeLectureFiles}
                            value={lectureFiles}
                            accept="application/pdf, text/plain, text/markdown, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            maxFiles={5}
                            label="Drag'n drop lecture additional files here"
                        >
                            {lectureFiles.map((lectureFile) => (
                                <FileMosaic
                                    key={lectureFile.id}
                                    {...lectureFile}
                                    onDelete={removeLectureFiles}
                                    info
                                />
                            ))}
                        </Dropzone>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <Button
                    label={btnLabel}
                    icon="pi pi-save"
                    type="submit"
                    loading={formLoading}
                    rounded={true}
                    raised={true}
                />
            </div>
        </form>
    );
}
