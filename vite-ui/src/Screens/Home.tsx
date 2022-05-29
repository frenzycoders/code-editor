import React, { Key, SyntheticEvent, useContext, useEffect, useState } from 'react'
import { Resizable, ResizableBox, ResizeCallbackData } from 'react-resizable';
import Editor from '../components/Editor';
import FileManager from '../components/FileManager';
import FeaturesIcons from '../components/widgets/FeaturesIcons';
import { dataContext } from '../context/dataContext';
import { entityType, openFile, ServerDetails } from '../Types/server_details';
import ClearIcon from '@mui/icons-material/Clear';
import { IconButton } from '@mui/material';
import FilesIcons from '../components/widgets/FilesIcons';
import { SocketContext } from '../context/socket';
import TerminalUI from '../components/TerminalUI';


export default function Home() {

    let socket = useContext(SocketContext);
    let data = useContext(dataContext) as ServerDetails;
    const [rootUrl, setRootUrl] = useState<string>(localStorage.getItem('rootUrl') || data.homedir);
    const [open, setOpen] = useState(false);
    const [openFiles, setOpenFiles] = useState<any>([]);
    const [currentOpen, setCurrentOpen] = useState<any>({ path: '/Home', saved: true });
    const [connectionState, setConnectionState] = useState(false);
    const [configs, setConfigs] = useState({
        width: 350,
        height: window.innerHeight,
    });

    const [tConfig, settConfig] = useState({
        height: 0,
        width: window.innerWidth - configs.width
    });

    const [editor, setEditor] = useState({
        width: window.innerWidth - configs.width,
        height: innerHeight,
    });


    const [terminalOpen, setTerminalOpen] = useState(false);

    useEffect(() => {
        window.addEventListener('resize', () => {
            setConfigs({
                width: configs.width,
                height: window.innerHeight,
            })
            setEditor({
                width: window.innerWidth - configs.width,
                height: window.innerHeight,
            })
            settConfig({
                width: window.innerWidth - configs.width,
                height: tConfig.height,
            })
        })

        if (socket.connected) {
            setConnectionState(true);

            socket.on('EXIT_TERMINAL', () => {
                setTerminalOpen(false);
            });

        } else {
            setConnectionState(false);
        }

    }, []);



    const onResize = (event: SyntheticEvent, data: ResizeCallbackData) => {
        setConfigs({
            width: data.size.width,
            height: window.innerHeight,
        })
        setEditor({
            width: window.innerWidth - configs.width,
            height: window.innerHeight,
        })
    }

    const terminalResize = (event: SyntheticEvent, data: ResizeCallbackData) => {
        settConfig({
            width: data.size.width,
            height: data.size.height,
        })
    }

    function onTerminalTap() {
        if (terminalOpen === true) {
            socket.emit('REMOVE_TERMINAL_WITH_THIS_ID')
            settConfig({
                height: 0,
                width: window.innerWidth - configs.width
            })
            setTerminalOpen(false);

            socket.off('OUTPUT');


        } else {
            settConfig({
                height: 350,
                width: window.innerWidth - configs.width
            })
            setTerminalOpen(true);
            socket.emit('CREATE_TERMINAL', 'cd ' + rootUrl);
        }
    }




    const setFileInOpenList: Function = (e: { path: string, isFile: Boolean }) => {

        if (e.isFile) {
            console.log(e);
            let isFound: Boolean = true;
            openFiles.forEach((ent: entityType) => {
                if (ent.path === e.path) {
                    isFound = false;
                    setCurrentOpen(ent);
                    return;
                }
            });


            if (isFound) {

                setOpenFiles([...openFiles, { path: e.path as string, saved: true }]);
                setCurrentOpen({ path: e.path as string, saved: true });
            }
        }

    }

    const removeFilesFromOpenList: Function = (path: string) => {
        let files: openFile[] = openFiles.filter((e: openFile) => {
            if (e.path !== path) {
                return e;
            }
        });

        setOpenFiles(files);
    }
    return (
        <dataContext.Provider value={data}>
            <div className='main'>

                <Resizable axis='x' resizeHandles={['e']} handle={<div className="slide-handler" />} height={configs.height} width={configs.width} minConstraints={[250, window.innerHeight]} maxConstraints={[450, 300]} onResize={onResize} >
                    <div className="file-manager" style={{ width: configs.width + 'px', height: configs.height + 'px', border: '1px solid' }}>
                        <div className='manager-header'>
                            <div className='manager-header-title'>
                                EXPLORER
                            </div>
                        </div>
                        <FileManager setUrl={setRootUrl} url={rootUrl} openExplorer={open} setOpenExplorer={setOpen} setCurrentOpenFile={setFileInOpenList} />
                    </div>
                </Resizable>

                <div className='editor-terminal' style={{ height: editor.height, width: editor.width }}>

                    <FeaturesIcons onTerminalTap={onTerminalTap} setOpenExplorer={setOpen} onFolderTap={setRootUrl} rootUrl={rootUrl} isTerminalOpen={terminalOpen} connectionState={connectionState} />
                    <div className="open-files">
                        {
                            openFiles.length > 0 ? openFiles.map((e: entityType) => {
                                return (<>
                                    <div className="open-file-item" style={{ backgroundColor: currentOpen.path === e.path ? 'rgba(90, 93, 94, 0.3)' : 'black', cursor: 'pointer' }} onClick={() => setCurrentOpen(e)} key={e.path as Key}>
                                        <div style={{ marginLeft: '5px' }}>
                                            <FilesIcons path={e.path as string} key={e.path as Key} />
                                        </div>
                                        <span style={{ color: 'whitesmoke', maxWidth: '100px', textOverflow: 'clip', padding: '7px', overflow: 'hidden', position: 'revert', fontSize: '10px' }}>{e.path.split('/')[e.path.split('/').length - 1]}</span>
                                        <div className='dot'></div>
                                        <div style={{ marginRight: '5px' }} onClick={() => removeFilesFromOpenList(e.path)}>
                                            <ClearIcon color='info' fontSize='inherit' />
                                        </div>
                                    </div>
                                </>)
                            }) : (<></>)
                        }
                    </div>
                    <div className='editor' style={{ height: editor.height - tConfig.height }}>
                        {
                            openFiles.length === 0 ? (<>

                            </>) : (<>
                                <Editor currentFile={currentOpen} />
                            </>)
                        }
                    </div>

                    {
                        terminalOpen ? (
                            <>
                                <TerminalUI tConfig={tConfig} channel={socket} />
                            </>
                        ) : (<></>)
                    }


                </div>
            </div>
        </dataContext.Provider>
    )
}
