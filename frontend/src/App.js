import { Route, Routes, HashRouter } from "react-router-dom";


import Index from "views/Index.js";

import Welcome from "views/Welcome.js";

import Login from "components/Operations/Login.js"
import Register from "components/Operations/Register.js"

import Analyze from "components/Operations/Analyze.js"
import AttackTypesInfo from "components/Operations/AttackTypesInfo.js"
import Contact from "components/Operations/Contact.js"
import About from "components/Operations/About.js"

import Admin from "components/Operations/Admin.js"
import ModelInfo from "components/Admin/Model/ModelInfo.js"
import ModelTrain from "components/Admin/Model/ModelTrain.js"
import ModelHistory from "components/Admin/Model/ModelHistory.js"

import Users from "components/Admin/Users/UserList.js"
import UserCreateForm from "components/Admin/Users/CreateUserForm.js"

function App() {
    return ( //JSX
        <>
            <HashRouter>
                <Routes>
                    
                    <Route exact path="/login" element={<Login />} />
                    <Route exact path="/register" element={<Register />} />
                    <Route exact path="/welcome" element={<Welcome />} />

                    <Route exact path="/analyze" element={<Analyze />} />
                    <Route exact path="/attacks_info" element={<AttackTypesInfo />} />
                    <Route exact path="/contact" element={<Contact />} />
                    <Route exact path="/about" element={<About />} />

                    <Route exact path="/admin" element={<Admin />} />
                    <Route exact path="/admin/model/train" element={<ModelTrain />} />
                    <Route exact path="/admin/model/info" element={<ModelInfo />} />
                    <Route exact path="/admin/model/history" element={<ModelHistory />} />

                    <Route exact path="/admin/users" element={<Users />} />
                    <Route exact path="/admin/users/create" element={<UserCreateForm />} />
                    
                    <Route exact path="/" element={<Index />} />
                </Routes>
            </HashRouter>
        </>
    );
}

export default App;