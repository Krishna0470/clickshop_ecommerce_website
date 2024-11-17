import React,{useState} from "react";

import UserListPage from "./UserListPage";
import UserlistNav from "./UserlistNav";



function Userlist(){
 

    return(
        <>
        <UserlistNav />
        <UserListPage/>
        </>
    )
}

export default Userlist;