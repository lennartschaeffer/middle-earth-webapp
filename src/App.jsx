import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import Axios from "axios";
import CharacterCard from "./Components/CharacterCard";
import AddCharacterForm from "./Components/AddCharacterForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AddLocationForm from "./Components/AddLocationForm";
import AddRaceForm from "./Components/AddRaceForm";
import Dropdown from "react-bootstrap/Dropdown";
import CharacterModal from "./Components/CharacterModal";


function App() {
  const [characters, setCharacters] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [refreshAddForm, setRefreshAddForm] = useState(0);
  const [races, setRaces] = useState([]);
  const [locations, setLocations] = useState([]);
  const [pageCharacters, setPageCharacters] = useState([]);
  const [pageDisplay, setPageDisplay] = useState();
  const [currentPageName, setCurrentPageName] = useState("All Characters");
  const [showAllCharacters, setShowAllCharacters] = useState(true);
  const [isLoading, setIsLoading] = useState();
  const [modalCharacter, setModalCharacter] = useState();
  const [modalRace, setModalRace] = useState();

  const onDelete = () => {
    toast("Deleted Character!");
    setRefresh(refresh + 1);
  };
  const onRefreshPage = (message) => {
    toast(`${message}`);
    setRefresh(refresh + 1);
  };
  const onAddRace = () => {
    toast("Added Race");
    setRefreshAddForm(refreshAddForm + 1);
  };
  const onAddLocation = () => {
    toast("Added Location");
    setRefreshAddForm(refreshAddForm + 1);
  };
  const pageChanged = (filteredCharacters, name) => {
    setPageCharacters(filteredCharacters);
    setCurrentPageName(name);
    setShowAllCharacters(false);
  };
  const handleAllCharacters = () => {
    setCurrentPageName("All Characters");
    setShowAllCharacters(true);
  };
  useEffect(() => {
    console.log(pageCharacters)
    setPageDisplay(
      pageCharacters?.map((character, index) => (
        <div
          className="col-lg-3 col-sm-4 d-flex justify-content-center"
          key={index}
        >
          <CharacterCard
            character={character}
            race={races.find((r) => r.name === character.raceName)}
            onDelete={onDelete}
            openModal={() =>
              handleCharacterShow(
                character,
                races.find((r) => r.name === character.raceName)
              )
            }
            refresh={refreshAddForm}
            onUpdate={() => onRefreshPage("Character Updated")}
            homes={locations}
            races={races}
            style={{ cursor: "pointer" }}
          />
        </div>
      ))
    );
  }, [pageCharacters]);

  useEffect(() => {
    setIsLoading(true);
    Axios.get("https://middleearthcharacters-f0c4hbbbg9gdevf6.eastus-01.azurewebsites.net/api/Characters")
      .then((res) => {
        console.log(res.data);
        setCharacters(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
    //get races so that we can pass the background colour
    Axios.get("https://middleearthcharacters-f0c4hbbbg9gdevf6.eastus-01.azurewebsites.net/api/Race")
      .then((res) => {
        setRaces(res.data);
        console.log(res.data);
      })
      .catch((err) => {
        toast("there was an error getting the races");
        console.log(err);
      });
    Axios.get("https://middleearthcharacters-f0c4hbbbg9gdevf6.eastus-01.azurewebsites.net/api/Home")
      .then((res) => {
        setLocations(res.data);
      })
      .catch((err) => {
        toast("there was an error getting the locations");
        console.log(err);
      });
  }, [refresh]);

  const [show, setShow] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showRaceModal, setShowRaceModal] = useState(false);
  const [showCharacterModal, setShowCharacterModal] = useState(false);

  const handleCharacterShow = (character, race) => {
    console.log("show " + character.name);
    setModalCharacter(character);
    setModalRace(race);
    setShowCharacterModal(true);
  };
  const handleCharacterClose = () => {
    console.log("close character modal");
    setShowCharacterModal(false);
  };

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleLocationShow = () => setShowLocationModal(true);
  const handleLocationClose = () => setShowLocationModal(false);
  const handleRaceShow = () => setShowRaceModal(true);
  const handleRaceClose = () => setShowRaceModal(false);
  return (
    <div className="min-vh-100 vw-100 d-flex flex-column align-items-center">
      <br />
      <ToastContainer />
      <div className="row w-100 h-100 p-5 g-2">
        <div className="col-lg-4 col-md-4 col-12">
          <button
            className="btn btn-dark w-100 h-100 border-primary-subtle"
            onClick={handleShow}
          >
            <b>Add Character</b>
          </button>
        </div>
        <div className="col-lg-4 col-md-4 col-6">
          <button
            className="btn btn-dark  w-100 h-100 border-primary-subtle"
            onClick={handleLocationShow}
          >
            <b>Add Location</b>
          </button>
        </div>
        <div className="col-lg-4 col-md-4 col-6">
          <button
            className="btn btn-dark w-100 h-100 border-primary-subtle"
            onClick={handleRaceShow}
          >
            <b>Add Race</b>
          </button>
        </div>
        <div className="col-lg-4 col-12">
          <button
            className="btn btn-dark  w-100 h-100 border-primary-subtle"
            onClick={handleAllCharacters}
          >
            <b>All Characters</b>
          </button>
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          <Dropdown className="h-100">
            <Dropdown.Toggle
              variant="dark"
              id="dropdown-basic"
              className="btn w-100 h-100 border-primary-subtle"
            >
              <b>Characters By Race</b>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {races?.map((race, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => pageChanged(race?.characters, race?.name)}
                >
                  {race?.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div className="col-lg-4 col-md-6 col-12">
          <Dropdown className="h-100">
            <Dropdown.Toggle
              variant="dark"
              id="dropdown-basic"
              className="btn w-100 h-100 border-primary-subtle"
            >
              <b>Characters By Location</b>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {locations?.map((location, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() =>
                    pageChanged(location?.characters, location?.name)
                  }
                >
                  {location?.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <h1 className="text-light fst-italic">{currentPageName}</h1>
      <div className="row w-100 mt-5 g-2 p-5">
        {isLoading ? (
          <h6 className="text-center text-light">Loading...</h6>
        ) : showAllCharacters ? (
          characters.map((character, index) => (
            <div
              className="col-lg-3 col-sm-6 d-flex justify-content-center"
              key={index}
            >
              <CharacterCard
                character={character}
                race={races.find((r) => r.name === character.raceName)}
                onDelete={onDelete}
                openModal={() =>
                  handleCharacterShow(
                    character,
                    races.find((r) => r.name === character.raceName)
                  )
                }
                refresh={refreshAddForm}
                onUpdate={() => onRefreshPage("Character Updated")}
                style={{ cursor: "pointer" }}
              />
            </div>
          ))
        ) : (
          <div className="row w-100 mt-5">{pageDisplay}</div>
        )}
      </div>
      <CharacterModal
        show={showCharacterModal}
        character={modalCharacter}
        race={modalRace}
        handleClose={handleCharacterClose}
        refresh={() => onRefreshPage("removed character biography")}
      />
      <AddCharacterForm
        show={show}
        handleClose={handleClose}
        onAdd={() => onRefreshPage("Added Character")}
        refresh={refreshAddForm}
        homes={locations}
        races={races}
      />
      <AddLocationForm
        show={showLocationModal}
        handleClose={handleLocationClose}
        onAdd={onAddLocation}
      />
      <AddRaceForm
        show={showRaceModal}
        handleClose={handleRaceClose}
        onAdd={onAddRace}
      />
    </div>
  );
}

export default App;
