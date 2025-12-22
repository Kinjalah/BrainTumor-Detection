import os
from modules.input_loader import load_mri
from modules.preprocessing import extract_slices, preprocess_slice, preprocess_volume

# Path to MRI file 
file_path = os.path.join("data", "3dsampleimg.nii")

# Load 3D MRI scan
volume = load_mri(file_path)
print("3D volume shape:", volume.shape)

# -----------------------------
# Test slice extraction
# -----------------------------
slices = extract_slices(volume)
print("Extracted slices:", len(slices))
print("One slice shape (before preprocessing):", slices[0].shape)

# -----------------------------
# Test preprocessing of a single slice
# -----------------------------
preprocessed_slice = preprocess_slice(slices[0])
print("Preprocessed slice shape (3 channels, 224x224):", preprocessed_slice.shape)

# -----------------------------
# Test preprocessing of entire volume
# -----------------------------
preprocessed_slices = preprocess_volume(volume)
print("Number of preprocessed slices:", len(preprocessed_slices))
print("Shape of first preprocessed slice:", preprocessed_slices[0].shape)
