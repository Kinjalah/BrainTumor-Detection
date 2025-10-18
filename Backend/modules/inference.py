# modules/inference.py

import torch
import torch.nn.functional as F
from monai.networks.nets import densenet121
import numpy as np

# Define class names for clarity. Let's assume index 0 is 'No Tumor', index 1 is 'Tumor'.
CLASS_NAMES = {0: "No Tumor", 1: "Tumor"}

def load_model(device: str = "cpu") -> densenet121:
    """
    Loads the pre-trained DenseNet-121 model from MONAI.
    
    Args:
        device (str): The device to load the model onto ('cpu' or 'cuda').
        
    Returns:
        The pre-trained DenseNet-121 model.
    """
    model = densenet121(
        spatial_dims=2,         # 2D images
        in_channels=3,          # We are converting grayscale to 3 channels
        out_channels=2,         # 2 classes: 'No Tumor', 'Tumor'
        pretrained=True         # Use the ImageNet pre-trained weights
    )
    
    # Set the model to evaluation mode
    # This disables layers like Dropout which are only used during training.
    model.eval()
    
    # Move the model to the specified device (CPU or GPU)
    model.to(device)
    
    print("DenseNet-121 model loaded successfully on", device)
    return model

def predict_scan(model: densenet121, processed_slices: list, device: str = "cpu") -> tuple[str, float]:
    """
    Runs inference on a list of preprocessed slices and aggregates the results.
    
    Args:
        model (densenet121): The loaded DenseNet model.
        processed_slices (list): A list of preprocessed 2D slice tensors.
        device (str): The device the model is on ('cpu' or 'cuda').
        
    Returns:
        A tuple containing the final prediction label (str) and confidence score (float).
    """
    # Use torch.no_grad() for inference to save memory and computations
    with torch.no_grad():
        # Stack all slice tensors into a single batch tensor
        batch = torch.stack(processed_slices).to(device)
        
        # Get the model's raw output (logits)
        outputs = model(batch)
        
        # Apply the Softmax function to convert logits to probabilities
        # dim=1 applies it across the class scores for each slice
        probabilities = F.softmax(outputs, dim=1)
        
        # Get the probability for the "Tumor" class (index 1) for each slice
        tumor_probs_per_slice = probabilities[:, 1].cpu().numpy()
        
        # --- Aggregation Strategy ---
        # We'll use the mean probability across all slices as the final confidence score
        final_confidence = np.mean(tumor_probs_per_slice)
        
        # --- Decision Rule ---
        # If the average confidence is > 0.5, we classify it as "Tumor"
        threshold = 0.5
        final_prediction_index = 1 if final_confidence >= threshold else 0
        final_prediction_label = CLASS_NAMES[final_prediction_index]
        
        return final_prediction_label, float(final_confidence)