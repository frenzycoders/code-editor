import React, { useEffect, useState } from 'react'
import FileIcon from './../../assets/icons/file.png';
import jsIcon from './../../assets/files/js.png';
import tsIcon from './../../assets/files/ts.png';
import dartIcon from './../../assets/files/dart.svg';
import cIcon from './../../assets/files/c.png';
import javaIcon from './../../assets/files/java.svg';
import keyIcon from './../../assets/files/key.png';
import kotlinIcon from './../../assets/files/kotlin.png';
import phpIcon from './../../assets/files/php.png';
import pythonIcon from './../../assets/files/python.png';
import rubyIcon from './../../assets/files/ruby.png';
import sqlIcon from './../../assets/files/sql.png';
import textIcon from './../../assets/files/text.png';
import ImageIcon from './../../assets/files/image.png';
import pdfIcon from './../../assets/files/pdf.png';
import jsonIcon from './../../assets/files/json.png'

type url = {
    path: string
}
export default function FilesIcons({ path }: url) {


    switch (path.split('.')[path.split('.').length - 1]) {
        case 'js': return (
            <img src={jsIcon} height={18} />
        )
            break;
        case 'ts': return (
            <img src={tsIcon} height={18} />
        )
            break;
        case 'dart': return (
            <img src={dartIcon} height={18} />
        )
            break;
        case 'c': return (
            <img src={cIcon} height={18} />
        )
            break;
        case 'cpp': return (
            <img src={cIcon} height={18} />
        )
            break;
        case 'java': return (
            <img src={javaIcon} height={18} />
        )
            break;
        case 'key': return (
            <img src={keyIcon} height={18} />
        )
            break;
        case 'jks': return (
            <img src={keyIcon} height={18} />
        )
            break;
        case 'pem': return (
            <img src={keyIcon} height={18} />
        )
            break;
        case 'kt': return (
            <img src={kotlinIcon} height={18} />
        )
            break;
        case 'php': return (
            <img src={phpIcon} height={18} />
        )
            break;
        case 'py': return (
            <img src={pythonIcon} height={18} />
        )
            break;
        case 'ruby': return (
            <img src={rubyIcon} height={18} />
        )
            break;
        case 'sql': return (
            <img src={sqlIcon} height={18} />
        )
            break;
        case 'txt': return (
            <img src={textIcon} height={18} />
        )
            break;
        case 'text': return (
            <img src={textIcon} height={18} />
        )
            break;
        case 'json': return (
            <img src={jsonIcon} height={18} />
        )
            break;
        case 'pdf': return (
            <img src={pdfIcon} height={18} />
        )
            break;
        case 'img': return (
            <img src={ImageIcon} height={18} />
        )
            break;
        case 'png': return (
            <img src={ImageIcon} height={18} />
        )
            break;
        case 'webp': return (
            <img src={ImageIcon} height={18} />
        )
            break;
        case 'gif': return (
            <img src={ImageIcon} height={18} />
        )
            break;
        case 'jpg': return (
            <img src={ImageIcon} height={18} />
        )
            break;
        case 'jpeg': return (
            <img src={ImageIcon} height={18} />
        )
            break;
        default: return (
            <img src={FileIcon} height={18} />
        )
            break;
    }
}
