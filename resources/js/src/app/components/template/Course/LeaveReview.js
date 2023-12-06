import React, { useState } from "react";
import { Button } from "react-bootstrap";
import axiosConfig from "../../axiosConfig/axiosConfig";
import toastAlert from "../../utilities/Alert";
import { MdStar, MdStarBorder } from "react-icons/md";

export default function LeaveReview({ courseSlug }) {
    const [review, setReview] = useState({ rate: 0, comment: "" });
    const [hoveredRate, setHoveredRate] = useState(0);
    const [formLoading, setFormLoading] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmitReview = (e) => {
        e.preventDefault();
        setFormLoading(true);
        axiosConfig
            .post(`courses/${courseSlug}/rate`, { ...review })
            .then((response) => {
                toastAlert(response.data.message, "success");
                setFormLoading(false);
                setFormSubmitted(true);
            })
            .catch(({ response }) => {
                setFormLoading(false);
                toastAlert(response.data.message, "error");
            });
    };

    const handleChangeIcon = (rate) => {
        setHoveredRate(rate);
    };

    const renderStarButtons = () => {
        const starButtons = [];
        for (let i = 1; i <= 5; i++) {
            const icon =
                i <= (hoveredRate || review.rate) ? (
                    <MdStar />
                ) : (
                    <MdStarBorder />
                );
            starButtons.push(
                <div key={i} className="col-2 px-0 text-center">
                    <button
                        className="star-button"
                        onClick={() => handleChangeRate(i)}
                        onMouseEnter={() => handleChangeIcon(i)}
                        onMouseLeave={() => handleChangeIcon(0)}
                        type="button"
                    >
                        {review.rate >= i ? <MdStar /> : icon}
                    </button>
                </div>
            );
        }
        return starButtons;
    };

    const handleChangeRate = (rate) => {
        setReview({ ...review, rate: rate });
    };

    const handleChangeComment = (e) => {
        setReview({ ...review, comment: e.target.value });
    };

    return (
        <>
            {!formSubmitted && (
                <div
                    className={
                        "review-form " + (formLoading && "disable-content")
                    }
                >
                    <form method="POST" onSubmit={handleSubmitReview}>
                        <div className="form-group">
                            <div className="row m-auto justify-content-center w-fit-content">
                                {renderStarButtons()}
                            </div>
                        </div>
                        <div className="form-group my-2">
                            <textarea
                                rows="5"
                                cols="10"
                                name="comment"
                                maxLength={1024}
                                onChange={handleChangeComment}
                                value={review.comment}
                                placeholder="Your feedback on this course..."
                                className="form-control"
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <Button type="submit">Submit your review</Button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
}
