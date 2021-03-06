import CodeEditor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { BreakfastDiningOutlined } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress';
import { useEffect, useState } from 'react';
import { readFilesData, writeDataInFile } from '../Types/features';
import { DONE, ERROR, INIT, LOADING, openFile } from '../Types/server_details';
import { useDebounce, useDebouncedCallback } from 'use-debounce';
import { toast } from 'react-toastify';
type path = {
    currentFile: openFile,
    setCurrentOpen: Function,
}



const returnLanguage = (ext: string) => {
    switch (ext) {
        case 'js': return 'javascript'; break;
        case 'ts': return 'typescript'; break;
        case 'py': return 'python'; break;
        case 'json': return 'json'; break;
        case 'css': return 'css'; break;
        case 'scss': return 'scss'; break;
        case 'xml': return 'xml'; break;
        case 'php': return 'php'; break;
        case 'cpp': return 'cpp'; break;
        case 'md': return 'markdown'; break;
        case 'java': return 'java'; break;
        case 'sh': return 'batch'; break;
        case 'html': return 'html'; break;
        default: return 'text';
    }
}


function Editor({ currentFile, setCurrentOpen }: path) {
    const [codes, setCodes] = useState('//Welcome Users');
    const [ext, setExit] = useState(returnLanguage(currentFile.path.split('.')[currentFile.path.split('.').length - 1]));
    const [ComponentState, setComponentState] = useState(INIT);
    const [error, setError] = useState('NO_ERROR_FOUND');

    useEffect(() => {
        setExit(returnLanguage(currentFile.path.split('.')[currentFile.path.split('.').length - 1]))
        readData();
    }, [currentFile]);

    const readData = async () => {
        try {
            setComponentState(LOADING);
            let data = await readFilesData(currentFile.path);
            setCodes(data);
            setComponentState(DONE);
        } catch (error: any) {
            setError(error.message);
            setComponentState(ERROR);
        }
    }

    const debounced = useDebouncedCallback(
        // function
        (value) => {
            writeFiles(value);
            setCodes(value);
        },
        // delay in ms
        1000
    );

    const writeFiles = async (data: any) => {
        try {
            await writeDataInFile(currentFile.path, data);
        } catch (error: any) {
            toast(error.message, { type: 'error' });
        }
    }

    return (
        <>
            {
                ComponentState === LOADING ? <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <CircularProgress />

                </div> : ComponentState === ERROR ? <div>
                    <div style={{ display: 'flex', color: 'red', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        {error}
                    </div>
                </div> : <CodeEditor
                    // defaultLanguage='javascript'
                    defaultValue={codes}
                    onChange={(newValue) => {
                        if (newValue != undefined)
                            debounced(newValue);
                    }}
                    language={ext}
                    theme='vs-dark'
                    loading={<CircularProgress />}
                />
            }
        </>
    )
}

export default Editor