/**
 * Created by orel- on 06/Dec/15.
 */
import React from 'react';
import HomeStore from '../stores/HomeStore';
import HomeActions from '../actions/HomeActions';
import {Link} from 'react-router';

// Extra components
import Drawing from './Drawing';

// Your main class, as defined in routes.
// You can read more about component's lifecycle here
// https://facebook.github.io/react/docs/component-specs.html

class Home extends React.Component {
    constructor(props) {
        super(props);
        // We are getting state from our store
        this.state = HomeStore.getState();
        // And listen to any changes to get the two-way binding
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        // Will fire once, after markup has been injected
        HomeStore.listen(this.onChange);
    }

    componentWillUnmount() {
        // Will fire once before markup has been removed
        HomeStore.unlisten(this.onChange);
    }

    onChange(state) {
        // We are listening to the store here and apply changes to this.state accodingly
        this.setState(state);
    }

    render() {
        return (
            <div>
                <Drawing />
            </div>
        );
    }
}

export default Home;
