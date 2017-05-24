import React, { Component } from 'react'
import {ButtonToolbar, Button, Modal} from 'react-bootstrap';
//import moment from 'moment-timezone';
//PageHeader, 
//, FormGroup, Form, ControlLabel, FormControl, Button

class SubscriptionDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        }
        this.showModal = this.showModal.bind(this);
        this.hideModal = this.hideModal.bind(this);
    }

    showModal() {
        this.setState({ show: true });
    }

    hideModal() {
        this.setState({ show: false });
    }

    render() {
        return (
            <ButtonToolbar>
                <Button bsStyle="primary" onClick={this.showModal}>
                    Show Subscription Details
                </Button>
                <Modal
                    show={this.state.show}
                    onHide={this.hideModal}
                    dialogClassName="custom-modal">
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-lg">Subscription Details in JSON Format</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{JSON.stringify(this.props.subs)}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.hideModal}>Close</Button>
                    </Modal.Footer>
                </Modal>
            </ButtonToolbar>
        );
    }
}

export default SubscriptionDetails;