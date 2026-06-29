import { createBrowserRouter } from "react-router";
import { Navigate } from "react-router";
import { Root } from "./Root";
import { HomePage } from "./pages/HomePage";
import { GlobalDealPage } from "./pages/GlobalDealPage";
import { CreatorOpportunityPage } from "./pages/CreatorOpportunityPage";
import { AboutPage } from "./pages/AboutPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: HomePage },
      { path: "global-deal", Component: GlobalDealPage },
      { path: "solutions", Component: () => Navigate({ to: "/global-deal", replace: true }) },
      { path: "creator", Component: CreatorOpportunityPage },
      { path: "products", Component: () => Navigate({ to: "/creator", replace: true }) },
      { path: "about", Component: AboutPage },
    ],
  },
]);
