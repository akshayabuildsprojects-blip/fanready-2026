import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import { ScrollToTop } from "./components/ScrollToTop.tsx";
import BriefPage from "./pages/BriefPage.tsx";
import MyBriefPage from "./pages/MyBriefPage.tsx";
import CitiesPage from "./pages/CitiesPage.tsx";
import CityPage from "./pages/CityPage.tsx";
import GuidePage from "./pages/GuidePage.tsx";
import SourcesPage from "./pages/SourcesPage.tsx";
import Landing from "./screens/Landing.jsx";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="cities" element={<CitiesPage />} />
          <Route path="cities/:id" element={<CityPage />} />
          <Route path="brief" element={<BriefPage />} />
          <Route path="my-brief" element={<MyBriefPage />} />
          <Route path="guide" element={<GuidePage />} />
          <Route path="sources" element={<SourcesPage />} />
        </Route>
      </Routes>
    </>
  );
}
