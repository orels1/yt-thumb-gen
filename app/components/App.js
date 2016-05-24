/**
 * Created by orel- on 06/Dec/15.
 */
import React from 'react';
import Navbar from './Navbar';


/**
 * This class should be mainly left as-is.
 * Main purpose is to form the general markup for all the "pages".
 * So you have a "static" navbar which is always present,
 * and then all the content is inside a container
 */

class App extends React.Component {
    render() {
        return (
            <div>
                <Navbar history={this.props.history} />
                <div className="container">
                    {this.props.children}
                </div>
            </div>
        );
    }
}

export default App;
