import Axios from "axios";
import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import "./Character.css";
import UpdateCharacterForm from "./UpdateCharacterForm";

const CharacterCard = ({ character, race, onDelete, openModal, refresh, onUpdate, homes, races }) => {
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const openUpdateForm = () => setShowUpdateForm(true);
  const closeUpdateForm = () => setShowUpdateForm(false);
  const deleteCharacter = () => {
    Axios.delete(`https://middleearthcharacters-f0c4hbbbg9gdevf6.eastus-01.azurewebsites.net/api/Characters/${character?.id}`)
      .then((res) => {
        console.log("deleted character with id " + character?.id);
        onDelete();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div
      className="card p-0 text-dark w-100"
      style={{ backgroundColor: `${race?.backgroundColour}` }}
    >
      <div className="card-header ">
        <div className="card-title characterTitle">
          <b>{character?.name}</b>
        </div>
        <div className="card-subtitle text-secondary">
          {race?.name}, {character?.homeName}
        </div>
      </div>
      <div className="card-body bg-gradient d-flex flex-column justify-content-start align-items-center">
        <img
          src={character?.imageSrc}
          alt="image"
          className="img-fluid rounded-2"
          style={{ width: 200, height: 200 }}
        />
        <div className="card-text p-3 text-center weaponDesciption text-sm-center">
          <b>
            {character?.weapon.name} ({character?.weapon.weaponType})
          </b>
          <br />
          <span style={{ fontSize: 12 }}>
            {character?.weapon.weaponDescription}
          </span>
        </div>
      </div>
      <div className="card-footer d-flex justify-content-end gap-2">
        <button className="btn btn-sm btn-dark" onClick={openModal}> <FaBook/></button>
        <button
          onClick={openUpdateForm}
          className="btn btn-sm btn-outline-primary"
        >
          <MdEdit />
        </button>
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={deleteCharacter}
        >
          <FaTrashAlt />
        </button>
      </div>
      <UpdateCharacterForm
        show={showUpdateForm}
        character={character}
        handleClose={closeUpdateForm}
        currentImage={character?.imageName}
        onUpdate={onUpdate}
        homes={homes}
        races={races}
      />
    </div>
  );
};

export default CharacterCard;
