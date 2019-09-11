#!/bin/bash -e

# export metadata configs to env 
touch /opt/metadata.yaml

echo "blackbox-address: $(curl -H Metadata-Flavor:Google http://metadata/computeMetadata/v1/instance/attributes/blackbox-address)" >> /opt/metadata.yaml
echo "docker-app-address: $(curl -H Metadata-Flavor:Google http://metadata/computeMetadata/v1/instance/attributes/docker-app-address)" >> /opt/metadata.yaml
