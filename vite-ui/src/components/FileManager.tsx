import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Key, SyntheticEvent, useContext, useEffect, useState } from 'react';
import { dataContext } from '../context/dataContext';
import { DONE, entityType, ERROR, INIT, LOADING, ServerDetails } from '../Types/server_details';
import { readFs } from '../Types/features';
import { CircularProgress, IconButton } from '@mui/material';
import FileItem from './widgets/FileItem';
import ReplayIcon from '@mui/icons-material/Replay';
import FolderIcon from './../assets/icons/folder.svg'
import FileIcon from './../assets/icons/file.png'

type Props = {
    url: string,
    setUrl: Function,
    openExplorer: Boolean,
    setOpenExplorer: Function,
    setCurrentOpenFile: Function,
}

export default function FileManager({ url, setUrl, openExplorer, setOpenExplorer, setCurrentOpenFile }: Props) {


    let data = useContext(dataContext) as ServerDetails;


    const [dirs, setDirs] = useState<entityType[]>([{ name: '', isFile: true, path: '/' }]);
    const [ComponentState, setComponentState] = useState(INIT);
    const [errMessage, setErrorMessage] = useState('NOT_FOUND');


    const openHandler = async (e: SyntheticEvent) => {
        setOpenExplorer(!openExplorer);
        if (openExplorer === false) {
            await readDirs();
        }
    }


    const readDirs = async () => {
        try {
            setComponentState(LOADING);
            let dir: entityType[] = await readFs(url) as entityType[];
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
                    openExplorer ? <ExpandMoreIcon height={10} /> : <ChevronRightIcon height={10} />
                }
                <div style={{ padding: '1%', fontWeight: '500', cursor: 'pointer', }} onClick={openHandler}>
                    <strong>{url.split('/')[url.split('/').length - 1]}</strong>
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
                    openExplorer ? (<>
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
                                                return <FileItem isFile={e.isFile} path={e.path as string} key={e.path as Key} selectPath={({ path, isFile }: any) => setCurrentOpenFile({ path, isFile })} />
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
                            <span style={{ color: 'whitesmoke', paddingLeft: '5px' }}> Press on <strong>{url.split('/')[url.split('/').length - 1]}</strong> for explore file manager and browse files and folders</span>
                        </div>
                    </>)
                }
            </div>
        </div>
    )
}
