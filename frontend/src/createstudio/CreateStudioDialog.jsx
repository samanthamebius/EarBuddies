import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import styles from './CreateStudioDialog.module.css';
import FileDropZone from "./FileDropZone";
import ControlSwitch from "./ControlSwitch";
import Tooltip from '@mui/material/Tooltip';
import SearchBar from "../shared/SearchBar";
import SelectedGenreTag from "./SelectedGenreTag";
import UnselectedGenreTag from "./UnselectedGenreTag";

export default function CreateStudioDialog({ isDialogOpened, handleCloseDialog }) {
  const [genreInput, setGenreInput] = useState('');  
  const [genres, setGenres] = useState([{name: "Rap", isSelected: false}, 
                                          {name: "Rock", isSelected: false},
                                          {name: "K-Pop", isSelected: false}, 
                                          {name: "Country", isSelected: false},
                                          {name: "Classical", isSelected: false}, 
                                          {name: "R&B", isSelected: false},
                                          {name: "Jazz", isSelected: false}, 
                                          {name: "Pop", isSelected: false}]);
    console.log(genres);
    genres.sort();

    function selectGenre(genre) {
      const newGenres = genres.map(obj => {
        if(obj.name === genre) {
          return {... obj, isSelected: true};
        }
        return obj
      });
      setGenres(newGenres);
    }

    function unselectGenre(genre) {
      const newGenres = genres.map(obj => {
        if(obj.name === genre) {
          return {... obj, isSelected: false};
        }
        return obj
      });
      setGenres(newGenres);
    }

    function addGenre(genre) {
      setGenres(... genres, {name: genre, isSelected: true});
      setGenreInput('');
    }
    
    const handleClose = () => { handleCloseDialog(false) };

    return (
    <div>
      <Dialog fullWidth maxWidth="md" open={isDialogOpened} onClose={handleClose} PaperProps={{ style: { backgroundColor: '#F5F5F5',},}}>
        <h1 className={styles.heading}>Create Studio</h1>
        <DialogContent>
            <h2 className={styles.sectionHeading}>Studio Name<span className={styles.focusText}>*</span></h2>
            <TextField 
                required
                margin="dense"
                id="name"
                label="Studio Name"
                type="text"
                fullWidth
                variant="outlined"
                className={styles.textfield}
            />
            
            <h2 className={styles.sectionHeading}>Cover Photo</h2>
            <FileDropZone />
            
            <h2 className={styles.sectionHeading}>Genres</h2>
            {genres.map((genre, i) => genre.isSelected == false ? <UnselectedGenreTag genre={genre.name} handleClick={() => selectGenre(genre.name)}/> : <SelectedGenreTag genre={genre.name} handleClick={() => unselectGenre(genre.name)}/>)}
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
              />
              <span className={styles.spacing}></span>
              <Button variant="contained" className={styles.addButton} onClick={() => addGenre(genreInput)}>Add</Button>              
            </div>

            <div className={styles.controlSection}>
                <h2 className={styles.sectionHeading}>Only I Have Control</h2>
                <Tooltip title="Only you will be able to queue, skip and pause songs." placement="right" arrow>
                    <div className={styles.switchContainer}>
                        <ControlSwitch/>
                    </div>
                </Tooltip>
            </div>
            
            <h2 className={styles.sectionHeading}>Add Listeners</h2>
            <SearchBar label={"Search using Spotify username ..."}/>
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }} className={styles.buttons}>
          <Button variant="contained" sx={{ color: '#606060'}} className={styles.cancelButton}onClick={handleClose}>Cancel</Button>
          <Button variant="contained" className={styles.createButton} onClick={handleClose}>Create Studio</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}