import torch
from PIL import Image
from torchvision import transforms
import torchvision

# Load model once
model = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=True)
model.eval()

COCO_INSTANCE_CATEGORY_NAMES = [
    '__background__', 'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus',
    'train', 'truck', 'boat', 'traffic light', 'fire hydrant', 'stop sign',
    'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse', 'sheep', 'cow',
    'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag',
    'tie', 'suitcase', 'frisbee', 'skis', 'snowboard', 'sports ball', 'kite',
    'baseball bat', 'baseball glove', 'skateboard', 'surfboard', 'tennis racket',
    'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana',
    'apple', 'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza',
    'donut', 'cake', 'chair', 'couch', 'potted plant', 'bed', 'dining table',
    'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone',
    'microwave', 'oven', 'toaster', 'sink', 'refrigerator', 'book', 'clock',
    'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
]

def predict_image(image_path, score_threshold=0.5, max_results=10):
    image = Image.open(image_path).convert("RGB")

    transform = transforms.Compose([
        transforms.ToTensor()
    ])
    image_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(image_tensor)

    scores = outputs[0]['scores']
    labels = outputs[0]['labels']

    results = []

    for i in range(len(scores)):
        score = scores[i].item()
        if score >= score_threshold:
            label_idx = labels[i].item()
            if label_idx < len(COCO_INSTANCE_CATEGORY_NAMES):
                label = COCO_INSTANCE_CATEGORY_NAMES[label_idx]
            else:
                label = 'unknown'
            results.append({
                "label": label,
                "confidence": round(score, 2)
            })

    # Sort descending by confidence
    results = sorted(results, key=lambda x: x['confidence'], reverse=True)

    # Limit results to max_results
    results = results[:max_results]

    return results
