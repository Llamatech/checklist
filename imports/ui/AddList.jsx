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

class AddList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            date: new Date(0),
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
    handleChangeDate(e) {
        var date = e.target.valueAsDate;
        date.setDate(date.getDate()+1);
        console.log(date);
        this.setState({date: date, errorAlert: false, goodAlert: false});
    }

    addList(evt) {
        evt.preventDefault();
        var checklist = {};
        checklist.name = this.state.name;
        checklist.description = this.state.description;
        checklist.completeBefore = this.state.date;

        Meteor.call('checklists.insert',{checklist},(err,res)=>{
            console.log(err);
            console.log(res);
        })
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
                      <ControlLabel>Give your list a name!</ControlLabel>

                      <FormControl
                        type="text"
                        value={this.state.name}
                        placeholder="https://github.com/ownerName/repoName"
                        onChange={this.handleChangeName.bind(this)}
                      />
                      <FormControl.Feedback />
                    </FormGroup>
                    <FormGroup controlId="formControlsTextarea">
                      <ControlLabel>Your list's description:</ControlLabel>

                      <FormControl componentClass="textarea" placeholder="My project is the best and you should collaborate with me!"
                        value={this.state.description} onChange={this.handleChangeDesc.bind(this)}/>
                    </FormGroup>
                    <FormGroup controlId="formBasicText">
                      <ControlLabel>Deadline:</ControlLabel>

                      <FormControl
                        type="date"
                        placeholder="https://github.com/ownerName/repoName"
                        onChange={this.handleChangeDate.bind(this)}
                      />
                      <FormControl.Feedback />
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

export default AddList;
