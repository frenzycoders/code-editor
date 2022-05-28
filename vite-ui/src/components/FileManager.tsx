import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SyntheticEvent, useContext, useEffect, useState } from 'react';
import { dataContext } from '../context/dataContext';
import { DONE, ERROR, INIT, LOADING, ServerDetails } from '../Types/server_details';
import { readFs } from '../Types/features';
import { CircularProgress, IconButton } from '@mui/material';
import FileItem from './widgets/FileItem';
import ReplayIcon from '@mui/icons-material/Replay';
import FolderIcon from './../assets/icons/folder.svg'
import FileIcon from './../assets/icons/file.png'

export default function FileManager() {

    const [open, setOpen] = useState(false);
    let data = useContext(dataContext) as ServerDetails;

    const [rootUrl, setRootUrl] = useState('/VITE-UI');
    const [dirs, setDirs] = useState(['']);
    const [ComponentState, setComponentState] = useState(INIT);
    const [errMessage, setErrorMessage] = useState('NOT_FOUND');


    useEffect(() => {
        setRootUrl(data.homedir);
    }, [data]);


    const openHandler = async (e: SyntheticEvent) => {
        setOpen(!open);
        if (open === false) {
            await readDirs();
        }
    }


    const readDirs = async () => {
        try {
            setComponentState(LOADING);
            let dir: string[] = await readFs(rootUrl) as string[];
            setDirs(dir);
            setComponentState(DONE);
            console.log(dir)
        } catch (error: any) {
            setErrorMessage(error.message);
            setComponentState(ERROR);
        }
    }

    const onRefresh: Function = () => {
        readDirs();
    }


    const createFolder = () => {

    }

    return (
        <div>
            <div id="header" style={{ display: 'flex', flexDirection: 'row', color: 'whitesmoke', fontSize: 'small', paddingLeft: '8px', borderBottom: '1px solid' }}>
                {
                    open ? <ExpandMoreIcon height={10} /> : <ChevronRightIcon height={10} />
                }
                <div style={{ padding: '1%', fontWeight: '500', cursor: 'pointer', }} onClick={openHandler}>
                    <strong>{rootUrl.split('/')[rootUrl.split('/').length - 1]}</strong>
                </div>
                <div className="refresh-button">

                    {
                        ComponentState === LOADING ? <CircularProgress size={18} /> : <IconButton onClick={() => onRefresh()} children={<ReplayIcon color='info' />} />
                    }

                    {
                        ComponentState === LOADING ? (<></>) : <IconButton onClick={() => createFolder()} children={<img src={FolderIcon} height={20} />} />
                    }

                    {
                        ComponentState === LOADING ? (<></>) : <IconButton onClick={() => createFolder()} children={<img src={FileIcon} height={20} />} />
                    }
                </div>
            </div>

            <div className="entities" style={{ paddingLeft: '3%', color: 'white', alignItems: 'center', justifyContent: 'center' }}>
                {
                    open ? (<>
                        {
                            ComponentState === LOADING ? <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <CircularProgress size={18} />

                            </div> : ComponentState === ERROR ? (<>
                                <span style={{ color: 'red' }}>{errMessage}</span>
                            </>) : (<>

                                {
                                    dirs.length > 0 ? (<>
                                        {
                                            dirs.map((e) => {
                                                return <FileItem isFile={false} path={rootUrl + '/' + e} key={e} />
                                            })
                                        }
                                    </>) : (<>
                                        <span style={{ color: 'red' }}>Empty</span>
                                    </>)
                                }

                            </>)
                        }
                    </>) : (<>
                        <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                           <span style={{ color: 'whitesmoke', paddingLeft: '5px' }}> Press on <strong>{rootUrl.split('/')[rootUrl.split('/').length - 1]}</strong> for explore file manager and browse files and folders</span>
                        </div>
                    </>)
                }
            </div>
        </div>
    )
}
