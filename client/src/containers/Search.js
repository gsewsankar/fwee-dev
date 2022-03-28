import React from "react";
import {
    useLocation
  } from "react-router-dom";

function Search(){
    const { search } = useLocation();
    let params = new URLSearchParams((search), [search]);
    let query = params.get('q');
    return(
        <div>
            <h1>Search {query}</h1>
        </div>
    )
}

export default Search;