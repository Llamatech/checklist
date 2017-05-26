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
//import {Checklists} from '../api/checklists.js'

class AddGroup extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            errorAlert: false,
            goodAlert: false
        };
    }

    handleChangeName(e) {
        console.log(e.target.value);
        this.setState({name: e.target.value, errorAlert: false, goodAlert: false});
    }
    handleChangeDesc(e) {
        console.log(e.target.value);
        console.log(this.state.date)
        this.setState({description: e.target.value, errorAlert: false, goodAlert: false});
    }


    addList(evt) {
        evt.preventDefault();
        var group = {};
        group.name = this.state.name;
        group.description = this.state.description;

        Meteor.call('group.insert',{group},(err,res)=>{
            console.log(err);
            console.log(res);
        })
    }

    render() {
        return (
            <div>

              <Modal show={this.props.show} onHide={()=>this.props.modalClose()}>
                <Modal.Header closeButton>
                  <Modal.Title>Add a new Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                  <form onSubmit={this.addList.bind(this)}>
                    <FormGroup controlId="formBasicText">
                      <ControlLabel>Give your group a name!</ControlLabel>

                      <FormControl
                        type="text"
                        value={this.state.name}
                        placeholder="Monthly Shopping List"
                        onChange={this.handleChangeName.bind(this)}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                    <FormGroup controlId="formControlsTextarea">
                      <ControlLabel>Your group's description:</ControlLabel>

                      <FormControl componentClass="textarea" placeholder="This months groceries!"
                        value={this.state.description} onChange={this.handleChangeDesc.bind(this)}/>
                    </FormGroup>
                    <FormGroup>
                        <Button type="submit">
                          Create
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

export default AddGroup;
