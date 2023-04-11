// Code credit to https://react-dropzone.org/#!/Examples
import React from 'react';
import {useDropzone} from 'react-dropzone';
import styles from "./FileDropZone.module.css";

export default function FileDropZone(props) {
  const {
    acceptedFiles,
    fileRejections,
    getRootProps,
    getInputProps
  } = useDropzone({
    maxFiles: 1,
    accept: {
      'image/jpeg': [],
      'image/png': []
    }
  });

  const acceptedFileItems = acceptedFiles.map(file => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
      <ul>
        {errors.map(e => (
          <li key={e.code}>{e.message}</li>
        ))}
      </ul>
    </li>
  ));

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <div className={styles.dropBox}>
            <input {...getInputProps()} />
            <p><span className={styles.focusText}>Upload a file</span> or drag and drop</p>
            <p>(Only 1 *.jpeg or *.png image will be accepted)</p>
            <p>{acceptedFileItems}</p>
        </div>
      </div>
      {/* <aside>
        <h4>Accepted files</h4>
        
        <h4>Rejected files</h4>
        <ul>{fileRejectionItems}</ul>
      </aside> */}
    </section>
  );
}