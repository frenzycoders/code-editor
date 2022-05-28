import React from 'react'
import TerminalSharpIcon from '@mui/icons-material/TerminalSharp';
import IconButton from '@mui/material/IconButton';
import FolderLogo from './../../assets/icons/folder.svg';

export default function FeaturesIcons({ onTerminalTap, onFolderTap, isTerminalOpen }: any) {



    return (
        <div className='features-options'>
            <div>
                <strong>CODE EDITOR</strong>
            </div>

            <IconButton color='default' onClick={() => onFolderTap()} children={<img src={FolderLogo} height='28px' />} />
            <IconButton color='default' onClick={() => onTerminalTap()} children={<TerminalSharpIcon color={isTerminalOpen === true ? 'info' : 'warning'} />} />

        </div>
    )

}
