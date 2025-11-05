# MADACE Kubernetes Deployment Guide

This guide explains how to deploy **MADACE v3.0-alpha** on Kubernetes clusters.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)
- [Configuration](#configuration)
- [Deployment Options](#deployment-options)
- [Scaling](#scaling)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)
- [Production Considerations](#production-considerations)

---

## Prerequisites

### Required Tools

- `kubectl` CLI (v1.25+)
- Kubernetes cluster (v1.25+)
- `helm` (optional, for advanced deployments)
- Docker registry access (for custom images)

### Cluster Requirements

**Minimum Resources:**
- 2 CPU cores
- 4GB RAM
- 20GB persistent storage

**Recommended Resources:**
- 4 CPU cores
- 8GB RAM
- 50GB persistent storage
- Ingress Controller (nginx, traefik, etc.)
- cert-manager (for TLS certificates)

### Kubernetes Providers Tested

- ✅ **Google Kubernetes Engine (GKE)**
- ✅ **Amazon EKS**
- ✅ **Azure AKS**
- ✅ **DigitalOcean Kubernetes**
- ✅ **Minikube** (local development)
- ✅ **k3s** (lightweight Kubernetes)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Kubernetes Cluster                     │
│                                                          │
│  ┌─────────────┐        ┌──────────────────────────┐   │
│  │   Ingress   │───────▶│   MADACE Service         │   │
│  │  Controller │        │   (ClusterIP:80)         │   │
│  └─────────────┘        └──────────────────────────┘   │
│         │                           │                   │
│         │                  ┌────────▼────────┐          │
│         │                  │  MADACE Pod     │          │
│         │                  │  - Next.js App  │          │
│         │                  │  - Health Check │          │
│         │                  │  Port: 3000     │          │
│         │                  └─────────────────┘          │
│         │                           │                   │
│         │              ┌────────────▼────────────┐      │
│         │              │  PersistentVolume       │      │
│         │              │  /app/data (10Gi)       │      │
│         │              └─────────────────────────┘      │
│         │                                                │
│         │   (Optional Local LLM)                        │
│         │              ┌──────────────────────────┐     │
│         └─────────────▶│   Ollama Service         │     │
│                        │   (ClusterIP:11434)      │     │
│                        └──────────────────────────┘     │
│                                   │                      │
│                          ┌────────▼────────┐            │
│                          │  Ollama Pod     │            │
│                          │  - LLM Models   │            │
│                          │  Port: 11434    │            │
│                          └─────────────────┘            │
│                                   │                      │
│                      ┌────────────▼────────────┐        │
│                      │  PersistentVolume       │        │
│                      │  /root/.ollama (50Gi)   │        │
│                      └─────────────────────────┘        │
└──────────────────────────────────────────────────────────┘
```

---

## Quick Start

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/MADACE-Method-v2.0.git
cd MADACE-Method-v2.0
```

### 2. Configure Secrets

Edit `k8s/02-secret.yaml` and replace placeholder values:

```bash
# Encode your API keys
echo -n "your-gemini-api-key" | base64
echo -n "your-claude-api-key" | base64
echo -n "your-openai-api-key" | base64

# Update k8s/02-secret.yaml with encoded values
vim k8s/02-secret.yaml
```

### 3. Update Configuration

Edit `k8s/01-configmap.yaml` if you need to change:
- Environment variables
- LLM provider settings
- Database configuration

### 4. Update Ingress Domain

Edit `k8s/06-ingress.yaml`:

```yaml
spec:
  tls:
    - hosts:
        - madace.yourdomain.com  # Change this
      secretName: madace-tls-secret

  rules:
    - host: madace.yourdomain.com  # Change this
```

### 5. Deploy to Kubernetes

```bash
# Apply all manifests
kubectl apply -f k8s/

# Or apply in order
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secret.yaml
kubectl apply -f k8s/03-pvc.yaml
kubectl apply -f k8s/04-deployment.yaml
kubectl apply -f k8s/05-service.yaml
kubectl apply -f k8s/06-ingress.yaml

# Optional: Deploy Ollama for local LLM
kubectl apply -f k8s/07-ollama-deployment.yaml
kubectl apply -f k8s/08-ollama-service.yaml
```

### 6. Verify Deployment

```bash
# Check namespace
kubectl get all -n madace

# Check pods
kubectl get pods -n madace
kubectl logs -f -n madace deployment/madace

# Check services
kubectl get svc -n madace

# Check ingress
kubectl get ingress -n madace
kubectl describe ingress madace-ingress -n madace
```

### 7. Access Application

```bash
# Get external IP (LoadBalancer) or Ingress URL
kubectl get ingress -n madace

# Access via browser
https://madace.yourdomain.com
```

---

## Configuration

### Environment Variables

All configuration is managed via ConfigMap (`k8s/01-configmap.yaml`):

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node.js environment |
| `PORT` | `3000` | Application port |
| `MADACE_DATA_DIR` | `/app/data` | Data directory path |
| `LOCAL_MODEL_URL` | `http://ollama-service:11434` | Ollama service URL |
| `LOCAL_MODEL_NAME` | `gemma3` | Default local model |
| `DATABASE_URL` | `file:/app/data/database/madace.db` | SQLite database path |

### Secrets

API keys are stored in Kubernetes Secrets (`k8s/02-secret.yaml`):

- `GEMINI_API_KEY` - Google Gemini API key
- `CLAUDE_API_KEY` - Anthropic Claude API key
- `OPENAI_API_KEY` - OpenAI API key

### Persistent Storage

Two PersistentVolumeClaims are created:

1. **madace-data-pvc** (10Gi) - Application data
   - User files
   - Database
   - Configuration
   - Generated content

2. **ollama-data-pvc** (50Gi) - LLM models
   - Downloaded models
   - Model cache

---

## Deployment Options

### Option 1: Minimal Deployment (No Local LLM)

```bash
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secret.yaml
kubectl apply -f k8s/03-pvc.yaml
kubectl apply -f k8s/04-deployment.yaml
kubectl apply -f k8s/05-service.yaml
kubectl apply -f k8s/06-ingress.yaml
```

Use external LLM providers (Gemini, Claude, OpenAI) only.

### Option 2: Full Deployment (With Local LLM)

```bash
kubectl apply -f k8s/
```

Includes Ollama for local model support.

### Option 3: Development (No Ingress)

```bash
kubectl apply -f k8s/00-namespace.yaml
kubectl apply -f k8s/01-configmap.yaml
kubectl apply -f k8s/02-secret.yaml
kubectl apply -f k8s/03-pvc.yaml
kubectl apply -f k8s/04-deployment.yaml
kubectl apply -f k8s/05-service.yaml

# Port-forward for local access
kubectl port-forward -n madace svc/madace-service 3000:80
```

Access at `http://localhost:3000`

---

## Scaling

### Horizontal Scaling

```bash
# Scale MADACE pods
kubectl scale deployment madace -n madace --replicas=3

# Verify scaling
kubectl get pods -n madace
```

**Note:** Ollama should NOT be scaled (stateful LLM server).

### Vertical Scaling

Edit resource limits in `k8s/04-deployment.yaml`:

```yaml
resources:
  limits:
    cpu: "4000m"      # Increase for more performance
    memory: "4Gi"
  requests:
    cpu: "1000m"
    memory: "1Gi"
```

Apply changes:

```bash
kubectl apply -f k8s/04-deployment.yaml
```

### Auto-scaling (HPA)

```bash
# Create Horizontal Pod Autoscaler
kubectl autoscale deployment madace -n madace \
  --cpu-percent=70 \
  --min=2 \
  --max=10
```

---

## Monitoring

### Health Checks

```bash
# Check pod health
kubectl get pods -n madace

# Check health endpoint
kubectl exec -it -n madace deployment/madace -- \
  curl http://localhost:3000/api/health
```

### Logs

```bash
# View logs
kubectl logs -f -n madace deployment/madace

# View previous logs (if crashed)
kubectl logs -n madace deployment/madace --previous

# View logs for specific pod
kubectl logs -f -n madace madace-<pod-id>
```

### Resource Usage

```bash
# View resource usage
kubectl top pods -n madace

# View node usage
kubectl top nodes
```

### Events

```bash
# View events
kubectl get events -n madace --sort-by='.lastTimestamp'
```

---

## Troubleshooting

### Pod Not Starting

```bash
# Check pod status
kubectl describe pod -n madace madace-<pod-id>

# Check logs
kubectl logs -n madace madace-<pod-id>

# Common issues:
# 1. ImagePullBackOff - Check image name/registry
# 2. CrashLoopBackOff - Check logs for errors
# 3. Pending - Check PVC binding and node resources
```

### PVC Not Binding

```bash
# Check PVC status
kubectl get pvc -n madace

# Check available storage classes
kubectl get storageclass

# Update PVC to use correct storage class
kubectl edit pvc madace-data-pvc -n madace
```

### Ingress Not Working

```bash
# Check ingress status
kubectl describe ingress -n madace madace-ingress

# Verify ingress controller is installed
kubectl get pods -n ingress-nginx

# Check ingress controller logs
kubectl logs -n ingress-nginx deployment/ingress-nginx-controller
```

### Database Issues

```bash
# Check if database file exists
kubectl exec -it -n madace deployment/madace -- \
  ls -la /app/data/database/

# Initialize database
kubectl exec -it -n madace deployment/madace -- \
  npx prisma db push
```

---

## Production Considerations

### 1. Use External Database

Replace SQLite with PostgreSQL for production:

**Deploy PostgreSQL:**

```bash
helm install postgres bitnami/postgresql \
  --namespace madace \
  --set auth.username=madace \
  --set auth.password=secure-password \
  --set auth.database=madace
```

**Update ConfigMap:**

```yaml
data:
  DATABASE_URL: "postgresql://madace:secure-password@postgres:5432/madace"
```

### 2. Enable TLS/HTTPS

Install cert-manager:

```bash
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.13.0/cert-manager.yaml
```

Create ClusterIssuer:

```yaml
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: your-email@example.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
      - http01:
          ingress:
            class: nginx
```

Update Ingress annotations:

```yaml
annotations:
  cert-manager.io/cluster-issuer: "letsencrypt-prod"
```

### 3. Backup Strategy

```bash
# Backup PVC data
kubectl exec -n madace deployment/madace -- \
  tar czf /tmp/backup.tar.gz /app/data

kubectl cp madace/<pod-name>:/tmp/backup.tar.gz ./backup-$(date +%Y%m%d).tar.gz
```

Automate with CronJob:

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: madace-backup
  namespace: madace
spec:
  schedule: "0 2 * * *"  # Daily at 2 AM
  jobTemplate:
    spec:
      template:
        spec:
          containers:
            - name: backup
              image: madace-web:latest
              command:
                - /bin/sh
                - -c
                - tar czf /backup/madace-$(date +%Y%m%d).tar.gz /app/data
              volumeMounts:
                - name: madace-data
                  mountPath: /app/data
                - name: backup
                  mountPath: /backup
          restartPolicy: OnFailure
          volumes:
            - name: madace-data
              persistentVolumeClaim:
                claimName: madace-data-pvc
            - name: backup
              persistentVolumeClaim:
                claimName: backup-pvc
```

### 4. Resource Quotas

Limit namespace resources:

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: madace-quota
  namespace: madace
spec:
  hard:
    requests.cpu: "8"
    requests.memory: "16Gi"
    persistentvolumeclaims: "5"
```

### 5. Network Policies

Restrict network access:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: madace-network-policy
  namespace: madace
spec:
  podSelector:
    matchLabels:
      app: madace
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              name: ingress-nginx
      ports:
        - protocol: TCP
          port: 3000
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: ollama
      ports:
        - protocol: TCP
          port: 11434
    - to:
        - namespaceSelector: {}
      ports:
        - protocol: TCP
          port: 443  # HTTPS
        - protocol: TCP
          port: 53   # DNS
      - protocol: UDP
          port: 53
```

### 6. Monitoring with Prometheus

Install Prometheus Operator:

```bash
helm install prometheus prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace
```

Add ServiceMonitor:

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: madace-monitor
  namespace: madace
spec:
  selector:
    matchLabels:
      app: madace
  endpoints:
    - port: http
      path: /api/health
      interval: 30s
```

---

## Summary

MADACE v3.0-alpha is fully compatible with Kubernetes and production-ready for deployment in any Kubernetes cluster. The provided manifests follow best practices for security, scalability, and reliability.

**Key Features:**

- ✅ Multi-stage Docker build (optimized image size)
- ✅ Non-root user (security)
- ✅ Health probes (liveness, readiness, startup)
- ✅ Resource limits (CPU, memory)
- ✅ Persistent storage (data, models)
- ✅ Horizontal scaling support
- ✅ WebSocket support (sticky sessions)
- ✅ TLS/HTTPS ready
- ✅ Optional local LLM (Ollama)

**For additional help:**
- GitHub Issues: https://github.com/yourusername/MADACE-Method-v2.0/issues
- Documentation: https://docs.madace.io (if available)
