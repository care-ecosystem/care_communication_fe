import { lazy } from "react";
import KioskFeedbackPage from "./pages/KioskFeedbackPage";
import en from "../public/locale/en.json";

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
  i18n: {
  en
  },
  navItems: [],
  adminNavItems: [],
};

export default manifest;
