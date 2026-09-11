#!/usr/bin/env bash
set -euo pipefail

CLUSTER_NAME="devnotes"
NAMESPACE="devnotes"

echo ">>> Building Docker images..."
cd "$(git rev-parse --show-toplevel)"
docker compose build api web

echo ">>> Loading images into kind cluster..."
kind load docker-image devnotes-ai-api:latest --name "${CLUSTER_NAME}"
kind load docker-image devnotes-ai-web:latest --name "${CLUSTER_NAME}"

echo ">>> Applying manifests..."
kubectl apply -f infra/k8s/00-namespace.yaml
kubectl apply -f infra/k8s/01-secrets.yaml
kubectl apply -f infra/k8s/10-mongodb.yaml
kubectl apply -f infra/k8s/20-api.yaml
kubectl apply -f infra/k8s/30-web.yaml
kubectl apply -f infra/k8s/40-ingress.yaml
kubectl apply -f infra/k8s/50-hpa.yaml

echo ">>> Waiting for MongoDB replica set..."
kubectl wait --for=condition=ready pod -l app=devnotes-mongodb-svc -n "${NAMESPACE}" --timeout=300s

echo ">>> Waiting for API..."
kubectl rollout status deployment/devnotes-api -n "${NAMESPACE}" --timeout=180s

echo ">>> Waiting for Web..."
kubectl rollout status deployment/devnotes-web -n "${NAMESPACE}" --timeout=180s

echo ""
echo "✅ Deploy complete."
echo ""
echo "API:  http://api.devnotes.local:8080/graphql"
echo "Web:  http://web.devnotes.local:8080"
echo ""
echo "Add to /etc/hosts if not already:"
echo "  127.0.0.1 api.devnotes.local web.devnotes.local"