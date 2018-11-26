import '../node_modules/antd/dist/antd.min.css'
import React from 'react';
import ReactDOM from 'react-dom';
import { AnnotationService } from './annotation-service';

class App extends React.Component {

    render() {
        return (
            <div style={{ padding: '30px 300px' }}>
                <AnnotationService />
            </div>
        )
    }

}

ReactDOM.render(<App />, document.getElementById('root'))