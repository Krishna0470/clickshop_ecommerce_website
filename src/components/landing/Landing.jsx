import React, { useState } from "react";
import Landingpage from "./Landingpage";
// import LandingNav from "./LandingNav";
import Signin from "../sign in/Signin";
import Regsiter from "../regsiter/Regsiter";
import UserPage from "../userpage/User";
import AdminPage from "../adminpage/Admin";
import UpdateProfile from "../updateprofile/Updateprofile";
import Userlist from "../userlist/Userlist";
import AllProduct from "../allproduct/Allproduct";
import CreateProduct from "../createProduct/Createproductpage";
import UpdateProduct from "../updateProduct/Updateproduct";
import ProductList from "../productlist/Productlist";
import Product from "../productpage/Product";
import ViewCart from "../viewcart/ViewCart";
import Success from "../success/Success";
import ForgotPassword from "../forgot_password/ForgotPassword";
import ResetPasswordPage from "../reset-password/ResetPasswordPage";
import UsersellerPage from "../usersellerpage/UserSeller";
import Shipping from "../shipping/Shipnig";
import ViewFavorite from "../viewfavorite/ViewFavorite";
import MensCategory from "../menscategory/menscategory";
import WomenCategory from "../womencategory/womencategory";
import KidsCategory from "../kidscategory/kidscategory";
import MensCat from "../menscat/menscat";
import WomenCat from "../womencat/womenca";
import KidsCat from "../kidscat/kidscat";
import Oredrs from "../orders/Orders";
import Category from "../category/Category";
import MyOredrs from "../myorders/MyOrders";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";




function Landing() {
  

    return (
        <Router>
            <>
                <Routes>
                <Route path="/" exact element={<Landingpage/>} />
                <Route path="/Signin" exact element={<Signin/>} />
                <Route path="/Regsiter" exact element={<Regsiter/>} />
                <Route path="/UserPage/:id" exact element={<UserPage/>} />
                <Route path="/AdminPage/:id" exact element={<AdminPage/>} />
                <Route path="/UpdateProfile/:id" exact element={<UpdateProfile/>} />
                <Route path="/Userlist" exact element={<Userlist/>} />
                <Route path="/AllProduct" exact element={<AllProduct/>} />
                <Route path="/CreateProduct" exact element={<CreateProduct/>} />
                <Route path="/UpdateProduct/:id" exact element={<UpdateProduct/>} />
                <Route path="/ProductList" exact element={<ProductList/>} />
                <Route path="/Product/:id" exact element={<Product/>} />
                <Route path="/ViewCart" exact element={<ViewCart/>} />
                <Route path="/reset-password" exact element={<ResetPasswordPage/>} />
                <Route path="/ForgotPassword" exact element={<ForgotPassword/>} />
                <Route path="/UsersellerPage/:id" exact element={<UsersellerPage/>} />
                <Route path="/Success/:id" exact element={<Success/>} />
                <Route path="/Shipping/:id" exact element={<Shipping/>} />
                <Route path="/ViewFavorite" exact element={<ViewFavorite/>} />
                <Route path="/MensCategory" exact element={<MensCategory/>} />
                <Route path="/WomenCategory" exact element={<WomenCategory/>} />
                <Route path="/KidsCategory" exact element={<KidsCategory/>} />
                <Route path="/MensCat" exact element={<MensCat/>} />
                <Route path="/WomenCat" exact element={<WomenCat/>} />
                <Route path="/KidsCat" exact element={<KidsCat/>} />
                <Route path="/Oredrs" exact element={<Oredrs/>} />
                <Route path="/MyOredrs" exact element={<MyOredrs/>} />
                <Route path="/Category" exact element={<Category/>} />
                </Routes>
            </>
        </Router>
    )
}

export default Landing;