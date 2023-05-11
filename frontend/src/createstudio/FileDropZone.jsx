// Code credit to https://react-dropzone.org/#!/Examples
import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styles from './FileDropZone.module.css';
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';

export default function FileDropZone(props) {
    const [files, setFiles] = useState([]);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: { 'image/jpeg': [], 'image/png': [] },
        onDrop: (acceptedFiles) => {
            setFiles(
                acceptedFiles.map((file) =>
                    Object.assign(file, {
                        preview: URL.createObjectURL(file),
                    })
                )
            );
            props.onFileChange(acceptedFiles);
        },
    });

    const thumbs = files.map((file) => (
        <div key={file.name}>
            <div>
                <img
                    className={styles.previewImg}
                    src={file.preview}
                    onLoad={() => {
                        URL.revokeObjectURL(file.preview);
                    }}
                />
            </div>
        </div>
    ));

    useEffect(() => {
        return () => files.forEach((file) => URL.revokeObjectURL(file.preview));
    }, []);

    const acceptedFileItems = acceptedFiles.map((file) => (
        <p className={styles.uploadedfileText}>{file.path}</p>
    ));

    return (
        <section className='container'>
            <div {...getRootProps({ className: 'dropzone' })}>
                <div className={styles.dropBox}>
                    <div
                        style={{ display: acceptedFiles.length == 0 ? '' : 'none' }}
                        className={styles.uploadView}>
                        <input {...getInputProps()} />
                        <ImageRoundedIcon
                            className={styles.photoIcon}
                            color='disabled'
                        />
                        <p style={{ color: 'var(--headingColor)' }}>
                            <span className={styles.focusText}>Upload a file</span> or
                            drag and drop
                        </p>
                        <p style={{ margin: '0px', color: 'var(--headingColor)' }}>
                            (Only 1 *.jpeg or *.png image will be accepted)
                        </p>
                    </div>
                    <div
                        style={{ display: acceptedFiles.length == 0 ? 'none' : '' }}
                        className={styles.uploadedView}>
                        <input {...getInputProps()} />
                        {thumbs}
                        {acceptedFileItems}
                        <ClearRoundedIcon
                            className={styles.closeIcon}
                            style={{ color: 'var(--iconColor)' }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
