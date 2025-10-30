import torch
import numpy as np
import cv2  


def generate_gradcam(model, input_tensor, target_class=1):
    """
    Generate Grad-CAM heatmap for MONAI DenseNet-121.
    """
    model.eval()
    gradients = []
    activations = []

    # In MONAI DenseNet121, the last DenseBlock is at index -2 in model.features
    last_conv_layer = model.features[-2]

    def forward_hook(module, input, output):
        activations.append(output.detach())  # ✅ detach here

    def backward_hook(module, grad_input, grad_output):
        gradients.append(grad_output[0].detach())  # ✅ detach here

    # Register hooks
    last_conv_layer.register_forward_hook(forward_hook)
    last_conv_layer.register_backward_hook(backward_hook)

    # Forward pass
    output = model(input_tensor)
    class_score = output[0, target_class]

    # Backward pass
    model.zero_grad()
    class_score.backward()

    # Extract activations and gradients
    grads = gradients[0].cpu().numpy()[0]
    acts = activations[0].cpu().numpy()[0]

    # Global-average-pool gradients → weights
    weights = np.mean(grads, axis=(1, 2))
    cam = np.zeros(acts.shape[1:], dtype=np.float32)

    for i, w in enumerate(weights):
        cam += w * acts[i, :, :]

    # ReLU and normalize
    cam = np.maximum(cam, 0)
    cam = cv2.resize(cam, (224, 224))
    cam = cam / (cam.max() + 1e-8)
    return cam


def overlay_heatmap_on_slice(slice_2d, heatmap, alpha=0.4):
    """Overlay Grad-CAM heatmap on grayscale MRI slice."""
    # Normalize grayscale slice
    slice_norm = cv2.normalize(slice_2d, None, 0, 255, cv2.NORM_MINMAX)
    slice_rgb = cv2.cvtColor(slice_norm.astype(np.uint8), cv2.COLOR_GRAY2BGR)

    # Resize heatmap to match the MRI slice shape
    heatmap_resized = cv2.resize(heatmap, (slice_rgb.shape[1], slice_rgb.shape[0]))

    # Apply color map
    heatmap_color = cv2.applyColorMap(np.uint8(255 * heatmap_resized), cv2.COLORMAP_JET)

    # Overlay (blend)
    overlay = cv2.addWeighted(slice_rgb, 1 - alpha, heatmap_color, alpha, 0)
    return overlay

