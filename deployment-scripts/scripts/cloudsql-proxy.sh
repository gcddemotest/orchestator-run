#!/bin/bash -e

## Install and Configure CloudProxy for CentOS 7 or Debian 8,9
curl -LSso /usr/local/bin/cloud_sql_proxy https://dl.google.com/cloudsql/cloud_sql_proxy.linux.amd64
chmod +x /usr/local/bin/cloud_sql_proxy
adduser --system --shell /sbin/nologin --home /var/cloudsql cloudsql
chmod 755 /var/cloudsql
touch /etc/systemd/system/cloud-sql-proxy.service
cat <<EOF | tee /etc/systemd/system/cloud-sql-proxy.service
Description=Google Cloud Compute Engine SQL Proxy
After=network.target google-instance-setup.service google-network-setup.service
After=networking.service

[Service]
Type=simple
UMask=022
WorkingDirectory=/var/cloudsql
ExecStart=/usr/local/bin/cloud_sql_proxy -dir=/var/cloudsql -verbose -instances_metadata=instance/attributes/cloud-sql-instances
Restart=always
User=cloudsql

[Install]
WantedBy=multi-user.target
EOF

systemctl enable cloud-sql-proxy
systemctl start cloud-sql-proxy
