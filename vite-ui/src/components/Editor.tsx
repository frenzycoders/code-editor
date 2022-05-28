import CodeEditor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import CircularProgress from '@mui/material/CircularProgress';
function Editor() {
    return (
        <CodeEditor
            defaultLanguage='javascript'
            defaultValue='// Start writing your code here'
            theme='vs-dark'
            loading={<CircularProgress />}
        />
    )
}

export default Editor