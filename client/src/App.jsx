import Main from "./Idea.jsx"
import {createBrowserRouter, RouterProvider} from "react-router";
import React from 'react'


const router = createBrowserRouter([{
    // element: <Layout />,
    children: [
        {
            path: '/',
            element:<Main/>
        },
    ]
}]);


function App() {


    return (
        <>
            <RouterProvider router={router}/>
        </>
    )
}

export default App
