/* eslint-disable no-undef,
 no-unused-vars */

import React, {PropTypes} from 'react';
import {
    Navbar,
    NavItem,
    NavDropdown,
    MenuItem,
    Nav,
    FormGroup,
    FormControl,
    Button,
    Modal
} from 'react-bootstrap';

export default class LoginButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'icon': 'fa ' + this.props.icon,
            'service': ' Login with ' + this.props.service,
            'serviceFunc': 'loginWith' + this.props.service
        }
    }

    render() {
        return (
            <Button type="button" onClick={() => this.props.login(this.state.serviceFunc)}>
                <i className={this.state.icon}></i>
                {this.state.service}
            </Button>
        );
    }

}