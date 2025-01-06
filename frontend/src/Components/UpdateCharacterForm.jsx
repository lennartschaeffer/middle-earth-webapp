import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Axios from "axios";
import { toast, ToastContainer } from "react-toastify";

const UpdateCharacterForm = ({
  show,
  character,
  handleClose,
  currentImage,
  onUpdate,
  homes,
  races
}) => {

  const [name, setName] = useState(character?.name);
  const [home, setHome] = useState(homes?.find((h) => h.name === character?.homeName)?.id);
  const [race, setRace] = useState(races?.find((r) => r.name === character?.raceName)?.id);
  const [imageObj, setImageObj] = useState({
    imageFile: "",
    imageSrc: "",
    imageName: "",
  });
  const [weapon, setWeapon] = useState({
    name: character?.weapon?.name,
    weaponType: character?.weapon?.weaponType,
    weaponDescription: character?.weapon?.weaponDescription,
  });
  const handleNameChange = (e) => {
    setName(e);
  };
  const handleHomeChange = (e) => {
    let homeObj = homes?.find((h) => h.name === e);
    console.log(homeObj.name);
    setHome(homeObj.id);
  };
  const handleRaceChange = (e) => {
    let raceObj = races?.find((r) => r.name === e);
    console.log(raceObj.name);
    setRace(raceObj.id);
  };

  const submit = () => {
    if (!name || !home || !race || !weapon) {
      toast("Please fill in all fields");
      console.log(name)
      console.log(homes)
      console.log(race)
      console.log(weapon)
      return;
    }

    let currentHome = homes?.find((h) => h.name === character?.homeName);
    let currentRace = races?.find((r) => r.name === character?.raceName);
    
    const formData = new FormData();
    formData.append("name", name);
    formData.append("homeId", home ?? currentHome.id);
    formData.append("raceId", race ?? currentRace.id);
    formData.append("imageName", "character");
    formData.append("imageFile", imageObj.imageFile ?? currentImage);
    formData.append("weapon.name", weapon.name);
    formData.append("weapon.weaponType", weapon.weaponType);
    formData.append("weapon.weaponDescription", weapon.weaponDescription);

    Axios.put(`https://middleearthcharacters-f0c4hbbbg9gdevf6.eastus-01.azurewebsites.net/api/Characters/${character?.id}`, formData)
      .then(function (response) {
        console.log(response.data);
        onUpdate();
      })
      .catch(function (error) {
        toast("there was an error updating your character :(")
        console.log(error);
      });
  };
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      let imgFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (x) => {
        setImageObj({
          imageFile: imgFile,
          imageSrc: x.target.result,
        });
      };
      reader.readAsDataURL(imgFile);
    }
  };
  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Update Character</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ToastContainer />
        <FloatingLabel
          controlId="name"
          label="Character Full Name"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Frodo Baggins"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </FloatingLabel>
        <Form.Select
          className="mb-3"
          onChange={(e) => handleHomeChange(e.target.value)}
        >
          <option defaultValue="none">
            {homes?.find((h) => h.name === character?.homeName)?.name}
          </option>
          {homes?.map((home, index) => (
            <option value={home.name} key={index}>
              {home.name}
            </option>
          ))}
        </Form.Select>
        <Form.Select
          className="mb-3"
          onChange={(e) => handleRaceChange(e.target.value)}
        >
          <option defaultValue="none">
            {races?.find((r) => r.name === character?.raceName)?.name}
          </option>
          {races?.map((race, index) => (
            <option value={race.name} key={index}>
              {race.name}
            </option>
          ))}
        </Form.Select>
        <FloatingLabel
          controlId="weaponName"
          label="Character Weapon Name"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Weapon Name..."
            onChange={(e) => setWeapon({ ...weapon, name: e.target.value })}
            value={weapon.name}
          />
        </FloatingLabel>
        <FloatingLabel
          controlId="weaponType"
          label="Character Weapon Type"
          className="mb-3"
        >
          <Form.Control
            type="text"
            placeholder="Weapon Type..."
            onChange={(e) =>
              setWeapon({ ...weapon, weaponType: e.target.value })
            }
            value={weapon.weaponType}
          />
        </FloatingLabel>
        <Form.Label>Weapon Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          className="mb-3"
          onChange={(e) =>
            setWeapon({ ...weapon, weaponDescription: e.target.value })
          }
          value={weapon.weaponDescription}
        />
        <div>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            onChange={(e) => handleImageChange(e)}
          />
          <img src={imageObj.imageSrc} className="img-fluid" />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={submit}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateCharacterForm;
