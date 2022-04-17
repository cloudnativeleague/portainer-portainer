#!/usr/bin/env bash

PLATFORM=$1
ARCH=$2
KOMPOSE_VERSION=$3

if [ "${PLATFORM}" == 'windows' ]; then
  wget -O "dist/kompose.exe" "https://github.com/kubernetes/kompose/releases/download/${KOMPOSE_VERSION}/kompose-windows-amd64.exe"
  chmod +x "dist/kompose.exe"
else
  # wget -O "dist/kompose" "https://github.com/kubernetes/kompose/releases/download/${KOMPOSE_VERSION}/kompose-${PLATFORM}-${ARCH}"
  curl -x socks5h://127.0.0.1:1080 -L -o "dist/kompose" "https://github.com/kubernetes/kompose/releases/download/${KOMPOSE_VERSION}/kompose-${PLATFORM}-${ARCH}"
  echo "https://github.com/kubernetes/kompose/releases/download/${KOMPOSE_VERSION}/kompose-${PLATFORM}-${ARCH}"
  chmod +x "dist/kompose"
fi

exit 0
