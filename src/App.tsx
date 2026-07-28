import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { UserLayout } from "./layouts/UserLayout";
import { ComparePage } from "./pages/ComparePage";
import { HomePage } from "./pages/HomePage";
import { InventoryPage } from "./pages/InventoryPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { RecipeDetailPage } from "./pages/RecipeDetailPage";
import { RecipesPage } from "./pages/RecipesPage";
import { ShoppingListPage } from "./pages/ShoppingListPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminFlyerUploadPage } from "./pages/admin/AdminFlyerUploadPage";
import { AdminFlyersPage } from "./pages/admin/AdminFlyersPage";
import { AdminRecipesPage } from "./pages/admin/AdminRecipesPage";
import { AdminReviewPage } from "./pages/admin/AdminReviewPage";

export default function App() {
  return <Routes><Route element={<UserLayout />}><Route index element={<HomePage />} /><Route path="recipes" element={<RecipesPage />} /><Route path="recipes/:recipeId" element={<RecipeDetailPage />} /><Route path="inventory" element={<InventoryPage />} /><Route path="compare" element={<ComparePage />} /><Route path="shopping-list" element={<ShoppingListPage />} /></Route><Route path="admin" element={<AdminLayout />}><Route index element={<AdminDashboardPage />} /><Route path="flyers" element={<AdminFlyersPage />} /><Route path="flyers/upload" element={<AdminFlyerUploadPage />} /><Route path="review" element={<AdminReviewPage />} /><Route path="recipes" element={<AdminRecipesPage />} /></Route><Route path="*" element={<UserLayout />}><Route path="*" element={<NotFoundPage />} /></Route></Routes>;
}
