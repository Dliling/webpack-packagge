import React from 'react';
// eslint-disable-next-line import/no-unresolved
import ReactDOM from 'react-dom';

import timg from './image/timg.jpeg';
import './search.less';
import '../common/js/index';
/* eslint-disable-next-line no-unused-vars */
class Search extends React.Component {
    constructor() {
        super();
        this.state = {
            Text: null,
        };
    }

    loadComp() {
        import('./text.js').then((Text) => {
            this.setState({
                Text: Text.default,
            });
        });
    }

    render() {
        const { Text } = this.state;
        return <div className="text">
            <div onClick = {this.loadComp.bind(this)}> react - babel 8888 </div>
            <img src={timg} />
            {
                Text ? <Text /> : null
            }
        </div>;
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('root'),
);
