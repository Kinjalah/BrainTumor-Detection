# modules/input_loader.py
import os
import numpy as np
import nibabel as nib
import pydicom
# load medical images (NIfTI and DICOM) into NumPy arrays
def load_nifti(file_path: str) -> np.ndarray:
    """Load a NIfTI (.nii or .nii.gz) file into a NumPy array (H, W, D)."""
    nii_img = nib.load(file_path)
    volume = nii_img.get_fdata()
    return volume.astype(np.float32)
# function to load a series of DICOM files from a directory
def load_dicom_series(folder_path: str) -> np.ndarray:
    """
    Load a series of DICOM (.dcm) slices from a folder into a 3D NumPy array.
    Assumes all slices belong to the same study/series.
    """
    slices = []
    # sort files to maintain slice order
    for fname in sorted(os.listdir(folder_path)):
        # only process .dcm files
        if fname.endswith(".dcm"):
            dcm = pydicom.dcmread(os.path.join(folder_path, fname))
            slices.append(dcm.pixel_array)
    
    volume = np.stack(slices, axis=-1)  # shape: (H, W, D)
    return volume.astype(np.float32)
# main function to load either NIfTI or DICOM based on file extension
def load_mri(file_path: str) -> np.ndarray:
    """Wrapper to handle both NIfTI and DICOM inputs."""
    # determine file type by extension
    if file_path.endswith((".nii", ".nii.gz")):
        return load_nifti(file_path)
    elif file_path.endswith(".dcm"):
        raise ValueError("For DICOM, please provide folder path containing .dcm files.")
    elif os.path.isdir(file_path):
        return load_dicom_series(file_path)
    else:
        raise ValueError("Unsupported file format. Use .nii, .nii.gz, or .dcm folder.")
