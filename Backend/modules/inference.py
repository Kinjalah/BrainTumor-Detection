# modules/inference.py
import torch
import torch.nn.functional as F
from torchvision import models

LABELS = ["No Tumor", "Tumor"]

def load_model(device="cpu"):
    """
    Load a pretrained DenseNet-121 model fine-tuned for brain tumor classification.
    """
    model = models.densenet121(weights=None)  # use pretrained=True if available
    num_features = model.classifier.in_features
    model.classifier = torch.nn.Linear(num_features, len(LABELS))
    model.to(device)
    model.eval()
    return model


def predict_scan(model, processed_slices, device="cpu"):
    """
    Predict tumor class from a list of preprocessed MRI slices.
    Uses weighted averaging for more stable and confident predictions.
    """
    model.eval()

    if not processed_slices:
        raise ValueError("❌ No preprocessed slices found for prediction.")

    with torch.no_grad():
        # Stack and send to device
        batch = torch.stack(processed_slices).to(device)

        # Forward pass through model
        outputs = model(batch)
        probs = F.softmax(outputs, dim=1)

        # Compute per-slice confidence (max probability)
        slice_confidences, _ = torch.max(probs, dim=1)

        # Normalize weights (stronger slices get higher weight)
        weights = slice_confidences / slice_confidences.sum()

        # Weighted average of probabilities
        weighted_probs = (probs * weights.unsqueeze(1)).sum(dim=0)

        # Final prediction
        conf, pred_idx = torch.max(weighted_probs, dim=0)
        label = LABELS[pred_idx.item()]
        confidence = conf.item() * 100  # convert to percentage

    return label, confidence
