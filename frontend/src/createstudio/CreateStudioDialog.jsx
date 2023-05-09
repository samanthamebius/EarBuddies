import { TextField, Button, Dialog, DialogActions, DialogContent, Tooltip, List } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styles from './CreateStudioDialog.module.css';
import React, { useState } from "react";
import FileDropZone from "./FileDropZone";
import ControlSwitch from "./ControlSwitch";
import AddListenersBlock from "../shared/AddListenersBlock";
import SelectedGenreTag from "./SelectedGenreTag";
import UnselectedGenreTag from "./UnselectedGenreTag";
import { styled } from '@mui/material/styles';
import { tooltipClasses } from '@mui/material/Tooltip';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function useStudioPost() {
  const postStudio = async (
    navigate,
    name,
    genres,
    coverPhoto,
    listeners,
    isHostOnly
  ) => {
    const host = JSON.parse(localStorage.getItem("current_user_id"));
    listeners.push(host);
    console.log(listeners)
    //add dummy listener pending search bar completion
    // listeners.push("31dmqvyr4rgviwxt7ovzqfctkzzy")

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const url = `${BASE_URL}/api/studio`;
    let studioBannerImageUrl = "/images/defaultBanner.png";

    if (coverPhoto) {
      // upload the image
      const imgUploadConfig = {
        headers: {
          "content-type": "multipart/form-data",
        },
      };
      const imgFormData = new FormData();
      imgFormData.append("image", coverPhoto[0]);

      const imgUploadResponse = await axios.post(
        `${url}/upload-image`,
        imgFormData,
        imgUploadConfig
      );

      studioBannerImageUrl = imgUploadResponse.headers["location"];
    }

    try {
      const response = await axios.post(`${url}/new`, {
        name,
        listeners,
        host,
        genres,
        studioBannerImageUrl,
        isHostOnly,
      });
      navigate(`/studio/${response.data._id}`);
    } catch (err) {
      const navigate = useNavigate();
      navigate("/500");
    }
  };

  return { postStudio };
}

function SwitchWithTooltip({ checked, onChange }) {
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

  const title = checked
    ? 'Only you can queue, skip, and pause songs.'
    : 'Other users can queue, skip, and pause songs.';

  return (
    <ToolTip title={title} placement="right-end" arrow>
      <div className={styles.switchContainer}>
        <ControlSwitch checked={checked} onChange={(e) => onChange(e.target.checked)} />
      </div>
    </ToolTip>
  );
}

export default function CreateStudioDialog({ isDialogOpened, handleCloseDialog }) {
  const navigate = useNavigate();
  const { postStudio } = useStudioPost();
  const [isStudioNameErrorMessage, setIsStudioNameErrorMessage] = useState(false);
  const [isGenreInputErrorMessage, setIsGenreInputErrorMessage] = useState(false);
  const [isHostOnly, setIsHostOnly] = useState(false);
  const [genreInput, setGenreInput] = useState('');
  const [studioNameInput, setStudioNameInput] = useState('');
  const [genres, setGenres] = useState([
    { name: "Rap", isSelected: false },
    { name: "Rock", isSelected: false },
    { name: "K-Pop", isSelected: false },
    { name: "Country", isSelected: false },
    { name: "Classical", isSelected: false },
    { name: "R&B", isSelected: false },
    { name: "Jazz", isSelected: false },
    { name: "Pop", isSelected: false }
  ]);
  const [file, setFile] = useState(null);

  const handleFileChange = (selectedFile) => { setFile(selectedFile); };

  const handleSwitchToggle = (isChecked) => { setIsHostOnly(isChecked); };

  function toggleGenre(genre) {
    const newGenres = genres.map((obj, i) => {
      if (obj.name === genre) {
        return { ...obj, isSelected: !obj.isSelected };
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

    if (isFound) {
      setIsGenreInputErrorMessage(true);
    } else {
      setIsGenreInputErrorMessage(false);
      setGenres([...genres, { name: genreInput, isSelected: true }]);
      setGenreInput('');
    }
  }

  function handleSubmit() {
    if (studioNameInput == '') {
      setIsStudioNameErrorMessage(true);
    } else {
      setIsStudioNameErrorMessage(false);
      const selecetedGenres = getSelectedGenres();
      postStudio(navigate, studioNameInput, selecetedGenres, file, [], isHostOnly);
    }
  }

  function getSelectedGenres() {
    const selectedGenres = genres.filter(obj => obj.isSelected);
    const selectedGenreNames = selectedGenres.map(obj => obj.name);
    return selectedGenreNames;
  }

  const handleClose = () => { handleCloseDialog(false) };

  function handleKeyPress(event, genreInput) {
    if (event.key == "Enter") {
      addGenre(genreInput);
    }
  }

  const theme = createTheme({
    palette: {
      secondary: {
        main: '#CA3FF3',
      },
    },
  });

  return (
    <div>
      <Dialog fullWidth maxWidth="md" open={isDialogOpened} onClose={handleClose} PaperProps={{ style: { backgroundColor: '#F5F5F5', }, }}>
        <h1 className={styles.heading}>Create Studio</h1>
        <DialogContent>
          {/* Studio name */}
          <h2 className={styles.sectionHeading}>Studio Name<span className={styles.focusText}>*</span></h2>
          <ThemeProvider theme={theme}>
            <TextField
              color="secondary"
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
              autoComplete="off" />
          </ThemeProvider>

          {/* Cover photo */}
          <h2 className={styles.sectionHeading}>Cover Photo</h2>
          <FileDropZone onFileChange={handleFileChange} />
          <h2 className={styles.sectionHeading}>Genres</h2>
          {genres.map((genre, i) => genre.isSelected == false ? <UnselectedGenreTag key={i} genre={genre.name} handleClick={() => toggleGenre(genre.name)} />
            : <SelectedGenreTag key={i} genre={genre.name} handleClick={() => toggleGenre(genre.name)} />)}
          <div className={styles.addGenreSection}>
            <ThemeProvider theme={theme}>
              <TextField
                color="secondary"
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
                helperText={isGenreInputErrorMessage ? "Input is already a genre option" : ""} />
            </ThemeProvider>
            <span className={styles.spacing}></span>
            <Button sx={{ fontWeight: 600 }} variant="contained" onClick={() => addGenre(genreInput)}>Add</Button>
          </div>

          {/* Control Setting */}
          <div className={styles.controlSection}>
            <h2 className={styles.sectionHeading}>Only I Have Control</h2>
            <SwitchWithTooltip checked={isHostOnly} onChange={handleSwitchToggle} />
          </div>
          
          <AddListenersBlock />
          
        </DialogContent>
        <DialogActions sx={{ display: 'flex', justifyContent: 'center', mb: 1.5 }} className={styles.buttons}>
          <Button sx={{ fontWeight: 600, color: '#757575' }} variant="contained" className={styles.cancelButton} onClick={handleClose}>Cancel</Button>
          <Button sx={{ fontWeight: 600 }} variant="contained" className={styles.createButton} onClick={handleSubmit}>Create Studio</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
