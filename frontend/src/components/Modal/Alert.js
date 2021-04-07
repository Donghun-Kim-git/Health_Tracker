import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

const alert = (props) => (
    <Modal
        show={props.show}
        onHide={props.handleClose}
        backdrop="static"
    >
        <Modal.Header closeButton>
            <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            you can't take it back if you click yes
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={props.handleClose}>
                Oops No!
            </Button>
            <Button variant="primary" onClick={props.handleClearWorkouts}>yeah...:(</Button>
        </Modal.Footer>
    </Modal>
);

export default alert;
