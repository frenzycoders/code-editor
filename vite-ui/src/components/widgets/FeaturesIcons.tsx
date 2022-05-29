import React, { Key, useContext, useEffect, useState } from 'react'
import TerminalSharpIcon from '@mui/icons-material/TerminalSharp';
import IconButton from '@mui/material/IconButton';
import FolderLogo from './../../assets/icons/folder.svg';
import { dataContext } from '../../context/dataContext';
import { entityType, ServerDetails } from '../../Types/server_details';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { readFs } from '../../Types/features';
import FileItem from './FileItem';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 500,
    bgcolor: 'background',
    border: '2px solid white',
    boxShadow: 20,
    p: 4,
};

export default function FeaturesIcons({ onTerminalTap, onFolderTap, setOpenExplorer, isTerminalOpen, connectionState }: any) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    let data = useContext(dataContext) as ServerDetails;

    const [dirs, setDirs] = useState<entityType[]>([{ name: '', isFile: true, path: '/' }]);
    const [selected, setSelected] = useState('/');

    useEffect(() => {
        readRootDirs();
    })

    const readRootDirs = async () => {
        try {
            let dir: entityType[] = await readFs('/') as entityType[];
            setDirs(dir);
        } catch (error) {

        }
    }


    const setRootUrl = () => {
        if (selected !== null) {
            localStorage.setItem('rootUrl', selected);
            setOpenExplorer(false);
            onFolderTap(selected);
            handleClose()
            setSelected('/')
        }
    }
    return (
        <>
            <div className='features-options'>
                <div>
                    <strong>CODE EDITOR [ <span style={{ color: 'green' }}>{data.hostname}@{data.platform}-{data.arch}</span> ]</strong>
                </div>
                <div className='right-header'>
                    TOTAL MEMORY : <span style={{ color: 'green' }}>{data.totalmem} GB</span>
                </div>
                <div className='right-header'>
                    FREE MEMORY : <span style={{ color: 'green' }}>{data.freemem} GB</span>
                </div>
                <IconButton color='default' onClick={handleOpen} children={<img src={FolderLogo} height='28px' />} />
                <IconButton color='default' onClick={() => onTerminalTap()} children={<TerminalSharpIcon color={isTerminalOpen === true ? 'info' : 'warning'} />} />

                <div className='connection-dot' style={{ backgroundColor: connectionState === true ? 'green' : 'red' }}>

                </div>
            </div>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"

            >
                <Box sx={style} >
                    <Typography id="modal-modal-title" variant="h6" component="h2" color='white'>
                        Select Folder
                    </Typography>
                    <div className='modal-paper'>
                        {
                            dirs.length > 0 ? (<>
                                {
                                    dirs.map((e) => {
                                        return <FileItem isFile={e.isFile} path={e.path as string} key={e.path as Key} selectPath={(path: string) => setSelected(path)} />
                                    })
                                }
                            </>) : (<>Empty</>)
                        }
                    </div>
                    <div className='action-buttons'>

                        <Button variant='contained' style={{ marginRight: '10px' }} onClick={setRootUrl} >SELECT</Button>
                        <Button variant='contained' color='secondary' style={{ marginRight: '10px' }} onClick={handleClose} >CANCLE</Button>
                        <div className="row-scroll">
                            <span style={{ color: "white", marginRight: '20px' }}>{selected}</span>
                        </div>
                    </div>
                </Box>
            </Modal>
        </>
    )

}
