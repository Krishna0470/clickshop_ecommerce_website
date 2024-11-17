import React,{useState} from "react";
import UserNav from "./UserNav";
import UserToppage from "./Usertoppage";
import UserNewpage from "./UserNewProduct";
import UserSpecialpage from "./UserSpecialProduct";
import Product from "../productpage/Product";

const UserPage = ()=>{
    const [product, setProduct] = useState([]);
 
    const handleClick = (curElem)=>{
        console.log(curElem)
    }

    return(
        <React.Fragment>
        <UserNav size={product.length} />
        <UserToppage />
        <UserNewpage/>
        <UserSpecialpage/>

        </React.Fragment>
    )
}

export default UserPage;