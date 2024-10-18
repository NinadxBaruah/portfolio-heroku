import { createRoot } from 'react-dom/client'
import {appRouter} from './App.tsx'
import { RouterProvider } from 'react-router-dom'
import './index.css'

createRoot(document.getElementById('root')!).render(
    <RouterProvider router={appRouter}/>
)
