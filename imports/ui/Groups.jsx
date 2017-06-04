/* eslint-disable no-undef,
 no-unused-vars */
import React, {Component} from 'react';
import {chunk} from 'lodash';
import {FormGroup, FormControl, Button, ControlLabel, Well, Modal} from 'react-bootstrap';

import AddGroup from './AddGroup.jsx';
//import Group from './Group.jsx'

import SweetAlert from 'react-bootstrap-sweetalert';


class Groups extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedGroup: null,
            term: '',
            showModal:false,
            owned:false,
            alert: false,
            alertText: '',
            conf: null,
            showAdd:false,
            showRemove:false,
            addMember:''
        }

        this.addMember=this.addMember.bind(this);
    }

    changeTerm(e) {
        this.setState({term: e.target.value});
    }

    modalClose() {
        this.setState({showModal: false});
    }

    modalOpen() {
        this.setState({showModal: true});
    }

    addClose() {
        this.setState({showAdd: false});
    }

    addOpen(group) {
        console.log("open el puto add")
        console.log(group);
        this.setState({showAdd: true, selectedGroup: group});
    }

    removeClose() {
        this.setState({showRemove: false});
    }

    removeOpen() {
        this.setState({showRemove: true});
    }

    addGroup(){
        console.log("añadiiiiir");
    }

    confirmation(e, groupId){
        e.preventDefault();
        console.log(e);

        console.log(groupId);


        const getAlert = () => (
            <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title="Are you sure you want to delete this group?"
            onCancel={()=>{
                this.fileSave();
            }}
            onConfirm={()=>{
                this.fileDeleted(groupId);
            }}
            >
            Your group will be permanently deleted.
            </SweetAlert>
        );

        this.setState({
            conf: getAlert()
        });
    }

    fileSave() {
        const getAlert = () => (
            <SweetAlert error confirmBtnText="Ok" confirmBtnBsStyle="danger" title="Your group was not deleted" onConfirm={() => {
                this.hideAlert();
            }}></SweetAlert>
        );

        this.setState({conf: getAlert()});
    }

    fileDeleted(groupId) {
        const getAlert = () => (
            <SweetAlert success confirmBtnText="Ok" confirmBtnBsStyle="success" title="Your group was successfully deleted" onConfirm={() => {
                this.hideAlert();
                Meteor.call('group.delete',{groupId:groupId})
                console.log("deleted"+groupId);
            }}></SweetAlert>
        );

        this.setState({conf: getAlert()});
    }

    hideAlert() {
        this.setState({conf: null});
    }

    addMember(e){
        e.preventDefault();
        //console.log(this.state.addMember)
        console.log(e);

        Meteor.call('group.addUser', {groupId:this.state.selectedGroup._id, user:{email:this.state.addMember,name:''}})

    }

    handleMemberChange(e){
        this.setState({addMember:e.target.value})
    }


    render() {
        var patr = new RegExp(this.state.term,"i");

        return (
            <div>

                {this.state.conf}

                <Modal show={this.state.showAdd} onHide={()=>this.addClose()}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add a new Member to your group</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>

                    <form onSubmit={this.addMember.bind(this)}>
                      <FormGroup controlId="formBasicText">
                        <ControlLabel>Member's identifier:</ControlLabel>

                        <FormControl
                          type="text"
                          value={this.state.name}
                          placeholder="mom@google.com"
                          onChange={this.handleMemberChange.bind(this)}
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
                    <a onClick={()=>this.addClose()}>Close</a>
                  </Modal.Footer>
                </Modal>


                        <h1 className="header">My Groups
                        </h1>
                        <hr></hr>

                        <div className="row">
                            <div className="col-md-2">
                                <h4>Search your groups</h4>

                            </div>
                            <div className="col-md-4">
                                <FormControl type="text" value={this.state.term} placeholder="Enter text" onChange={this.changeTerm.bind(this)}/>
                            </div>
                            <div className="col-md-3"></div>
                            <div className="col-md-3">
                                <Button className="newGroup" onClick={this.modalOpen.bind(this)} bsStyle="primary" > <i className="fa fa-plus fa-lg fa-inverse "></i> Add new group</Button>
                            <AddGroup show={this.state.showModal} modalClose={this.modalClose.bind(this)} addGroup={this.addGroup.bind(this)} />
                            </div>
                        </div>

                        <div className="Groups">
                            {console.log(this.props)}
                            <br></br>
                            <div className="row">
                                <div className="col-md-6 owned">

                                    <h2>Groups owned by me</h2>
                                    <hr></hr>
                                    {
                                        this.props.groupsOwned && this.props.groupsOwned.map((group) => {
                                        if(patr.test(group.name)||patr.test(group.description)){
                                            return(
                                                    <div>
                                                <Well bsSize="small" className="groupBut">
                                                    <a type="button" onClick={(e) => this.confirmation(e,group._id)} className="close proyClose" aria-label="Erase group">
                                            <span aria-hidden="true">×</span>
                                        </a>

                                                    <div className="row" >

                                                        <div className="groupWell col-md-11" onClick={()=>{this.setState({selectedGroup: group,owned:true})}}>
                                                        {console.log(group.name)}
                                                        <h3>{group.name}</h3>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                        <p>
                                                            {group.description}
                                                        </p>
                                                        <h4>Members</h4>
                                                        <ul>
                                                            {
                                                                group.members && group.members.map((member)=>{
                                                                    return(<li>{member.email}</li>)
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                {console.log(group)}
                                                                <Button bsSize="small" className="newGroup" onClick={()=>{this.addOpen(group)}} bsStyle="primary" > <i className="fa fa-plus fa-lg fa-inverse "></i> Add member</Button>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <Button bsSize="small" className="newGroup" onClick={this.removeOpen.bind(this)} bsStyle="danger" > <i className="fa fa-minus fa-lg fa-inverse "></i> Remove member</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                        </div>
                                                        </div>


                                                    </div>
                                                </Well>
                                                </div>
                                            )
                                        }
                                    }
                                )}

                                </div>

                                <div className="col-md-6 owned">
                                    <h2>Groups I'm in</h2>
                                    <hr></hr>
                                    {
                                        this.props.groupsIn && this.props.groupsIn.map((group) => {
                                        if(patr.test(group.name)){
                                            return(
                                                <div>
                                            <Well bsSize="small" className="groupBut">
                                                <div className="row" onClick={()=>{this.setState({selectedGroup: group,owned:true})}}>

                                                    <div className="groupWell col-md-12">
                                                    {console.log(group.name)}
                                                    <h4>{group.name}</h4>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                    <p>
                                                        {group.description}
                                                        <br></br>
                                                        <br></br>
                                                        <strong>Owner: </strong>{group.owner}
                                                    </p>
                                                    <h4>Members</h4>
                                                    <ul>
                                                        {
                                                            group.members && group.members.map((member)=>{
                                                                return(<li>{member.email}</li>)
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                                    </div>
                                                    </div>


                                                </div>
                                            </Well>
                                            </div>
                                            )
                                        }
                                    }
                                )}

                                </div>

                            </div>


                        </div>
                    </div>


        );

    }

}

export default Groups;
