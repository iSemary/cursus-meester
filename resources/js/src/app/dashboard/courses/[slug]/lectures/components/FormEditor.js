import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import React, { useEffect, useState } from "react";
import { AiOutlineLink, AiOutlineVideoCamera } from "react-icons/ai";
import { BsSortNumericDown } from "react-icons/bs";
import { ImFileText2 } from "react-icons/im";
import { MdOutlineTitle } from "react-icons/md";
import { Dropzone, FileMosaic } from "@files-ui/react";
import { LuFileStack } from "react-icons/lu";
import axiosConfig from "../../../../../components/axiosConfig/axiosConfig";
import { Dropdown } from "primereact/dropdown";
import { VscTypeHierarchySub } from "react-icons/vsc";

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
    const [sections, setSections] = useState([]);

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

    const handleRemoveLectureFile = (id) => {
        // Remove Lecture File
        axiosConfig
            .delete(`lecture-file/${lecture.slug}/${id}`)
            .then((response) => {})
            .catch(({ response }) => {
                console.log(response);
            });
    };

    const removeLectureFiles = (id) => {
        setLectureFiles(lectureFiles.filter((x) => x.id !== id));
        handleRemoveLectureFile(id);
    };

    useEffect(() => {
        if (lecture.id) {
            axiosConfig
                .get(
                    process.env.NEXT_PUBLIC_API_URL +
                        "/lectures/" +
                        lecture.id +
                        "/sections"
                )
                .then((response) => {
                    setSections(response.data.data.sections);
                });
        }
    }, [lecture.id]);

    useEffect(() => {
        setSections(course.sections);
    }, [course.sections]);
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
                        value={lecture.order_number}
                        required
                    />
                </div>
                <div className="col-md-6 p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                        <VscTypeHierarchySub />
                    </span>
                    <Dropdown
                        options={sections}
                        optionLabel="title"
                        optionValue="id"
                        placeholder="Section"
                        className="w-full md:w-14rem"
                        editable
                        name="lecture_section_id"
                        onChange={handleChangeLecture}
                        value={lecture.lecture_section_id}
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
                            maxFiles={10}
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
