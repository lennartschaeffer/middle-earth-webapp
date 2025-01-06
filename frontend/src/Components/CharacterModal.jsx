import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { FaPlus } from "react-icons/fa6";
import Form from "react-bootstrap/Form";
import { toast, ToastContainer } from "react-toastify";
import Axios from "axios";

const CharacterModal = ({ show, character, race, handleClose, refresh }) => {
  const [showTextBox, setShowTextBox] = useState(false);
  const [biography, setBiography] = useState("");
  const showBiographyTextBox = () => {
    setShowTextBox(true);
  };
  const submitBiography = () => {
    if (biography === "") {
      toast("Please enter a biography!");
      return;
    }
    Axios.put(
      `http://localhost:5237/api/Characters/Biography/${character?.id}`,
      {
        biography: biography,
      }
    )
      .then((res) => {
        toast("biography changed succesfully!");
        refresh();
        handleClose();
      })
      .catch((err) => {
        console.log(err);
        toast("there was an error uploading your biography");
      });
  };

    const removeBiography = () => {
      Axios.put(
        `http://localhost:5237/api/Characters/Biography/${character?.id}`,
        {
          biography: "",
        }
      )
        .then((res) => {
          handleClose();
          refresh();
        })
        .catch((err) => {
          console.log(err);
          toast("there was an error removing the biography");
        });
    }

  return (
    <Modal show={show} onHide={handleClose} centered>
      <ToastContainer />
      <ModalHeader className="bg-dark text-light" closeButton>
        <ModalTitle>More Info</ModalTitle>
      </ModalHeader>
      <ModalBody className="bg-dark text-light">
        <div className="card bg-dark text-light border-0">
          <div className="card-header border-0">
            <div className="card-title">
              <h4>{character?.name}</h4>
            </div>
            <div className="card-subtitle">
              {character?.raceName}, {character?.homeName}
            </div>
          </div>
          <div className="card-body">
            {character?.biography ? (
              <div className="card-text">
                {character?.biography}
                <br />
                <button onClick={removeBiography} className="mt-1 bg-danger">
                  <FaTrashAlt />
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-2">
                <div className="card-text">No Biography Yet... </div>
                <button onClick={showBiographyTextBox}>
                  Add Biography <FaPlus />
                </button>
                {showTextBox && (
                  <div>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      className="mb-3 bg-dark text-light"
                      onChange={(e) => {
                        console.log(e.target.value);
                        setBiography(e.target.value);
                      }}
                    />
                    <button onClick={submitBiography}>Submit</button>
                  </div>
                )}
              </div>
            )}

            <div className="card-text mt-2">
              <b>
                {" "}
                {character?.weapon?.name} ({character?.weapon?.weaponType}){" "}
              </b>{" "}
              <br />
              {character?.weapon?.weaponDescription}
            </div>
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="bg-dark text-light">
        <button className="btn btn-secondary" onClick={handleClose}>
          Close
        </button>
      </ModalFooter>
    </Modal>
  );
};

export default CharacterModal;
