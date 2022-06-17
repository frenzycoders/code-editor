// // import * as React from 'react';
// // import AppBar from '@mui/material/AppBar';
// // import Box from '@mui/material/Box';
// // import CssBaseline from '@mui/material/CssBaseline';
// // import Drawer from '@mui/material/Drawer';
// // import IconButton from '@mui/material/IconButton';
// // import MenuIcon from '@mui/icons-material/Menu';
// // import Toolbar from '@mui/material/Toolbar';
// // import Typography from '@mui/material/Typography';
// // import './App.css'
// // import AppDrawer from './components/Drawer'
// // import Editor from './components/Editor';

// // const drawerWidth = 240;

// // interface Props {
// //   window?: () => Window;
// // }

// // export default function ResponsiveDrawer(props: Props) {
// //   const { window } = props;
// //   const [mobileOpen, setMobileOpen] = React.useState(false);

// //   const handleDrawerToggle = () => {
// //     setMobileOpen(!mobileOpen);
// //   };

// //   const container = window !== undefined ? () => window().document.body : undefined;

// //   return (
// //     <Box sx={{ display: 'flex' }}>

// //       <div style={{ backgroundColor: '#3c3c3c' }}>
// //         <AppBar
// //           color="primary"
// //           position="fixed"
// //           sx={{
// //             width: { sm: `calc(100% - ${drawerWidth}px)` },
// //             ml: { sm: `${drawerWidth}px` },
// //           }}
// //         >
// //           <Toolbar>
// //             <IconButton
// //               color="inherit"
// //               aria-label="open drawer"
// //               edge="start"
// //               onClick={handleDrawerToggle}
// //               sx={{ display: { sm: 'none' } }}
// //             >
// //               <MenuIcon />
// //             </IconButton>

// //           </Toolbar>
// //         </AppBar>
// //       </div>
// //       <Box
// //         component="nav"
// //         sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
// //         aria-label="mailbox folders"
// //       >
// //         {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
// //         <Drawer
// //           container={container}
// //           variant="temporary"
// //           open={mobileOpen}
// //           onClose={handleDrawerToggle}
// //           ModalProps={{
// //             keepMounted: true, // Better open performance on mobile.
// //           }}
// //           sx={{
// //             display: { xs: 'block', sm: 'none' },
// //             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
// //           }}
// //         >
// //           <AppDrawer />
// //         </Drawer>
// //         <Drawer
// //           variant="permanent"
// //           sx={{
// //             display: { xs: 'none', sm: 'block' },
// //             '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
// //           }}
// //           open
// //         >
// //           <AppDrawer />
// //         </Drawer>
// //       </Box>
// //       <Editor drawerWidth={drawerWidth} />
// //     </Box>
// //   );
// // }

// import React, { useContext, useEffect } from 'react';
// import { io, Socket } from 'socket.io-client';
// import { Terminal, } from 'xterm';
// import "xterm/css/xterm.css";
// import { socket, SocketContext } from './socket';
// import TerminalUI from './components/TerminalUI';

// function App() {
//   // let socket = useContext(SocketContext);

//   return (
//     <SocketContext.Provider value={socket}>
//       <TerminalUI />
//     </SocketContext.Provider>
//   )
// }

// export default App






import './App.css'
import 'react-resizable/css/styles.css'
import Home from './Screens/Home';
import { ComponenetState, DONE, ERROR, INIT, LOADING, ServerDetails } from './Types/server_details';
import { useContext, useEffect, useState } from 'react';
import { GETserverInfo } from './Types/features';
import { CircularProgress } from '@mui/material';
import { dataContext } from './context/dataContext';
import { socket, SocketContext } from './context/socket';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {

  const [serverInfo, setServerInfo] = useState({});
  const [appState, setAppState] = useState(INIT);
  const [errorMessage, setErrorMessage] = useState('NOT FOUND');


  useEffect(() => {
    getServerDetails();
  }, []);


  const getServerDetails = async () => {
    try {
      setAppState(LOADING);
      let server: ServerDetails = await GETserverInfo();
      setServerInfo(server);
      setAppState(DONE);
    } catch (error: any) {

      setErrorMessage(error.message);
      setAppState(ERROR);

    }
  }

  return (

    <>
      {
        appState === LOADING ? (<>
          <div className="item-center">
            <CircularProgress />
          </div>
        </>) : appState === DONE ? (<>
          <dataContext.Provider value={serverInfo}>
            <SocketContext.Provider value={socket}>
              <Home />
              <ToastContainer />
            </SocketContext.Provider>
          </dataContext.Provider>
        </>) : (<>
          <div className='item-center'>
            {errorMessage}
          </div>
        </>)
      }
    </>
  );

}
