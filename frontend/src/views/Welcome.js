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
import IndexNavbar from "components/Navbars/IndexNavbar.js";
import PageHeader from "components/PageHeader/PageHeader.js";
import Footer from "components/Footer/Footer.js";

// sections for this page/view
import AnalyzeInfo from "views/IndexSections/AnalyzeInfo.js";

import PermissionsGate from 'components/Role-based-access/PermissionsGate.js'
import { SCOPES } from 'components/Role-based-access/PermissionsMap.js'
import RestrictedContent from 'components/Role-based-access/RestrictedContent.js'


export default function Welcome() {
  React.useEffect(() => {
    document.body.classList.toggle("index-page");
    // Specify how to clean up after this effect:
    return function cleanup() {
      document.body.classList.toggle("index-page");
    };
  }, []);
  return (
    <>
      <PermissionsGate
        scopes={[SCOPES.administratorCanAccess, SCOPES.normalCanAccess]}
        RenderForbiddenContent={() => <RestrictedContent allowedRole={"noLogged"} />}
      >
        <IndexNavbar />
        <div className="wrapper">
          <PageHeader />
          <div className="main">
            <AnalyzeInfo />
          </div>
          <Footer />
        </div>
      </PermissionsGate>
    </>
  );
}
