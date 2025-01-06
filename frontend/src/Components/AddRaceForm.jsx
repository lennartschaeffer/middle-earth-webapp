import Axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { FloatingLabel } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
const AddRaceForm = ({ show, handleClose, onAdd }) => {
  const [name, setName] = useState();
  const [bgColour, setBgColour] = useState("");

  const handleNameChange = (e) => {
    setName(e);
  };

  const submit = () => {
    if (!name || !bgColour) {
      toast("please fill in all fields!");
      return;
    }
    if (!bgColour.startsWith("#")) {
      toast("please start your theme with a #");
      return;
    }
    Axios.post("https://middleearthcharacters-f0c4hbbbg9gdevf6.eastus-01.azurewebsites.net/api/Race", {
      name: name,
      backgroundColor: bgColour,
    })
      .then((res) => {
        onAdd();
        handleClose();
      })
      .catch((err) => {
        toast("Error: "+err.response.data);
      });
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <ToastContainer/>
      <Modal.Header closeButton>
        <Modal.Title>Add Race</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ToastContainer />
        <FloatingLabel controlId="name" label="Race Name" className="mb-3">
          <Form.Control
            type="text"
            placeholder="Hobbit, Dwarf, Elf..."
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="bg"
          label="Background Theme (Hexadecimal Format)"
          className="mb-3 overflow-auto"
        >
          <Form.Control
            type="text"
            placeholder="#FFF..."
            onChange={(e) => setBgColour(e.target.value)}
          />
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
  );
};

export default AddRaceForm;
