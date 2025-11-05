# MADACE Kubernetes Manifests

This directory contains Kubernetes deployment manifests for **MADACE v3.0-alpha**.

## Files Overview

| File | Description |
|------|-------------|
| `00-namespace.yaml` | Creates `madace` namespace |
| `01-configmap.yaml` | Configuration values (environment variables) |
| `02-secret.yaml` | Sensitive data (API keys) - **EDIT BEFORE DEPLOYING** |
| `03-pvc.yaml` | Persistent Volume Claims for data storage |
| `04-deployment.yaml` | MADACE application deployment |
| `05-service.yaml` | Internal ClusterIP service |
| `06-ingress.yaml` | External HTTPS access - **EDIT DOMAIN** |
| `07-ollama-deployment.yaml` | Local LLM server (optional) |
| `08-ollama-service.yaml` | Ollama internal service (optional) |

## Quick Start

### 1. Configure Secrets

Edit `02-secret.yaml` and replace base64-encoded placeholders:

```bash
echo -n "your-api-key" | base64
```

### 2. Update Domain

Edit `06-ingress.yaml` and replace `madace.yourdomain.com` with your domain.

### 3. Deploy

```bash
# Apply all manifests
kubectl apply -f k8s/

# Or step by step
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secret.yaml
kubectl apply -f k8s/03-pvc.yaml
kubectl apply -f k8s/04-deployment.yaml
kubectl apply -f k8s/05-service.yaml
kubectl apply -f k8s/06-ingress.yaml

# Optional: Local LLM
kubectl apply -f k8s/07-ollama-deployment.yaml
kubectl apply -f k8s/08-ollama-service.yaml
```

### 4. Verify

```bash
kubectl get all -n madace
kubectl get ingress -n madace
```

## Documentation

See [KUBERNETES-DEPLOYMENT.md](../docs/KUBERNETES-DEPLOYMENT.md) for detailed deployment guide.

## Requirements

- Kubernetes v1.25+
- 2 CPU cores, 4GB RAM minimum
- Persistent storage provisioner
- Ingress controller (nginx, traefik, etc.)

## Support

- Docker Compose deployment: [docker-compose.yml](../docker-compose.yml)
- HTTPS deployment: [docker-compose.https.yml](../docker-compose.https.yml)
- Full documentation: [docs/](../docs/)
