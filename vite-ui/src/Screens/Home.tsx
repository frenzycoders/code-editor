import React, { SyntheticEvent, useContext, useEffect, useState } from 'react'
import { Resizable, ResizableBox, ResizeCallbackData } from 'react-resizable';
import Editor from '../components/Editor';
import FileManager from '../components/FileManager';
import FeaturesIcons from '../components/widgets/FeaturesIcons';
import { dataContext } from '../context/dataContext';
import { ServerDetails } from '../Types/server_details';

export default function Home() {
    let data = useContext(dataContext);

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
            settConfig({
                height: 0,
                width: window.innerWidth - configs.width
            })
            setTerminalOpen(false);
        } else {
            settConfig({
                height: 350,
                width: window.innerWidth - configs.width
            })
            setTerminalOpen(true);
        }
    }

    function onFolderTapped() {
        console.log('Folder tapped')
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
                        <FileManager />
                    </div>
                </Resizable>

                <div className='editor-terminal' style={{ height: editor.height, width: editor.width }}>

                    <FeaturesIcons onTerminalTap={onTerminalTap} onFolderTap={onFolderTapped} isTerminalOpen={terminalOpen} />

                    <div className='editor' style={{ height: editor.height - tConfig.height }}>
                        <Editor />
                    </div>

                    {
                        terminalOpen ? (<ResizableBox axis='y' resizeHandles={['n']} handle={<div className="terminal-slider" />} height={tConfig.height} width={tConfig.width} minConstraints={[tConfig.width, 250]} maxConstraints={[tConfig.width, window.innerHeight - 50]} onResize={terminalResize}>
                            {/* <div className="box" style={{ width: editor.width + 'px', height: tHeight + 'px'}}>
    <span>Contents</span>
  </div> */}
                        </ResizableBox>) : (<></>)
                    }
                </div>
            </div>
        </dataContext.Provider>
    )
}
