# MADACE Podman Deployment Guide

This guide explains how to deploy **MADACE v3.0** using Podman as a Docker alternative.

## Table of Contents

- [What is Podman?](#what-is-podman)
- [Why Use Podman?](#why-use-podman)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Deployment Options](#deployment-options)
- [Podman vs Docker Commands](#podman-vs-docker-commands)
- [Rootless Containers](#rootless-containers)
- [Troubleshooting](#troubleshooting)
- [Production Deployment](#production-deployment)

---

## What is Podman?

**Podman** (Pod Manager) is a daemonless container engine for developing, managing, and running OCI Containers on Linux. It's a drop-in replacement for Docker with enhanced security features.

**Key Features:**
- ✅ **Daemonless**: No background daemon required
- ✅ **Rootless**: Run containers without root privileges
- ✅ **Docker-Compatible**: Uses same Dockerfile and commands
- ✅ **Pod Support**: Native Kubernetes pod concepts
- ✅ **No Single Point of Failure**: Each container runs independently
- ✅ **Systemd Integration**: Native systemd service support

**Official Website**: https://podman.io/

---

## Why Use Podman?

### Security Advantages

1. **Rootless by Default**: Containers run as non-root users
2. **No Daemon**: No privileged background process
3. **User Namespaces**: Better isolation between containers
4. **SELinux Integration**: Enhanced security on RHEL/Fedora

### Operational Benefits

1. **Lighter Resource Usage**: No daemon overhead
2. **Systemd Integration**: Easy service management
3. **Kubernetes Compatibility**: Generate K8s YAML from pods
4. **Fork/Exec Model**: More traditional Unix process model

### When to Use Podman

- ✅ Running on Linux (primary platform)
- ✅ Security-sensitive environments
- ✅ RHEL/Fedora/CentOS systems
- ✅ Rootless container requirements
- ✅ Systemd-managed services

### When to Use Docker

- Docker Desktop on macOS/Windows
- Existing Docker-based CI/CD pipelines
- Docker Swarm deployments
- Team familiarity with Docker

---

## Prerequisites

### System Requirements

**Operating System:**
- Linux (primary platform): RHEL 8+, Fedora 28+, Ubuntu 20.04+, Debian 10+
- macOS: Via Podman Machine (Lima VM)
- Windows: Via WSL2 + Podman

**Resources:**
- 2GB RAM minimum (4GB recommended)
- 1GB disk space (for production image)
- 5GB disk space (for development with Ollama)

### Installing Podman

#### RHEL/CentOS/Fedora

```bash
# RHEL 8+ / CentOS Stream 8+
sudo dnf install podman

# Fedora
sudo dnf install podman
```

#### Ubuntu/Debian

```bash
# Ubuntu 20.10+
sudo apt-get update
sudo apt-get install podman

# Ubuntu 20.04 (requires PPA)
sudo apt-get update
sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:projectatomic/ppa
sudo apt-get update
sudo apt-get install podman
```

#### macOS

```bash
# Install Podman via Homebrew
brew install podman

# Initialize Podman machine (creates Lima VM)
podman machine init
podman machine start
```

#### Windows (WSL2)

```powershell
# Install WSL2 with Ubuntu
wsl --install

# Inside WSL2 Ubuntu, install Podman
sudo apt-get update
sudo apt-get install podman
```

### Installing podman-compose (Optional)

For docker-compose file compatibility:

```bash
# Via pip (Python 3)
pip3 install podman-compose

# Verify installation
podman-compose --version
```

**Note**: podman-compose is not required for basic Podman usage but provides docker-compose compatibility.

---

## Quick Start

### Option 1: Production Deployment (Podman CLI)

```bash
# 1. Clone repository
git clone https://github.com/tekcin/MADACE-Method-v2.git
cd MADACE-Method-v2.0

# 2. Create data folder
mkdir madace-data

# 3. Build image with Podman
podman build -t madace-web:latest .

# 4. Run container
podman run -d \
  --name madace \
  -p 3000:3000 \
  -v ./madace-data:/app/data:Z \
  madace-web:latest

# 5. Access web UI
# Open http://localhost:3000
```

**Important**: The `:Z` flag in the volume mount sets the correct SELinux context on RHEL/Fedora systems. Omit on other systems if not using SELinux.

### Option 2: Using podman-compose (Docker Compose Compatibility)

```bash
# 1. Clone repository
git clone https://github.com/tekcin/MADACE-Method-v2.git
cd MADACE-Method-v2.0

# 2. Create data folder
mkdir madace-data

# 3. Start with podman-compose (uses existing docker-compose.yml)
podman-compose up -d

# 4. Access web UI
# Open http://localhost:3000
```

### Option 3: Rootless Deployment (Enhanced Security)

```bash
# 1. Run as non-root user (no sudo)
podman build -t madace-web:latest .

# 2. Run rootless container
podman run -d \
  --name madace \
  -p 3000:3000 \
  -v ./madace-data:/app/data:Z \
  --userns=keep-id \
  madace-web:latest

# Container runs entirely without root privileges!
```

---

## Deployment Options

### Production Deployment

**Perfect for:** Running MADACE in production, demos, staging

```bash
# Build production image
podman build -t madace-web:latest .

# Run production container
podman run -d \
  --name madace \
  -p 3000:3000 \
  -v ./madace-data:/app/data:Z \
  --restart=unless-stopped \
  madace-web:latest

# Verify running
podman ps
podman logs madace
```

**Features:**
- Optimized image (~200 MB)
- Production-ready Next.js build
- Rootless execution
- Auto-restart on failure

### Development with Hot Reload

**Perfect for:** Active development, code changes

```bash
# 1. Install dependencies locally
npm install

# 2. Run development server with Podman
podman run -d \
  --name madace-dev \
  -p 3000:3000 \
  -v $(pwd):/app:Z \
  -v /app/node_modules \
  -e NODE_ENV=development \
  --workdir /app \
  node:20-alpine \
  npm run dev

# 3. Access at http://localhost:3000
# Code changes automatically reload!
```

### Podman Pods (Kubernetes-Like)

**Perfect for:** Multi-container deployments (MADACE + Ollama)

```bash
# 1. Create a pod (like Kubernetes)
podman pod create \
  --name madace-pod \
  -p 3000:3000 \
  -p 11434:11434

# 2. Run MADACE in the pod
podman run -d \
  --pod madace-pod \
  --name madace \
  -v ./madace-data:/app/data:Z \
  madace-web:latest

# 3. Run Ollama in the same pod
podman run -d \
  --pod madace-pod \
  --name ollama \
  -v ./ollama-data:/root/.ollama:Z \
  ollama/ollama:latest

# 4. Both containers share the same network!
# MADACE can access Ollama at localhost:11434
```

**Advantages of Pods:**
- Containers share network namespace (localhost communication)
- Single point of management
- Kubernetes-compatible architecture
- Easy migration to Kubernetes later

### Systemd Integration

**Perfect for:** Production Linux servers, auto-start on boot

```bash
# 1. Run container normally first
podman run -d \
  --name madace \
  -p 3000:3000 \
  -v ./madace-data:/app/data:Z \
  madace-web:latest

# 2. Generate systemd service file
podman generate systemd --name madace --files --new

# 3. Move service file to systemd directory
sudo mv container-madace.service /etc/systemd/system/

# 4. Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable container-madace.service
sudo systemctl start container-madace.service

# 5. Verify service status
sudo systemctl status container-madace.service

# Now MADACE starts automatically on boot!
```

---

## Podman vs Docker Commands

Podman commands are nearly identical to Docker. Here's a reference:

### Container Management

| Docker Command | Podman Command | Description |
|----------------|----------------|-------------|
| `docker build -t image .` | `podman build -t image .` | Build image |
| `docker run -d image` | `podman run -d image` | Run container |
| `docker ps` | `podman ps` | List running containers |
| `docker ps -a` | `podman ps -a` | List all containers |
| `docker logs container` | `podman logs container` | View logs |
| `docker exec -it container bash` | `podman exec -it container bash` | Interactive shell |
| `docker stop container` | `podman stop container` | Stop container |
| `docker rm container` | `podman rm container` | Remove container |
| `docker images` | `podman images` | List images |
| `docker rmi image` | `podman rmi image` | Remove image |

### Compose Commands

| docker-compose | podman-compose | Description |
|----------------|----------------|-------------|
| `docker-compose up -d` | `podman-compose up -d` | Start services |
| `docker-compose down` | `podman-compose down` | Stop services |
| `docker-compose logs` | `podman-compose logs` | View logs |
| `docker-compose ps` | `podman-compose ps` | List services |

### Alias for Compatibility

Create an alias for seamless transition:

```bash
# Add to ~/.bashrc or ~/.zshrc
alias docker=podman
alias docker-compose=podman-compose

# Reload shell
source ~/.bashrc
```

---

## Rootless Containers

One of Podman's biggest advantages is **rootless container execution**.

### What is Rootless?

- Containers run as your normal user (not root)
- No privileged daemon required
- Enhanced security isolation
- Safer for multi-user systems

### Running Rootless MADACE

```bash
# No sudo required!
podman build -t madace-web:latest .

podman run -d \
  --name madace \
  -p 3000:3000 \
  -v ./madace-data:/app/data:Z \
  --userns=keep-id \
  madace-web:latest

# Check process owner (it's YOUR user, not root!)
ps aux | grep madace
```

### Port Binding < 1024 (Rootless)

By default, non-root users can't bind to ports < 1024. Two options:

**Option 1: Use ports ≥ 1024 (Recommended)**

```bash
# Use port 3000 (default, works rootless)
podman run -d -p 3000:3000 madace-web:latest

# Use port 8080 for HTTP
podman run -d -p 8080:3000 madace-web:latest
```

**Option 2: Allow low ports for rootless Podman**

```bash
# Allow unprivileged users to bind to low ports (one-time setup)
echo 'net.ipv4.ip_unprivileged_port_start=80' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Now you can use port 80 rootless
podman run -d -p 80:3000 madace-web:latest
```

### File Permissions (Rootless + Volumes)

When running rootless, volume files are owned by your user:

```bash
# Create data directory
mkdir madace-data

# Run rootless container with --userns=keep-id
podman run -d \
  --name madace \
  -p 3000:3000 \
  -v ./madace-data:/app/data:Z \
  --userns=keep-id \
  madace-web:latest

# Files created in madace-data/ are owned by YOUR user
ls -la madace-data/
# drwxr-xr-x  youruser yourgroup ...
```

---

## Troubleshooting

### Issue 1: SELinux Denials (RHEL/Fedora/CentOS)

**Problem**: Permission denied errors with volumes

**Solution**: Use `:Z` flag for SELinux context

```bash
# Correct (with :Z flag)
podman run -v ./data:/app/data:Z image

# Incorrect (missing :Z)
podman run -v ./data:/app/data image
```

### Issue 2: Port Already in Use

**Problem**: `Error: cannot listen on the TCP port: address already in use`

**Solution**: Check what's using the port

```bash
# Find process using port 3000
sudo lsof -i :3000

# Stop conflicting container
podman stop <container-name>

# Or use a different port
podman run -p 3001:3000 image
```

### Issue 3: Image Build Fails

**Problem**: Build errors or layer failures

**Solution**: Clear buildah cache

```bash
# Clear Podman build cache
podman system prune -a

# Rebuild without cache
podman build --no-cache -t madace-web:latest .
```

### Issue 4: Container Not Starting

**Problem**: Container exits immediately

**Solution**: Check logs

```bash
# View container logs
podman logs madace

# Run container in foreground for debugging
podman run --rm -it madace-web:latest

# Check if health endpoint is accessible
podman exec madace curl http://localhost:3000/api/health
```

### Issue 5: Rootless Container Can't Access Network

**Problem**: DNS or network connectivity issues

**Solution**: Configure slirp4netns

```bash
# Install slirp4netns (if not installed)
sudo dnf install slirp4netns  # RHEL/Fedora
sudo apt-get install slirp4netns  # Ubuntu/Debian

# Run with explicit network mode
podman run --network=slirp4netns -d image
```

### Issue 6: podman-compose Not Found

**Problem**: `command not found: podman-compose`

**Solution**: Install podman-compose

```bash
# Install via pip
pip3 install podman-compose

# Verify installation
podman-compose --version

# Add to PATH if needed
export PATH="$HOME/.local/bin:$PATH"
```

---

## Production Deployment

### Best Practices

1. **Use Systemd for Auto-Start**

```bash
# Generate service file
podman generate systemd --name madace --files --new

# Install and enable
sudo mv container-madace.service /etc/systemd/system/
sudo systemctl enable --now container-madace.service
```

2. **Configure Health Checks**

```bash
# Run with health check
podman run -d \
  --name madace \
  --health-cmd='curl -f http://localhost:3000/api/health || exit 1' \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  madace-web:latest
```

3. **Set Resource Limits**

```bash
# Limit CPU and memory
podman run -d \
  --name madace \
  --cpus=2 \
  --memory=2g \
  madace-web:latest
```

4. **Enable Auto-Restart**

```bash
# Restart policy
podman run -d \
  --name madace \
  --restart=unless-stopped \
  madace-web:latest
```

5. **Use Rootless for Security**

```bash
# Run entirely rootless
podman run -d \
  --name madace \
  -p 3000:3000 \
  -v ./madace-data:/app/data:Z \
  --userns=keep-id \
  --restart=unless-stopped \
  madace-web:latest
```

### Backup and Restore

**Backup:**

```bash
# Stop container
podman stop madace

# Backup data directory
tar -czf madace-backup-$(date +%Y%m%d).tar.gz madace-data/

# Export container as image (optional)
podman commit madace madace-backup:$(date +%Y%m%d)
podman save madace-backup:$(date +%Y%m%d) -o madace-image-backup.tar
```

**Restore:**

```bash
# Extract data backup
tar -xzf madace-backup-20251105.tar.gz

# Import image (if backed up)
podman load -i madace-image-backup.tar

# Start container
podman run -d \
  --name madace \
  -p 3000:3000 \
  -v ./madace-data:/app/data:Z \
  madace-web:latest
```

### Monitoring

```bash
# View real-time stats
podman stats madace

# View logs with timestamps
podman logs -f --since 1h madace

# Inspect container
podman inspect madace

# Check health status
podman healthcheck run madace
```

### Updates

```bash
# Pull latest image
podman pull madace-web:latest

# Stop and remove old container
podman stop madace
podman rm madace

# Start new container with same config
podman run -d \
  --name madace \
  -p 3000:3000 \
  -v ./madace-data:/app/data:Z \
  --restart=unless-stopped \
  madace-web:latest
```

---

## Comparison: Podman vs Docker

| Feature | Podman | Docker |
|---------|--------|--------|
| **Daemon** | ❌ Daemonless | ✅ Requires daemon |
| **Rootless** | ✅ Native | ⚠️ Experimental |
| **Security** | ✅ Enhanced (no daemon) | ⚠️ Daemon runs as root |
| **Systemd** | ✅ Native integration | ⚠️ Requires workarounds |
| **Pods** | ✅ Native support | ❌ No pods |
| **Compose** | ⚠️ Via podman-compose | ✅ Native |
| **Swarm** | ❌ Not supported | ✅ Native |
| **Desktop** | ⚠️ Linux-first | ✅ macOS/Windows |
| **Kubernetes** | ✅ Generate YAML | ❌ No direct support |
| **CLI Compatibility** | ✅ 95%+ compatible | N/A |

---

## Additional Resources

- **Podman Official Docs**: https://docs.podman.io/
- **Podman GitHub**: https://github.com/containers/podman
- **podman-compose**: https://github.com/containers/podman-compose
- **Podman Desktop**: https://podman-desktop.io/
- **Podman Tutorial**: https://github.com/containers/podman/blob/main/docs/tutorials/podman_tutorial.md

---

## Summary

MADACE v3.0 is fully compatible with Podman. Key advantages:

✅ **Drop-in replacement**: Same Dockerfile, same commands (almost)
✅ **Enhanced security**: Rootless, daemonless execution
✅ **Production-ready**: Systemd integration, health checks, auto-restart
✅ **Kubernetes-compatible**: Pods and YAML generation
✅ **Zero breaking changes**: Existing Docker setup works with Podman

**Recommended for:**
- Linux production servers
- Security-sensitive environments
- RHEL/Fedora/CentOS systems
- Rootless container requirements

**Quick Start Command:**

```bash
podman run -d --name madace -p 3000:3000 -v ./madace-data:/app/data:Z madace-web:latest
```

For more deployment options, see [README.md](../README.md) and [ARCHITECTURE.md](../ARCHITECTURE.md).
