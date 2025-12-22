# modules/preprocessing.py
import numpy as np
from PIL import Image
from torchvision import transforms

def extract_slices(volume: np.ndarray, slice_fraction: float = 0.6):
    """
    Extract the middle portion of an MRI scan (to avoid noisy edges).

    Args: 
        volume (np.ndarray): 3D MRI volume (H, W, D)
        slice_fraction (float): % of middle slices to keep (default 60%)

    Returns:
        list of 2D NumPy arrays
    """
    depth = volume.shape[-1]
    start = int(depth * (1 - slice_fraction) / 2)
    end = int(depth * (1 + slice_fraction) / 2)
    slices = [volume[:, :, i] for i in range(start, end)]
    return slices


# Define preprocessing transformation for a single 2D slice
preprocess_transform = transforms.Compose([
    transforms.Resize((224, 224)),                 # Resize to DenseNet input size
    transforms.Grayscale(num_output_channels=3),   # Convert single channel to 3 channels
    transforms.ToTensor(),                         # Convert to torch.Tensor
    transforms.Normalize(mean=[0.485, 0.456, 0.406],  # ImageNet normalization
                         std=[0.229, 0.224, 0.225])
])

def preprocess_slice(slice_2d: np.ndarray):
    """
    Preprocess a 2D MRI slice for DenseNet-121.

    Args:
        slice_2d (np.ndarray): 2D MRI slice (H, W)

    Returns:
        torch.Tensor: Preprocessed slice (3, 224, 224)
    """
    # Convert NumPy array to PIL Image
    img = Image.fromarray(slice_2d).convert('L')  # ensure grayscale

    # Apply preprocessing transformations
    img_tensor = preprocess_transform(img)
    return img_tensor


def preprocess_volume(volume: np.ndarray, slice_fraction: float = 0.6):
    """
    Extract slices from a 3D volume and preprocess them for DenseNet.

    Args:
        volume (np.ndarray): 3D MRI volume (H, W, D)
        slice_fraction (float): Fraction of middle slices to extract

    Returns:
        list of torch.Tensor: Preprocessed slices
    """
    slices = extract_slices(volume, slice_fraction)
    preprocessed_slices = [preprocess_slice(s) for s in slices]
    return preprocessed_slices
