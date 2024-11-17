import React,{useState} from "react";
import AdminNav from "./AdminNav";
import AdminToppage from "./AdminToppage";
import AdminNewpage from "./AdminNewProduct";
import AdminSpecialpage from "./AdminSpecialProduct";


function AdminPage(){
 

    return(
        <>
        <AdminNav />
        <AdminToppage/>
        <AdminNewpage/>
        <AdminSpecialpage/>
        </>
    )
}

export default AdminPage;