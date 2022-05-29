import React, { Key, useEffect, useState } from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderCloseIcon from './../../assets/icons/folder.svg';
import FolderOpenItem from './../../assets/icons/folder-open.svg';
import { DONE, entityType, ERROR, INIT, LOADING } from '../../Types/server_details';
import FileIcon from './../../assets/icons/file.png';
import FilesIcons from './FilesIcons';
import { readFs } from '../../Types/features';
import { CircularProgress } from '@mui/material';


type entities = {
    path: string,
    isFile: Boolean,
    selectPath: Function,
}



export default function FileItem({ path, isFile, selectPath }: entities) {

    const [isOpen, setIsOpen] = useState(false);
    const [dirs, setDirs] = useState<entityType[]>([{ name: '', isFile: true, path: '/' }]);
    const [ComponentState, setComponentState] = useState(INIT);
    const [isError, setIsError] = useState('NOT FOUND');

    const readNextDirs = async () => {
        try {
            setComponentState(LOADING);
            let dir: entityType[] = await readFs(path) as entityType[];
            setDirs(dir);
            setComponentState(DONE);
        } catch (error: any) {
            setIsError(error.message);
            setComponentState(ERROR);
        }
    }

    const openNext = () => {
        selectPath({ path, isFile });
        if (isOpen === false && isFile == false) {
            setIsOpen(true);
            readNextDirs();
        } else {
            setIsOpen(false);
        }
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', }}>
            <div className='file-item' style={{ color: 'white' }} onClick={() => openNext()}>
                <div className="icon-style" >
                    {
                        isFile ? (<><div style={{ marginLeft: '10px' }}></div></>) : (<>
                            {
                                isOpen ? (<>
                                    <ExpandMoreIcon height={10} />
                                </>) : (<>
                                    <ChevronRightIcon height={10} />
                                </>)
                            }
                        </>)
                    }
                </div>
                <div>
                    {
                        isFile ? (<>
                            <FilesIcons path={path} />
                        </>) : (<>
                            {
                                isOpen ? (<>
                                    <img src={FolderOpenItem} height={17} />
                                </>) : (<>
                                    <img src={FolderCloseIcon} height={17} />
                                </>)
                            }
                        </>)
                    }
                </div>
                <div style={{ paddingLeft: '2px', overflow: 'hidden', overflowX: 'hidden' }}>
                    {path.split('/')[path.split('/').length - 1]}
                </div>


            </div>
            {
                isOpen ? (<>
                    {
                        ComponentState === LOADING ? (<>
                            <div style={{ alignItems: 'center', justifyContent: 'center' }}>
                                <CircularProgress size={18} />
                            </div>
                        </>) : (<>
                            {
                                ComponentState === ERROR ? (<>
                                    <div style={{ color: 'red' }}>
                                        {isError}
                                    </div>
                                </>) : (<>
                                    {
                                        dirs.map((e) => {
                                            return (<div style={{ marginLeft: '10px' }}>

                                                <FileItem isFile={e.isFile} path={e.path as string} key={e.path as Key} selectPath={selectPath} />
                                            </div>)
                                        })
                                    }
                                </>)
                            }
                        </>)
                    }
                </>) : (<></>)
            }
        </div>
    )
}
