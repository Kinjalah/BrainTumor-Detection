import nibabel as nib
import numpy as np
import plotly.graph_objects as go

# Load the .nii file (update the filename with your actual .nii path)
nii_img = nib.load("BraTS20_Training_001_seg .nii")
data = nii_img.get_fdata()

# Get coordinates of non-zero voxels
x, y, z = np.nonzero(data)

# Get intensity values at those coordinates
intensity = data[x, y, z]

# Normalize intensity (for colorscale)
intensity = (intensity - intensity.min()) / (intensity.max() - intensity.min())

# Create 3D scatter plot
fig = go.Figure(data=go.Scatter3d(
    x=x, y=y, z=z,
    mode='markers',
    marker=dict(
        size=2,
        color=intensity,
        colorscale='Viridis',
        opacity=0.1
    )
))

fig.update_layout(
    title="3D MRI Visualization (.nii)",
    scene=dict(
        xaxis_title='X',
        yaxis_title='Y',
        zaxis_title='Z'
    )
)

fig.show()
