import React,{useState} from "react";

import ProductlistNav from "./ProductlistNav";
import ProductListPage from "./ProductListPage";



function ProductList(){
 

    return(
        <>
        <ProductlistNav />
        <ProductListPage/>
        </>
    )
}

export default ProductList;