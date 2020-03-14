import React from 'react';
import { withRouter } from 'react-router-dom';
import './HeaderNav.less';

function HeaderNav(props) {
    let {title, history, children} = props;

    return <div className='headerNav'>
        <div className='returnArrow' onClick={ev=> {
            history.go(-1);
        }}></div>
        <h5 className='title'>{title || '小米有品'}</h5>
        <div className='children'>{children}</div>
    </div>
}

export default withRouter(HeaderNav);