import React from 'react'
import Multiselect from 'multiselect-react-dropdown';
import { Container, Col, Row } from 'react-bootstrap';

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";

const io = require("socket.io-client");
const axios = require('axios');



class OddsRoom extends React.Component {
	constructor(props){
		super(props)
		console.log("props are", this.props.auth.user.name.split(' ')[0]);
		this.state = {
			value: '',
			msgs: [],
			selectedValues : [],
            //options: [{ publisher:'pub1' ,topic: 'us', id: 1,},{ publisher:'pub2', topic: 'uk', id: 2}]
		  options : []
		}

		
		//this.socket = SocketIOClient('http://localhost:5000/')
		this.socket = io.connect("ws://localhost:7000",{'forceNew':true });

		//this.onSelect = this.onSelect.bind(this)
		//this.onRemove = this.onRemove.bind(this)
		this.subscribe = this.subscribe.bind(this)
		//this.unSubscribe = this.unSubscribe.bind(this)
    }


    componentDidMount() {

        let count = 0;
        axios.get('http://localhost:5000/subscriptions',
        {
        params : {
         subscriber: this.props.auth.user.name
        }
        })
          .then(res => {
            const subscriptions = res.data;
            const selectedValues = [];
            subscriptions.forEach((sub) => {
                                     selectedValues.push({"publisher": sub.publisher, "topic": sub.topic , "id" : count + 1 });
                                     this.subscribe(sub.topic, sub.publisher);
                                     }
                                     )
            this.setState({ selectedValues: selectedValues });

          })

        axios.get('http://localhost:5000/topics')
                  .then(res => {
                    const subscriptions = res.data;
                    const options = [];
                    subscriptions.map(sub => options.push({"publisher": sub.publisher, "topic": sub.topic , "id" : count + 1 }))
                    this.setState({ options: options });
        })
    }
		/*
		this.handleChange = this.handleChange.bind(this)
    	this.handleSubmit = this.handleSubmit.bind(this)
    	this.socket.on('message', (o) => {
			this.setState({msg: this.state.msg.concat(o)}) 
		})
		*/
		/*

		this.socket.on('US', (msg) => {
   			console.log(msg);
		});


		this.socket.on('greetings', (msg) => {
    		console.log(msg)
			this.state.msgs.push(msg); 
		})

		this.socket.on('disconnect', () => {
   			this.socket.removeAllListeners();
		});
	}

	/*

	handleChange = (e) => {
		this.setState({value: e.target.value})
	}

	handleSubmit = (e) => {
		this.socket.emit('message', this.state.value)
		this.setState({value: ''})
		e.preventDefault()
	}

	*/

    
    subscribe(topic, publisher){
    	this.socket.emit("subscribe", topic, publisher, {"name": this.props.auth.user.name});
    	this.socket.on(topic, (msg) => {
    	    console.log("received msg is", msg)
    		let { msgs } = this.state;
    		msgs.push(msg)
    		this.setState({msgs: msgs})
    		console.log("msgs receiced is", msgs)
    	});
    }


    unSubscribe(topic, publisher){
        this.socket.emit("unsubscribe", topic, publisher, {"name": this.props.auth.user.name});
    	//this.socket.off(topic, this.eventCallback);
    	this.socket.removeAllListeners(topic);
    }


    onSelect(selectedList, selectedItem) {
    	console.log("subscribed topic is", selectedItem.topic);
		this.subscribe(selectedItem.topic, selectedItem.publisher);
    }


    eventCallback(data) {
  		console.log(data);
    }

    onRemove(selectedList, removedItem) {
    	this.unSubscribe(removedItem.topic, removedItem.publisher);
    }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

	render() {

    const { auth_user } = this.props.auth;


		return(
			<div>

                <button
              style={{
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "1.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn btn-large waves-effect waves-light hoverable blue accent-3"
            >
              Logout
            </button>

                <h4> Hello {this.props.auth.user.name.split(' ')[0] } , </h4>
                
                <h4 className="subscribe-field">Subscriptions</h4>

                <Multiselect options={this.state.options} // Options to display in the dropdown
                             selectedValues={this.state.selectedValues} // Preselected value to persist in dropdown
                             onSelect={this.onSelect.bind(this)} // Function will trigger on select event
                             onRemove={this.onRemove.bind(this)} // Function will trigger on remove event
                             displayValue="topic"
                              // Property name to display in the dropdown options
                />

                


				<ul id="messages">
            <Container className="event-header-container">
									   <Row className="p-4">
									        <Col xs={2} className="p-2">
									          Bookie
									        </Col>
										    <Col xs={6} className="p-2">
										       Teams
										    </Col>
										    <Col xs={2} className="p-2">
										       1
										    </Col>
										    <Col xs={2} className="p-2">
										       2
										    </Col>
						               </Row>
					    </Container>

						{this.state.msgs.map((item , index) => {

							return(<Container className="event-container">
									   <Row className="p-4">
									        <Col xs={2} className="p-2">
									          {item.bookmaker}
									        </Col>
										    <Col xs={6} className="teams-field p-2">
										      <Row> {item.team1}</Row>
										      <Row> {item.team2}</Row>
										    </Col>
										    <Col xs={2} className="odds1 p-2">
										       {item.odds1}
										    </Col>
										    <Col xs={2} className="odds2 p-2">
										       {item.odds2}
										    </Col>
						               </Row>
					            </Container>
					        )
						})
					}
				</ul>
			      
		    </div>
		)
	}
}


OddsRoom.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(OddsRoom);

