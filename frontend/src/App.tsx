import { createHashRouter, RouterProvider, Outlet } from 'react-router-dom';
// import Header from './components/Header';
import Home from './pages/Home';
// import GroceryList from './pages/GroceryList';
// import RecipeDetails from './pages/RecipeDetails';
import { RecipeProvider } from './context/RecipeProvider';

const RootLayout = () => {
  return (
    <>
      {/* <Header /> */}
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
      // { path: '/grocerylist', element: <GroceryList /> },
      // { path: '/recipe/:id', element: <RecipeDetails /> },
    ],
  },
]);

export default function App() {
  return (
    <RecipeProvider>
      <RouterProvider router={router} />
    </RecipeProvider>
  );
}

// plain app.tsx if router stuff fails again.
// import { RecipeProvider } from './context/RecipeProvider';
// import Home from './pages/Home';

// export default function App() {
//   return (
//     <RecipeProvider>
//       <Home />
//     </RecipeProvider>
//   );
// }
