# modules/preprocessing.py
import numpy as np
from PIL import Image
from torchvision import transforms
import cv2


def normalize_intensity(slice_2d: np.ndarray):
    """
    Normalize MRI slice intensities to 0–255 using percentile clipping.
    This improves contrast and reduces outlier influence.
    """
    if np.max(slice_2d) == np.min(slice_2d):
        return np.zeros_like(slice_2d, dtype=np.uint8)

    # Clip extreme outliers to remove scanner noise
    p1, p99 = np.percentile(slice_2d, (1, 99))
    slice_2d = np.clip(slice_2d, p1, p99)

    # Normalize to 0–255 range
    slice_2d = (slice_2d - slice_2d.min()) / (slice_2d.max() - slice_2d.min() + 1e-8)
    slice_2d = (slice_2d * 255).astype(np.uint8)
    return slice_2d


def enhance_contrast(slice_2d: np.ndarray):
    """
    Apply CLAHE (adaptive histogram equalization) to improve local contrast.
    Enhances tumor boundaries for the model.
    """
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    enhanced = clahe.apply(slice_2d)
    return enhanced


def extract_slices(volume: np.ndarray, slice_fraction: float = 0.6, min_intensity_threshold: float = 10.0):
    """
    Extract central slices of the MRI volume and skip blank slices.
    
    Args:
        volume (np.ndarray): 3D MRI volume (H, W, D)
        slice_fraction (float): fraction of central slices to retain
        min_intensity_threshold (float): minimum mean intensity to keep a slice
    """
    depth = volume.shape[-1]
    start = int(depth * (1 - slice_fraction) / 2)
    end = int(depth * (1 + slice_fraction) / 2)
    selected_slices = []

    for i in range(start, end):
        s = volume[:, :, i]
        if np.mean(s) > min_intensity_threshold:
            selected_slices.append(s)

    # Fallback — if nothing passes threshold, include the middle slice
    if len(selected_slices) == 0:
        print("⚠️ All slices below intensity threshold. Using middle slice fallback.")
        selected_slices = [volume[:, :, depth // 2]]

    return selected_slices


# 🔧 Model input transform
preprocess_transform = transforms.Compose([
    transforms.Resize((224, 224)),                 # Resize to DenseNet expected input
    transforms.Grayscale(num_output_channels=3),   # Convert single channel → 3 channels
    transforms.ToTensor(),                         # Convert to torch tensor
    transforms.Normalize(mean=[0.485, 0.456, 0.406],  # ImageNet normalization
                         std=[0.229, 0.224, 0.225])
])


def preprocess_slice(slice_2d: np.ndarray):
    """
    Preprocess a single MRI slice for DenseNet-121 inference.
    Steps: normalize → enhance contrast → convert → tensorize.
    """
    # Step 1: Normalize
    slice_2d = normalize_intensity(slice_2d)

    # Step 2: Enhance local contrast
    slice_2d = enhance_contrast(slice_2d)

    # Step 3: Convert to PIL Image for torchvision
    img = Image.fromarray(slice_2d).convert("L")

    # Step 4: Apply model transform
    img_tensor = preprocess_transform(img)
    return img_tensor


def preprocess_volume(volume: np.ndarray, slice_fraction: float = 0.6, min_intensity_threshold: float = 10.0):
    """
    Extract and preprocess a set of slices from a 3D MRI volume.
    Returns a list of torch tensors ready for DenseNet inference.
    """
    # Step 1: Extract clean central slices
    slices = extract_slices(volume, slice_fraction, min_intensity_threshold)

    # Step 2: Preprocess all slices
    preprocessed_slices = [preprocess_slice(s) for s in slices if s is not None]

    # Step 3: Safety fallback (ensure non-empty tensor list)
    if len(preprocessed_slices) == 0:
        print("⚠️ preprocess_volume: No valid slices, adding fallback middle slice.")
        mid = volume.shape[-1] // 2
        preprocessed_slices = [preprocess_slice(volume[:, :, mid])]

    return preprocessed_slices
