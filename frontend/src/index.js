/*!

=========================================================
* BLK Design System React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/blk-design-system-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/blk-design-system-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "assets/css/nucleo-icons.css";
import "assets/scss/blk-design-system-react.scss?v=1.2.0";
import "assets/demo/demo.css";

import Index from "views/Index.js";

import Welcome from "views/Welcome.js";

import Login from "components/Operations/Login.js"
import Register from "components/Operations/Register.js"

import Analyze from "components/Operations/Analyze.js"
import AttackTypesInfo from "components/Operations/AttackTypesInfo.js"
import Contact from "components/Operations/Contact.js"

import Admin from "components/Operations/Admin.js"
import ModelInfo from "components/Admin/Model/ModelInfo.js"
import ModelTrain from "components/Admin/Model/ModelTrain.js"
import ModelHistory from "components/Admin/Model/ModelHistory.js"

import Users from "components/Admin/Users/UserList.js"
import UserCreateForm from "components/Admin/Users/CreateUserForm.js"


ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Index />} />

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/welcome" element={<Welcome />} />

      <Route path="/analyze" element={<Analyze />} />
      <Route path="/attacks_info" element={<AttackTypesInfo />} />
      <Route path="/contact" element={<Contact />} />

      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/model/train" element={<ModelTrain />} />
      <Route path="/admin/model/info" element={<ModelInfo />} />
      <Route path="/admin/model/history" element={<ModelHistory />} />

      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/users/create" element={<UserCreateForm />} />

    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
