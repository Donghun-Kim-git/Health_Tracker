import React from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
const modal = props => (
        <Modal
            show={props.show}
            onHide={props.handleClose}
            backdrop="static"
        >
            <Modal.Header closeButton>
                <Modal.Title>Record your workout!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {props.children}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={props.handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={props.handleSave}>Save</Button>
            </Modal.Footer>
        </Modal>
);

export default modal;