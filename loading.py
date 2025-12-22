import nibabel as nib

# Load .nii file
img = nib.load("BraTS20_Training_001_seg (1).nii")   # replace with your file path
data = img.get_fdata()

print("Image shape:", data.shape)   # e.g., (256, 256, 150)
