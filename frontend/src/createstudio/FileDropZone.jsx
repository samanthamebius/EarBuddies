// Code credit to https://react-dropzone.org/#!/Examples
import React from 'react';
import {useDropzone} from 'react-dropzone';
import styles from "./FileDropZone.module.css";
import photoIcon from '../assets/create_studio/photoicon.png';
import closeIcon from '../assets/create_studio/closeicon.png';

export default function FileDropZone(props) {
  const { acceptedFiles, getRootProps, getInputProps} = useDropzone({ maxFiles: 1, accept: { 'image/jpeg': [], 'image/png': []}});
  
  const acceptedFileItems = acceptedFiles.map(file => ( 
    <p className={styles.uploadedfileText}>{file.path}</p>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <div className={styles.dropBox}>
            <div style={{ display: acceptedFiles.length == 0 ? '' : 'none'}} className={styles.uploadView}>
                <input {...getInputProps()} />
                <img src={photoIcon} className={styles.photoIcon}></img>
                <p><span className={styles.focusText}>Upload a file</span> or drag and drop</p>
                <p>(Only 1 *.jpeg or *.png image will be accepted)</p>
            </div>
            <div style={{ display: acceptedFiles.length == 0 ? 'none' : ''}} className={styles.uploadedView}>
                <input {...getInputProps()} />
                <img src={photoIcon} className={styles.photoIcon}></img>
                {acceptedFileItems}
                <img src={closeIcon} className={styles.closeIcon}></img>
            </div>
        </div>
      </div> 
    </section>
  );
}