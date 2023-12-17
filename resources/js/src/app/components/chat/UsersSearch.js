import React, { useState } from "react";
import { InputText } from "primereact/inputtext";

export default function UsersSearch() {
    const [Keyword, setKeyword] = useState("");
    return (
        <div className="users-search-container">
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    value={Keyword}
                    placeholder="Search or start new chat"
                    onChange={(e) => setKeyword(e.target.value)}
                    className="no-shadows no-border-bottom-radius"
                />
            </span>
        </div>
    );
}
