import Axios  from 'axios'
import React from 'react'
import { toast } from 'react-toastify'
import { ToastContainer } from 'react-toastify'
import { useState } from 'react'
import { Modal } from 'react-bootstrap'
import {FloatingLabel} from 'react-bootstrap'
import { Form } from 'react-bootstrap'
import {Button} from 'react-bootstrap'
const AddLocationForm = ({show, handleClose, onAdd}) => {
    const [name, setName] = useState()

    const handleNameChange = (e) => {
        setName(e)
    }

    const submit = () => {
        Axios.post("https://middleearthcharacters-f0c4hbbbg9gdevf6.eastus-01.azurewebsites.net/api/Home", {
            name: name,
        })
        .then((res) => {
            onAdd()
            handleClose()
        })
        .catch((err) => {
            toast('Error: '+err.response.data)
            console.log(err)
        })
    }
  return (
    <Modal show={show} onHide={handleClose} centered>
    <Modal.Header closeButton>
      <Modal.Title>Add Location</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <ToastContainer/>
      <FloatingLabel
        controlId="name"
        label="Location Name"
        className="mb-3"
      >
        <Form.Control type="text" placeholder="Somewhere on Middle Earth..." onChange={(e) => handleNameChange(e.target.value)}/>
      </FloatingLabel>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Close
      </Button>
      <Button variant="primary" onClick={submit}>
        Add
      </Button>
    </Modal.Footer>
  </Modal>
  )
}

export default AddLocationForm