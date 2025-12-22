import nibabel as nib
import matplotlib.pyplot as plt

# Load .nii
nii_img = nib.load("BraTS20_Training_001_seg .nii")
data = nii_img.get_fdata()

# Pick a middle slice in the Z axis
z_slice = data[:, :, data.shape[2] // 2]

plt.imshow(z_slice.T, cmap="gray", origin="lower")
plt.title("Middle Brain Slice (Axial View)")
plt.axis("off")
plt.show()
