import { Route, Switch, HashRouter } from "react-router-dom";


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
                <Switch>
                    <Route exact path="/" component={Index} />

                    <Route exact path="/login" component={Login} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/welcome" component={Welcome} />

                    <Route exact path="/analyze" component={Analyze} />
                    <Route exact path="/attacks_info" component={AttackTypesInfo} />
                    <Route exact path="/contact" component={Contact} />
                    <Route exact path="/about" component={About} />

                    <Route exact path="/admin" component={Admin} />
                    <Route exact path="/admin/model/train" component={ModelTrain} />
                    <Route exact path="/admin/model/info" component={ModelInfo} />
                    <Route exact path="/admin/model/history" component={ModelHistory} />

                    <Route exact path="/admin/users" component={Users} />
                    <Route exact path="/admin/users/create" component={UserCreateForm} />
                </Switch>
            </HashRouter>
        </>
    );
}

export default App;