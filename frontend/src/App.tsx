import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import GroceryList from './pages/GroceryList';
import RecipeDetails from './pages/RecipeDetails';
import { RecipeProvider } from './context/RecipeProvider';
import type { ReactElement } from 'react';

const RootLayout = (): ReactElement => {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
};

const router = createHashRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/grocerylist', element: <GroceryList /> },
      { path: '/recipes/:id', element: <RecipeDetails /> },
    ],
  },
]);

export default function App(): ReactElement {
  return (
    <RecipeProvider>
      <RouterProvider router={router} />
    </RecipeProvider>
  );
}
