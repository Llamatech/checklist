/* eslint-disable no-undef,
 no-unused-vars */
import React, {Component} from 'react';
import {chunk} from 'lodash';
import {FormGroup, FormControl, Button, ControlLabel} from 'react-bootstrap';

import AddList from './AddList.jsx';

class Lists extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedList: null,
            term: '',
            showModal:false
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

    render() {
        var patr = new RegExp(this.state.term,"i");

        return (
            <div>

                {this.state.selectedList
                    ? <div className="List">

                            {this.state.selectedList}
                            <a type="button" onClick={() => this.setState({selectedList: null})} className="close" aria-label="Close">b</a>
                            <List list={this.state.selectedList}></List>

                        </div>
                    : <div>
                        <h1 className="header">Your Lists
                        </h1>

                        <div className="row">
                            <div className="col-md-2">
                                <h4>Search your lists</h4>

                            </div>
                            <div className="col-md-4">
                                <FormControl type="text" value={this.state.term} placeholder="Enter text" onChange={this.changeTerm.bind(this)}/>
                            </div>
                            <div className="col-md-2"></div>
                            <div className="col-md-3">
                                <Button onClick={this.modalOpen.bind(this)} bsStyle="primary" bsSize="large"> <i className="fa fa-plus fa-lg fa-inverse "></i> Add new list</Button>
                            <AddList show={this.state.showModal} modalClose={this.modalClose.bind(this)} addList={this.addList.bind(this)} />
                            </div>
                        </div>

                        <div className="Lists">
                            {console.log(this.props)}

                            {
                                this.props.listsShared && this.props.listsShared.map((list) => {
                                if(patr.test(list.name)){
                                    console.log("estoy")
                                }
                            }
                        )}
                        </div>
                    </div>
                }
            </div>

        );

    }

}

export default Lists;
