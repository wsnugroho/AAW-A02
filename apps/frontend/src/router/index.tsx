import {
  createRouter,
  createRootRoute,
  createRoute,
  Outlet,
} from "@tanstack/react-router";
import { Navbar } from "../components/Navbar";
import { DashboardPage } from "../pages/DashboardPage";
import { IncidentsPage } from "../pages/IncidentsPage";
import { NewIncidentPage } from "../pages/NewIncidentPage";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Navbar />
      <Outlet />
    </>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});

const incidentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/incidents",
  component: IncidentsPage,
});

const newIncidentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/incidents/new",
  component: NewIncidentPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  incidentsRoute,
  newIncidentRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
