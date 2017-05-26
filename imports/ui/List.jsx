/* eslint-disable no-undef,
 no-unused-vars */
import React, {Component} from 'react';
import {chunk} from 'lodash';
import {Button, Well, Table, FormControl, FormGroup, ControlLabel, Form} from 'react-bootstrap';
import SweetAlert from 'react-bootstrap-sweetalert';

//import {Projects} from '../api/checklists.js';



class Lists extends Component {

    constructor(props){
        super(props);
        this.state={
            alert: false,
            alertText: '',
            conf: null,
            itemName:'',
            assignedTo:''
        }
    }


    toggleCheck(itemId, status){
        //Meteor.call('updateItemStatus',{checklistId:this.props.list._id,itemId:itemid,status:status})
        console.log(itemId);
    }

    confirmation(itemId){
        console.log(itemId);


        const getAlert = () => (
            <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title="Are you sure you want to delete this item?"
            onCancel={()=>{
                this.fileSave();
            }}
            onConfirm={()=>{
                this.fileDeleted(itemId);
            }}
            >
            Your item will be permanently deleted.
            </SweetAlert>
        );

        this.setState({
            conf: getAlert()
        });
    }

    fileSave() {
        const getAlert = () => (
            <SweetAlert error confirmBtnText="Ok" confirmBtnBsStyle="danger" title="Your item was not deleted" onConfirm={() => {
                this.hideAlert();
            }}></SweetAlert>
        );

        this.setState({conf: getAlert()});
    }

    fileDeleted(itemId) {
        const getAlert = () => (
            <SweetAlert success confirmBtnText="Ok" confirmBtnBsStyle="success" title="Your item was successfully deleted" onConfirm={() => {
                this.hideAlert();
                //this.props.eraseProject(this.props.proyecto._id);
                console.log("deleted"+itemId);
            }}></SweetAlert>
        );

        this.setState({conf: getAlert()});
    }

    hideAlert() {
        this.setState({conf: null});
    }

    changeTerm(e) {
        this.setState({itemName: e.target.value});
    }

    changeAssigned(e){
        var person = (e.target.value);
        //console.log(person)
        this.setState({assignedTo:person});

    }

    addItem(e){
        e.preventDefault();
        var name = this.state.itemName;
        var assigned = this.state.assignedTo;
        console.log(name);
        console.log(assigned);
        //add item
    }

    

    render() {
        console.log(this.props)

            return (

                <div>
                    {this.state.conf}

                        <h1>{this.props.list.name}</h1>

                        <hr></hr>
                        <div className="row">
                            <div className="col-md-2">
                                <Button bsStyle="danger">Erase list</Button>
                            </div>
                            <div className="col-md-5">
                                <Form inline>
                                  <FormGroup controlId="formInlineName">
                                    <ControlLabel className="addPersonLabel">Add member: </ControlLabel>
                                    {' '}
                                    <FormControl className="addPerson" type="text" value={this.state.term} placeholder="mom@gmail.com" onChange={this.changeTerm.bind(this)}/>
                                  </FormGroup>
                                  {'  '}
                                  <Button bsSize="small" className="addItem" type="submit" onClick={(e)=>{this.addItem(e)}}>
                                    Add
                                  </Button>
                                </Form>
                            </div>
                            <div className="col-md-5">
                                <Form inline>
                                    <FormGroup controlId="formControlsSelect">
                                        <ControlLabel className="addGroupLabel">Add group:  </ControlLabel>

                                        <FormControl className="addGroup" componentClass="select" placeholder="">
                                            <option value="">select</option>
                                            {
                                                this.props.groups && this.props.groups.map((group)=>{
                                                    return(<option value={group.name}>{group.name}</option>)
                                                })
                                            }
                                        </FormControl>
                                      </FormGroup>
                                  {'  '}
                                  <Button bsSize="small" className="addItem" type="submit" onClick={(e)=>{this.addItem(e)}}>
                                    Add
                                  </Button>
                                </Form>
                            </div>
                        </div>
                        <br></br>
                        <br></br>
                        <div className="row">
                            <div className="col-md-8">
                                <Table className="table-items" responsive hover>
                                    <thead>
                                      <tr>
                                          <th></th>
                                        <th>Item</th>
                                        <th>Added By</th>
                                        <th>Assigned To</th>
                                        <th></th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            this.props.list.items && this.props.list.items.map((item)=>{
                                                return(
                                                    <tr className="item" onClick={()=>{this.toggleCheck(item._id,!item.done)}}>
                                                        <td><a type="button" onClick={() => this.confirmation(item._id)} className="close" aria-label="Close">
                                <span aria-hidden="true">
                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                </span>
                            </a></td>
                                                      <td>{item.name}</td>
                                                      <td>{item.addedBy}</td>
                                                      <td>{item.assignedTo}</td>
                                                      <td>{
                                                          item.done?
                                                          <i className="fa fa-circle-o fa-lg notDone"></i>
                                                          :
                                                          <i className="fa fa-check-circle-o fa-lg done"></i>
                                                      }</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                  </Table>
                                  <div className="row">
                                      <Form inline className="newItem">
                                        <FormGroup controlId="formInlineName">
                                          <ControlLabel className="itemLabel">Item</ControlLabel>
                                          {' '}
                                          <FormControl type="text" value={this.state.term} placeholder="Eggs" onChange={this.changeTerm.bind(this)}/>
                                        </FormGroup>
                                        {'  '}
                                        <FormGroup controlId="formControlsSelect">
                                            <ControlLabel className="assignLabel">Assign to:  </ControlLabel>

                                            <FormControl onChange={(e)=>{this.changeAssigned(e)}} componentClass="select" placeholder="">
                                                <option value="">Don't assign</option>
                                                {
                                                    this.props.list.sharedwith && this.props.list.sharedwith.map((person, i)=>{
                                                        return(<option value={person}>{person}</option>)
                                                    })
                                                }
                                            </FormControl>
                                          </FormGroup>
                                        {' '}
                                        <Button bsSize="small" className="addItem" type="submit" onClick={(e)=>{this.addItem(e)}}>
                                          Add Item
                                        </Button>
                                      </Form>
                                  </div>


                            </div>
                            <div className="col-md-4">
                                <h3>Description</h3>
                                <Well>
                                    <p className="description">{this.props.list.description}</p>
                                </Well>
                                <h3>Members</h3>
                                <Well>
                                    {
                                        this.props.list.sharedwith && this.props.list.sharedwith.map((person)=>{
                                            return(<p>{person}</p>)

                                        })
                                    }
                                </Well>
                            </div>

                        </div>

                        <div className="row">
                            <div className="col-md-8">

                            </div>
                        </div>
                </div>


            );


    }

}

export default Lists;
