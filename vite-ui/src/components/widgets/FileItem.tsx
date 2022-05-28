import React from 'react'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FolderCloseIcon from './../../assets/icons/folder.svg';
import FolderOpenItem from './../../assets/icons/folder-open.svg';

type entities = {
    path: string,
    isFile: Boolean
}

export default function FileItem({ path, isFile }: entities) {
    return (
        <div className='file-item' style={{ color: 'white' }}>
            <div className="icon-style" >
                {
                    isFile ? (<></>) : <ChevronRightIcon height={10} />
                }
            </div>
            <div>
                <img src={FolderCloseIcon} height={17} />
            </div>
            <div style={{ paddingLeft: '2px' }}>
                {path.split('/')[path.split('/').length - 1]}
            </div>


        </div>
    )
}
