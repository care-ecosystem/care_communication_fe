import { lazy } from "react";
import KioskFeedbackPage from "./pages/KioskFeedbackPage";

const manifest = {
  plugin: "care_communication",
  routes: {},
  publicRoutes: {
    "/feedback": <KioskFeedbackPage />,
  },
  extends: [],
  components: {
    KioskFeedbackPage: lazy(() => import("./pages/KioskFeedbackPage")),
  },
  navItems: [],
  adminNavItems: [],
};

export default manifest;
