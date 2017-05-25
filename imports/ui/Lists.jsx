/* eslint-disable no-undef,
 no-unused-vars */
import React, {Component} from 'react';
import {chunk} from 'lodash';
import {FormGroup, FormControl, Button, ControlLabel, Well} from 'react-bootstrap';

import AddList from './AddList.jsx';
import List from './List.jsx'

import SweetAlert from 'react-bootstrap-sweetalert';


class Lists extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedList: null,
            term: '',
            showModal:false,
            owned:false,
            alert: false,
            alertText: '',
            conf: null
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

    addList(){
        console.log("añadiiiiir");
    }

    confirmation(e, listId){
        e.preventDefault();
        console.log(e);

        console.log(listId);


        const getAlert = () => (
            <SweetAlert
            warning
            showCancel
            confirmBtnText="Yes, delete it!"
            confirmBtnBsStyle="danger"
            cancelBtnBsStyle="default"
            title="Are you sure you want to delete this list?"
            onCancel={()=>{
                this.fileSave();
            }}
            onConfirm={()=>{
                this.fileDeleted(listId);
            }}
            >
            Your list will be permanently deleted.
            </SweetAlert>
        );

        this.setState({
            conf: getAlert()
        });
    }

    fileSave() {
        const getAlert = () => (
            <SweetAlert error confirmBtnText="Ok" confirmBtnBsStyle="danger" title="Your list was not deleted" onConfirm={() => {
                this.hideAlert();
            }}></SweetAlert>
        );

        this.setState({conf: getAlert()});
    }

    fileDeleted(listId) {
        const getAlert = () => (
            <SweetAlert success confirmBtnText="Ok" confirmBtnBsStyle="success" title="Your list was successfully deleted" onConfirm={() => {
                this.hideAlert();
                //this.props.eraseProject(this.props.proyecto._id);
                console.log("deleted"+listId);
            }}></SweetAlert>
        );

        this.setState({conf: getAlert()});
    }

    hideAlert() {
        this.setState({conf: null});
    }


    render() {
        var patr = new RegExp(this.state.term,"i");

        return (
            <div>
                {this.state.conf}

                {this.state.selectedList
                    ? <div className="List">

                            <Button bsStyle="primary" style={{float:"right"}} onClick={() => this.setState({selectedList: null})} bsSize="small"><i className="fa fa-arrow-left" aria-hidden="true"></i>  Go back to my lists</Button>
                            <List groups={this.props.groupsOwned.concat(this.props.groupsIn)} list={this.state.selectedList} owned={this.state.owned}/>
                        </div>
                    : <div>
                        <h1 className="header">My Lists
                        </h1>
                        <hr></hr>

                        <div className="row">
                            <div className="col-md-2">
                                <h4>Search your lists</h4>

                            </div>
                            <div className="col-md-4">
                                <FormControl type="text" value={this.state.term} placeholder="Enter text" onChange={this.changeTerm.bind(this)}/>
                            </div>
                            <div className="col-md-3"></div>
                            <div className="col-md-3">
                                <Button className="newList" onClick={this.modalOpen.bind(this)} bsStyle="primary" > <i className="fa fa-plus fa-lg fa-inverse "></i> Add new list</Button>
                            <AddList show={this.state.showModal} modalClose={this.modalClose.bind(this)} addList={this.addList.bind(this)} />
                            </div>
                        </div>

                        <div className="Lists">
                            {console.log(this.props)}
                            <br></br>
                            <div className="row">
                                <div className="col-md-6 owned">

                                    <h2>Lists owned by me</h2>
                                    <hr></hr>
                                    {
                                        this.props.listsOwned && this.props.listsOwned.map((list) => {
                                        if(patr.test(list.name)||patr.test(list.description)){
                                            return(
                                                    <div>
                                                <Well bsSize="small" className="listBut">
                                                    <a type="button" onClick={(e) => this.confirmation(e,list._id)} className="close proyClose" aria-label="Erase list">
                                            <span aria-hidden="true">×</span>
                                        </a>

                                                    <div className="row" >

                                                        <div className="listWell col-md-11" onClick={()=>{this.setState({selectedList: list,owned:true})}}>
                                                        {console.log(list.name)}
                                                        <h4>{list.name}</h4>
                                                        <div className="row">
                                                            <div className="col-md-6">
                                                        <p>
                                                            {list.description}
                                                        </p>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <i className="fa fa-check done"></i>   <strong>Tasks completed: </strong>{list.completed}
                                                        <br></br>
                                                        <i className="fa fa-circle-o notDone"></i>    <strong>  Tasks pending: </strong>{list.pending}
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
                                    <h2>Lists shared with me</h2>
                                    <hr></hr>
                                    {
                                        this.props.listsShared && this.props.listsShared.map((list) => {
                                        if(patr.test(list.name)){
                                            return(
                                                <div>
                                            <Well bsSize="small" className="listBut">
                                                <div className="row" onClick={()=>{this.setState({selectedList: list,owned:true})}}>

                                                    <div className="listWell col-md-12">
                                                    {console.log(list.name)}
                                                    <h4>{list.name}</h4>
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                    <p>
                                                        {list.description}
                                                        <br></br>
                                                        <br></br>
                                                        <strong>Owner: </strong>{list.owner}
                                                    </p>
                                                </div>
                                                <div className="col-md-6">
                                                    <i className="fa fa-check done"></i>   <strong>Tasks completed: </strong>{list.completed}
                                                    <br></br>
                                                    <i className="fa fa-circle-o notDone"></i>    <strong>  Tasks pending: </strong>{list.pending}
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

export default Lists;
