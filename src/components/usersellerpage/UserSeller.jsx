import React,{useState} from "react";
import UserSellerNav from "./UserSellerNav";
// import UserSellerpage from "./UserSellerpage";
import SellerToppage from "./Sellertoppage";
import SellerNewpage from "./SellerNewProduct";
import SellerSpecialpage from "./SellerSpecialProduct";


function UsersellerPage(){
 

    return(
        <>
        <UserSellerNav />
        <SellerToppage/>
        <SellerNewpage/>
        <SellerSpecialpage/>

        </>
    )
}

export default UsersellerPage;