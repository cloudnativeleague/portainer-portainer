#!/usr/bin/env bash

ARCHIVE_BUILD_FOLDER="/tmp/portainer-builds"

# parameter: "platform-architecture"
function build_and_push_images() {
  echo "build and push images ..."
  sleep 3s
  docker build -t "abelit/containerpeacock:$1-${VERSION}" -f build/linux/Dockerfile .
  docker tag "abelit/containerpeacock:$1-${VERSION}" "abelit/containerpeacock:$1"
  docker push "abelit/containerpeacock:$1-${VERSION}"
  docker push "abelit/containerpeacock:$1"
}

# parameter: "platform-architecture"
function build_archive() {
  echo "build archive ..."
  sleep 3s
  BUILD_FOLDER="${ARCHIVE_BUILD_FOLDER}/$1"
  rm -rf ${BUILD_FOLDER} && mkdir -pv ${BUILD_FOLDER}/portainer
  cp -r dist/* ${BUILD_FOLDER}/portainer/
  cd ${BUILD_FOLDER}
  tar cvpfz "containerpeacock-${VERSION}-$1.tar.gz" portainer
  mv "containerpeacock-${VERSION}-$1.tar.gz" ${ARCHIVE_BUILD_FOLDER}/
  cd -
}

function build_all() {
  mkdir -pv "${ARCHIVE_BUILD_FOLDER}"
  for tag in $@; do
    echo "release:$(echo "$tag" | tr '-' ':')"
    sleep 3s
    yarn grunt "release:$(echo "$tag" | tr '-' ':')"
    name="portainer"
    if [ "$(echo "$tag" | cut -c1)" = "w" ]; then name="${name}.exe"; fi
    mv dist/portainer-$tag* dist/$name
    if [ $(echo $tag | cut -d \- -f 1) == 'linux' ]; then build_and_push_images "$tag"; fi
    build_archive "$tag"
  done
  docker rmi $(docker images -q -f dangling=true)
}

function build_local() {
  mkdir -pv "${ARCHIVE_BUILD_FOLDER}"
  for tag in $@; do
    echo "releaselocal:$(echo "$tag" | tr '-' ':')"
    sleep 3s
    yarn grunt "releaselocal:$(echo "$tag" | tr '-' ':')"
    name="portainer"
    if [ "$(echo "$tag" | cut -c1)" = "w" ]; then name="${name}.exe"; fi
    mv dist/portainer-$tag* dist/$name
    if [ $(echo $tag | cut -d \- -f 1) == 'linux' ]; then build_and_push_images "$tag"; fi
    build_archive "$tag"
  done
  docker rmi $(docker images -q -f dangling=true)
}

if [[ $# -ne 1 ]]; then
  echo "Usage: $(basename $0) <VERSION>"
  echo "       $(basename $0) \"echo 'Custom' && <BASH COMMANDS>\""
  exit 1
else
  VERSION="$1"
  if [ $(echo "$@" | cut -c1-4) == 'echo' ]; then
    echo "build special one ..."
    # echo $@
    bash -c "$@"
  else
    echo "build all ..."
    # build_all 'linux-amd64 linux-arm linux-arm64 linux-ppc64le linux-s390x darwin-amd64 windows-amd64'
    # build_local 'linux-arm64'
    # build_all 'linux-arm64 linux-amd64'
    build_all 'linux-amd64'
    exit 0
  fi
fi
