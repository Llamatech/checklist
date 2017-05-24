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
import LoginButton from './loginbtn.jsx';
import { LinkContainer } from 'react-router-bootstrap';

// import PForm from './proyForm';

class Navib extends React.Component {
    buscar(term) {
        this.props.buscar(term);
        //aqui se llama para atras a lo que llame a la db
    }

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showSearch: false,
            alert: false
        };
    }

    modalClose() {
        this.setState({showModal: false});
    }

    modalOpen() {
        if (Meteor.user()) {
            this.setState({showModal: true});
        } else {
            this.setState({alert: true});
        }
    }

    close() {
        this.setState({alert: false});
    }

    searchClose() {
        this.setState({showSearch: false});
    }

    searchOpen() {
        this.setState({showSearch: true});
    }

    render() {
        return (
            <div>
              <Navbar inverse collapseOnSelect className="navbar-fixed-top">
                <Navbar.Header>
                  <Navbar.Brand>
                    <a className="logo" onClick={()=>this.props.backHome()}><img src="http://duckit.margffoy-tuay.com/static/checklist.svg" alt="logo" width="20px" style={{float: 'left', 'marginRight': '5px'}}></img>   ListHub</a>
                  </Navbar.Brand>
                  <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                  <Nav>
                    <NavItem className="newProj" onClick={this.modalOpen.bind(this)}>
                      <i className="fa fa-plus fa-lg fa-inverse "></i>    Add new list
                    </NavItem>
                  </Nav>
                  {Meteor.user()?
                  <Nav>
                      <LinkContainer to="lists">
                    <NavItem className="newProj" onClick={this.modalOpen.bind(this)}>
                      My lists
                    </NavItem>
                    </LinkContainer>

                    <NavItem className="newProj" onClick={this.modalOpen.bind(this)}>
                      My groups
                    </NavItem>
                  </Nav>
                      :
                  <Nav pullRight>
                  <NavDropdown title="Login" id="basic-nav-dropdown" className="newProj" >
                     <LoginButton icon='fa-facebook'
                                   service='Facebook'
                                   login={this.props.login}/>
                    <LoginButton icon='fa-google'
                                    service='Google'
                                    ogin={this.props.login}/>
                    <LoginButton icon='fa-twitter'
                                    service='Twitter'
                                    login={this.props.login}/>
                  </NavDropdown>
                </Nav>
                }
                  {Meteor.user()?
                  <Nav pullRight>
                      <NavItem disabled={true}>
                          <i className="fa fa-user" aria-hidden="true"></i>  {Meteor.user().profile.name}
                      </NavItem>
                </Nav>:null
                }
                </Navbar.Collapse>
              </Navbar>
              <Modal show={this.state.alert} onHide={()=>this.close()}>
                <Modal.Header closeButton>
                  You must be logged in to add a new project
                </Modal.Header>

              </Modal>
            </div>
        );
    }
}

export default Navib;
