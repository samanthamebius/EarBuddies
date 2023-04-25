import React, { useEffect, useState, useRef } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from './CreateStudioDialog.module.css';
import FileDropZone from "./FileDropZone";
import ControlSwitch from "./ControlSwitch";
import SearchBar from "../shared/SearchBar";
import SelectedGenreTag from "./SelectedGenreTag";
import UnselectedGenreTag from "./UnselectedGenreTag";
import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import axios from 'axios';

function useStudioPost() {
  const [studio, setStudio] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postStudio = async (name, genres = [], coverPhoto = '', listeners = [], isHostOnly = true) => {
    const host = JSON.parse(localStorage.getItem("current_user_id"));
    listeners.push(host);
    listeners.push("31dmqvyr4rgviwxt7ovzqfctkzzy")
    setLoading(true);

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const url = `${BASE_URL}/api/studio/new`;

    try {
      const response = await axios.post(url, {
        name,
        listeners,
        host,
        genres,
        coverPhoto,
        isHostOnly
      });

      setStudio(response.data);
      setLoading(false);
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  return { studio, isLoading, error, postStudio };
}

function SwitchWithTooltip() {
  const ToolTip = styled(({ className, ...props }) => (
      <Tooltip {...props} classes={{ popper: className }} />
    ))(({ theme }) => ({
      [`& .${tooltipClasses.arrow}`]: {
        color: theme.palette.common.white,
      },
      [`& .${tooltipClasses.tooltip}`]: {
        backgroundColor: theme.palette.common.white,
        color: 'rgba(0, 0, 0, 0.87)',
        boxShadow: theme.shadows[1],
        fontSize: 14,
        color: '#666666',
        maxWidth: '70%'
      },
    })); 
  
  const [switchOn, setSwitchOn] = useState(false);

  const title = switchOn
    ? 'Only you can queue, skip, and pause songs.'
    : 'Other users can queue, skip, and pause songs.';

  return (
    <ToolTip title={title} placement="right-end" arrow>
      <div className={styles.switchContainer}>
        <ControlSwitch checked={switchOn} onChange={() => setSwitchOn(!switchOn)} />
      </div>
    </ToolTip>
  );
}

export default function CreateStudioDialog({ isDialogOpened, handleCloseDialog }) {
  const { studio, isLoading, error, postStudio } = useStudioPost();
  const [isStudioNameErrorMessage, setIsStudioNameErrorMessage] = useState(false); 
  const [isGenreInputErrorMessage, setIsGenreInputErrorMessage] = useState(false); 
  const [genreInput, setGenreInput] = useState(''); 
  const [studioNameInput, setStudioNameInput] = useState('');  
  const [genres, setGenres] = useState([{name: "Rap", isSelected: false}, 
                                          {name: "Rock", isSelected: false},
                                          {name: "K-Pop", isSelected: false}, 
                                          {name: "Country", isSelected: false},
                                          {name: "Classical", isSelected: false}, 
                                          {name: "R&B", isSelected: false},
                                          {name: "Jazz", isSelected: false}, 
                                          {name: "Pop", isSelected: false}]);

  function toggleGenre(genre) {
    const newGenres = genres.map((obj, i) => {
      if(obj.name === genre) {
        return {... obj, isSelected: !obj.isSelected};
      }
      return obj
    });
    setGenres(newGenres);
  }

  function addGenre(genreInput) {
    const isFound = genres.some(obj => {
      if (obj.name.toLowerCase() === genreInput.toLowerCase()) {
        return true;
      }
    });
  
    if(isFound){
      setIsGenreInputErrorMessage(true);
    } else {
      setIsGenreInputErrorMessage(false);
      setGenres([... genres, {name: genreInput, isSelected: true}]);
      setGenreInput('');
    }
  }
  
  function handleSubmit() {
    if(studioNameInput == '') {
      setIsStudioNameErrorMessage(true);
    } else {
      console.log("CreateStudioDialog: handleSubmit: 102: studioNameInput: ", studioNameInput);
      setIsStudioNameErrorMessage(false);
      postStudio(studioNameInput);
    }
  }
  
  const handleClose = () => { handleCloseDialog(false) };

  function handleKeyPress(event, genreInput) {
    if(event.key == "Enter") {
      addGenre(genreInput);
    }
  }

  return (
    <div>
      <Dialog fullWidth maxWidth="md" open={isDialogOpened} onClose={handleClose} PaperProps={{ style: { backgroundColor: '#F5F5F5',},}}>
        <h1 className={styles.heading}>Create Studio</h1>
        <DialogContent>
            <h2 className={styles.sectionHeading}>Studio Name<span className={styles.focusText}>*</span></h2>
            <TextField 
                value={studioNameInput}
                error={isStudioNameErrorMessage ? true : false}
                helperText={isStudioNameErrorMessage ? "No Studio Name Entry" : ""}
                required
                margin="dense"
                id="name"
                label="Enter a Studio Name ..."
                type="text"
                fullWidth
                variant="outlined"
                onChange={event => setStudioNameInput(event.target.value)}
                className={styles.textfield}
                autoComplete="off"
            />
            
            <h2 className={styles.sectionHeading}>Cover Photo</h2>
            <FileDropZone />
            
            <h2 className={styles.sectionHeading}>Genres</h2>
            {genres.map((genre, i) => genre.isSelected == false ? <UnselectedGenreTag key={i} genre={genre.name} handleClick={() => toggleGenre(genre.name)}/> 
                                                                : <SelectedGenreTag key={i} genre={genre.name} handleClick={() => toggleGenre(genre.name)}/>)}
            <div className={styles.addGenreSection}>
              <TextField 
                  margin="dense"
                  id="name"
                  label="Add your own genres ..."
                  type="text"
                  fullWidth
                  variant="outlined"
                  value={genreInput}
                  onChange={event => setGenreInput(event.target.value)}
                  className={styles.textfield}
                  autoComplete="off"
                  onKeyDown={event => handleKeyPress(event, genreInput)} 
                  error={isGenreInputErrorMessage ? true : false}
                  helperText={isGenreInputErrorMessage ? "Input is already a genre option" : ""}
              />
              <span className={styles.spacing}></span>
              <Button sx={{ fontWeight: 600 }} variant="contained" onClick={() => addGenre(genreInput)}>Add</Button>              
            </div>

            <div className={styles.controlSection}>
                <h2 className={styles.sectionHeading}>Only I Have Control</h2>
                <SwitchWithTooltip />
            </div>
            
            <h2 className={styles.sectionHeading}>Add Listeners</h2>
            <SearchBar label={"Search using Spotify username ..."}/>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }} className={styles.buttons}>
          <Button sx={{ fontWeight: 600, color: '#757575' }} variant="contained" className={styles.cancelButton} onClick={handleClose}>Cancel</Button>
          <Button sx={{ fontWeight: 600 }} variant="contained" className={styles.createButton} onClick={handleSubmit}>Create Studio</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}