#!/bin/bash
set -e

echo ">>> Configurando submódulos con GITHUB_TOKEN..."

# Sobrescribe la URL del submódulo con el token
git config -f .gitmodules submodule.lib-core-dtos.url "https://${GITHUB_TOKEN}@github.com/juliaosistem/lib-core-dtos.git"

git submodule sync
git submodule update --init --recursive
