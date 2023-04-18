import React, {useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import styles from "./ImagePreview.module.css";


export default function ImagePreview(props) {
    const [files, setFiles] = useState([]);
    const {getRootProps, getInputProps} = useDropzone({
        accept: {
        'image/*': []
        },
        onDrop: acceptedFiles => {
        setFiles(acceptedFiles.map(file => Object.assign(file, {
            preview: URL.createObjectURL(file)
        })));
        }
    });
    
    const thumbs = files.map(file => (
        <div className={styles.thumb} key={file.name}>
            <div className={styles.thumbInner}>
                <img
                src={file.preview}
                className={styles.thumbImg}
                // Revoke data uri after image is loaded
                onLoad={() => { URL.revokeObjectURL(file.preview) }}
                />
            </div>
        </div>
    ));

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        return () => files.forEach(file => URL.revokeObjectURL(file.preview));
    }, []);

    return (
        {thumbs}
    );
}