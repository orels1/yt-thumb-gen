/**
 * Created by orel- on 06/Dec/15.
 */
import React from 'react';
import {Link} from 'react-router';
import NavbarStore from '../stores/NavbarStore';
import NavbarActions from '../actions/NavbarActions';

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = NavbarStore.getState();
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        NavbarStore.listen(this.onChange);

        // Ajax load animations
        $(document).ajaxStart(() => {
            NavbarActions.updateAjaxAnimation('loading');
        });

        $(document).ajaxComplete(() => {
            setTimeout(() => {
                NavbarActions.updateAjaxAnimation('');
            }, 750);
        });
    }

    componentWillUnmount() {
        NavbarStore.unlisten(this.onChange);
    }

    onChange(state) {
        this.setState(state);
    }

    // Search stuff. Was left here just to keep the useful code
    handleSubmit(event) {
        event.preventDefault();

        let searchQuery = this.state.searchQuery.trim();

        if (searchQuery) {
            /*
            * TODO: Implement search here
            * */
        }
    }

    render() {
        return (
            <nav className='navbar navbar-default navbar-static-top'>
                <div className='container-fluid'>
                    <div className='navbar-header'>
                        <button type='button' className='navbar-toggle collapsed' data-toggle='collapse' data-target='#navbar'>
                            <span className='sr-only'>Toggle navigation</span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                            <span className='icon-bar'></span>
                        </button>
                        <Link to='/' className='navbar-brand'>
                            <div className={ 'spinner ' + this.state.ajaxAnimationClass}></div>
                            React APP
                        </Link>
                    </div>
                    <div className='navbar-collapse collapse' id='navbar'>
                        {
                            // The search will not be shown since the expression below is always false
                        }
                        {false && <form className="navbar-form navbar-left top-search" onsubmit={this.handleSubmit.bind(this)} role="search">
                            <div className="input-group">
                                <input type="text" ref="topSearch" placeholder="Search" value={this.state.searchQuery} onChange={NavbarActions.updateSearchQuery}  className="form-control" />
                                <span className='input-group-btn'>
                                    <button type="submit"  onClick={this.handleSubmit.bind(this)} className="btn btn-default">Submit</button>
                                </span>
                            </div>
                        </form>}
                    </div>
                </div>
            </nav>
        );
    }
}

export default Navbar;
