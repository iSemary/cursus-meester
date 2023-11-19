import React, { useEffect, useRef, useState } from "react";
import { AiOutlineClear } from "react-icons/ai";
import { IoSearch } from "react-icons/io5";
import axiosConfig from "../../components/axiosConfig/axiosConfig";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
export default function SearchBar() {
    const searchParams = useSearchParams();
    const [keyword, setKeyword] = useState(null);
    const [tinyResults, setTinyResults] = useState([]);

    // default query from url
    const q = searchParams.get("q");

    const searchResults = useRef(null);
    const searchResultsList = useRef(null);

    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
    };

    /** change visibility based on results */
    const searchResultsDrawer = (results) => {
        if (results.length > 0) {
            searchResults.current.style.visibility = "visible";
        } else {
            searchResults.current.style.visibility = "hidden";
        }
    };
    /** On changing on the search results then reformat the search result list */
    useEffect(() => {
        searchResultsDrawer(tinyResults);
    }, [tinyResults]);

    /** Get a short list of search with title and slug */
    useEffect(() => {
        if (keyword !== q) {
            axiosConfig.get(`search/tiny?q=${keyword}`).then((response) => {
                setTinyResults(response.data.data.results);
            });
        } else {
            searchResultsDrawer([]);
        }
    }, [keyword]);

    useEffect(() => {
        setKeyword(q);
    }, [q]);

    return (
        <div className="search-container">
            <form method="GET" action="/search">
                <input
                    type="text"
                    className="nav-search"
                    placeholder="Search for courses, instructors, and categories..."
                    name="q"
                    value={keyword}
                    onChange={handleSearchChange}
                    required
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
                                      <div className="result-title">
                                          {result.title}
                                      </div>
                                      {result.old && (
                                          <div>
                                              <AiOutlineClear />
                                          </div>
                                      )}
                                  </Link>
                              </li>
                          ))
                        : ""}
                </ul>
            </div>
        </div>
    );
}
