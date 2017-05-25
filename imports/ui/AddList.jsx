/* eslint-disable no-undef,
 no-unused-vars */
import React, {PropTypes} from 'react';
import {
    Button,
    Modal,
    FormGroup,
    FormControl,
    ControlLabel,
    HelpBlock
} from 'react-bootstrap';
import axios from 'axios';

class AddList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: ''
        };
    }

    handleChangeUrl(e) {
        this.setState({url: e.target.value, errorAlert: false, goodAlert: false});
    }
    handleChangeDesc(e) {
        this.setState({description: e.target.value, errorAlert: false, goodAlert: false});
    }
    handleChangeCollab(e) {
        this.setState({collaborator: e.target.value, errorAlert: false, goodAlert: false});
    }

    addList(evt) {
        evt.preventDefault();
        this.props.addList();
    }

    render() {
        return (
            <div>

              <Modal show={this.props.show} onHide={()=>this.props.modalClose()}>
                <Modal.Header closeButton>
                  <Modal.Title>Add a new List</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                  <form onSubmit={this.addList.bind(this)}>
                    <FormGroup controlId="formBasicText">
                      <ControlLabel>Github repository</ControlLabel>

                      <FormControl
                        type="text"
                        value={this.state.url}
                        placeholder="https://github.com/ownerName/repoName"
                        onChange={this.handleChangeUrl.bind(this)}
                      />
                      <FormControl.Feedback />
                        <HelpBlock>For the moment, we are only working with github repositories. In the future, we'd love to add support for other repository
                        sites, but for now, please make sure your repo link matches the one given as example.</HelpBlock>

                    </FormGroup>
                    <FormGroup controlId="formControlsTextarea">
                      <ControlLabel>Description</ControlLabel>
                        <HelpBlock>Try to convey what your project means to you, what you hope to achieve, and short and long term goals
                        that you might have. This description is what others we'll see when they open your project, so make it interesting!
                        Remember that your repo should also have a description, as that is the short summary you see in the project
                        thumbnails. If you add a webpage to the repo, it will be shown here.</HelpBlock>
                      <FormControl componentClass="textarea" placeholder="My project is the best and you should collaborate with me!"
                        value={this.state.description} onChange={this.handleChangeDesc.bind(this)}/>
                    </FormGroup>
                    <FormGroup controlId="formControlsTextarea">
                      <ControlLabel>The ideal collaborator for this project is...</ControlLabel>
                        <HelpBlock>In this section, we give you the oportunity to define who the ideal collaborator for your project would be.
                        You are welcome to leave this section empty, and it simply won't show up on your project page.</HelpBlock>
                      <FormControl componentClass="textarea" placeholder="textarea"
                        placeholder="Well versed in java, with some knowledge of javascript and a passion for leaning things on the go"
                        value= {this.state.collaborator} onChange={this.handleChangeCollab.bind(this)}/>
                        <Button type="submit">
                          Send
                        </Button>
                    </FormGroup>
                  </form>

                </Modal.Body>
                <Modal.Footer>
                  <a onClick={()=>this.props.modalClose()}>Close</a>
                </Modal.Footer>
              </Modal>
            </div>
        );
    }
}

export default AddList;