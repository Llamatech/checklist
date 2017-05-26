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
            showRemove:false
        }
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

    addOpen() {
        this.setState({showAdd: true});
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

    addMember(){

    }


    render() {
        var patr = new RegExp(this.state.term,"i");

        return (
            <div>

                {this.state.conf}

                

                {this.state.selectedGroup
                    ? <div className="Group">

                            <Button bsStyle="primary" style={{float:"right"}} onClick={() => this.setState({selectedGroup: null})} bsSize="small"><i className="fa fa-arrow-left" aria-hidden="true"></i>  Go back to my groups</Button>
                        </div>
                    : <div>
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
                                                        <h4>{group.name}</h4>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                        <p>
                                                            {group.description}
                                                        </p>
                                                        <ul>
                                                            {
                                                                group.members && group.members.map((member)=>{
                                                                    <il>{member.email}</il>
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                                <Button bsSize="small" className="newGroup" onClick={this.modalOpen.bind(this)} bsStyle="primary" > <i className="fa fa-plus fa-lg fa-inverse "></i> Add member</Button>
                                                            </div>
                                                            <div className="col-md-6">
                                                                <Button bsSize="small" className="newGroup" onClick={this.modalOpen.bind(this)} bsStyle="danger" > <i className="fa fa-minus fa-lg fa-inverse "></i> Remove member</Button>
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
                }
            </div>

        );

    }

}

export default Groups;
