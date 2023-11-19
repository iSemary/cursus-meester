import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClear } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import Link from "next/link";

export default function SearchBar() {
    const [keyword, setKeyword] = useState(null);
    const [tinyResults, setTinyResults] = useState([]);

    const searchResults = useRef(null);
    const searchResultsList = useRef(null);

    const handleSearchSubmit = (e) => {};

    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
    };

    const searchResultsDrawer = (results) => {
        if (results.length > 0) {
            searchResults.current.style.visibility = "visible";
        } else {
            searchResults.current.style.visibility = "hidden";
        }
    };

    useEffect(() => {
        searchResultsDrawer(tinyResults);
    }, [tinyResults]);

    useEffect(() => {
        if (keyword) {
            axiosConfig.get(`search/tiny?q=${keyword}`).then((response) => {
                setTinyResults(response.data.data.results);
            });
        } else {
            searchResultsDrawer([]);
        }
    }, [keyword]);

    return (
        <div className="search-container">
            <form method="GET" onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    className="nav-search"
                    placeholder="Search for courses, instructors, and categories..."
                    name="keyword"
                    value={keyword}
                    onChange={handleSearchChange}
                />
                <button className="btn" type="submit">
                    <IoSearch />
                </button>
            </form>
            <div ref={searchResults} className="search-results">
                <ul ref={searchResultsList}>
                    {tinyResults.length > 0
                        ? tinyResults.map((result, i) => (
                              <li key={result.slug}>
                                  <Link href={`/courses/${result.slug}`}>
                                      <div>{result.title}</div>
                                      <div>
                                          <AiOutlineClear />
                                      </div>
                                  </Link>
                              </li>
                          ))
                        : ""}
                </ul>
            </div>
        </div>
    );
}
