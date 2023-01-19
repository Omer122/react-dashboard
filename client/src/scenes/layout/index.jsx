import React, { useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom"; //for template layouts
import { useSelector } from "react-redux";
import Navbar from "components/Navbar";
import Sidebar from "components/Sidebar";
import { useGetUserQuery } from "state/api";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)"); // true/false boolean if the width is screen, desktop=true
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // boolean if sidebar is open
  const userId = useSelector((state) => state.global.userId); //grab the user from redux toolkit:state->index.js
  const { data } = useGetUserQuery(userId); //make the api call, pass the userID
  // console.log('data',data);//test the data access from the server

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      <Sidebar
        user={data || {}} // {}- is if data undefined so break our app
        isNonMobile={isNonMobile}
        drawerWidth="250px"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      {/* the next box will take all the space left in the screen-flexGrow */}
      <Box flexGrow={1}>
        <Navbar
          user={data || {}}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
