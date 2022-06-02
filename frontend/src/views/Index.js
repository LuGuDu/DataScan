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

// core components
import LoginNavbar from "components/Navbars/LoginNavBar.js";
import PageHeader from "components/PageHeader/PageHeader.js";
import NoLoggedFooter from "components/Footer/NoLoggedFooter.js";

// sections for this page/view
import AnalyzeInfo from "views/IndexSections/AnalyzeInfo.js";


export default function Index() {
  React.useEffect(() => {
    document.body.classList.toggle("index-page");
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.toggle("index-page");
    };
  },[]);
  return (
    <>
      <LoginNavbar />
      <div className="wrapper">
        <PageHeader />
        <div className="main">
          <AnalyzeInfo />
        </div>
        <NoLoggedFooter />
      </div>
    </>
  );
}
